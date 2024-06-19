<script setup lang="ts">
/**
 * 開啟相機掃描QR Code
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import jsQR from 'jsqr'
import dialogCatImg from '@/assets/images/cat/dialog-cat.png'
import content from '@/assets/content'

import { useFetchData } from '@/composable/useFetch'
import ScanResult from '@/components/ScanResult.vue'
import HeaderMenu from '@/components/HeaderMenu.vue'

import { useLayoutStore } from '@/stores/layout'
const { parseParamCT, parseClientLocation, verifyCtString, commitStoreCheckIn } = useFetchData()
const layoutStore = useLayoutStore()
const route = useRoute()

// https://github.com/cozmo/jsQR/blob/master/docs/index.html
const canvasVisible = ref(false)
const videoLoading = ref(false)
const qrCodeOutputData = ref<string>('')

let video: HTMLVideoElement | null = null
let canvasElement: HTMLCanvasElement | null = null
let canvasCtx: CanvasRenderingContext2D | null = null

// 畫線
const drawLine = (
  begin: { x: number; y: number },
  end: { x: number; y: number },
  color: string = '#FF3B58'
) => {
  if (!canvasCtx) return
  canvasCtx.beginPath()
  canvasCtx.moveTo(begin.x, begin.y)
  canvasCtx.lineTo(end.x, end.y)
  canvasCtx.lineWidth = 4
  canvasCtx.strokeStyle = color
  canvasCtx.stroke()
}

// 在 Canvas 的左右兩側各繪製一個半透明的黑色矩形，使得中間的 450x450 方格保持可見。
const OverlayColor = 'rgba(0, 0, 0, 0.5)'
const drawOverlayLeftRight = () => {
  if (!canvasElement || !canvasCtx) return
  const visibleArea = 450
  const canvasW = canvasElement.width
  const canvasH = canvasElement.height
  canvasCtx.fillStyle = OverlayColor
  // 左邊遮罩
  canvasCtx.fillRect(0, 0, (canvasW - visibleArea) / 2, canvasH)
  // 右邊遮罩
  canvasCtx.fillRect(canvasW - (canvasW - visibleArea) / 2, 0, (canvasW - visibleArea) / 2, canvasH)
}
// 在 Canvas 的上下兩側各繪製一個半透明的黑色矩形，使得中間的 350x350 方格保持可見。
const drawOverlayTopDown = () => {
  if (!canvasElement || !canvasCtx) return
  const visibleArea = 350
  const canvasW = canvasElement.width
  const canvasH = canvasElement.height
  canvasCtx.fillStyle = OverlayColor
  // 上面遮罩
  canvasCtx.fillRect(0, 0, canvasW, (canvasH - visibleArea) / 2)
  // 下面遮罩
  canvasCtx.fillRect(0, canvasH - (canvasH - visibleArea) / 2, canvasW, (canvasH - visibleArea) / 2)
}

// 動畫函数的類型
type AnimationFunction = (time: number) => void
// 動畫請求的類型
type AnimationRequestId = number
// 動畫請求的函数
declare function requestAnimationFrame(callback: AnimationFunction): AnimationRequestId
// 取消動畫的函数
declare function cancelAnimationFrame(requestId: AnimationRequestId): void
let animationId: AnimationRequestId | null = null

const scanResultContent = ref({})
const scanErrorMsg = ref('')
const scanStatuMsg = ref('')
const showsScanResult = computed(
  () => Object.keys(scanResultContent.value).length > 0 || scanErrorMsg.value !== ''
)

const eventId = route?.params?.id
const updateOutPutData = async (imageData: any) => {
  if (qrCodeOutputData.value !== '') return
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert'
  })
  scanResultContent.value = {}
  scanErrorMsg.value = ''
  if (code) {
    // 標示出QRcode的紅框
    drawLine(code.location.topLeftCorner, code.location.topRightCorner)
    drawLine(code.location.topRightCorner, code.location.bottomRightCorner)
    drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner)
    drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner)
    qrCodeOutputData.value = code.data

    try {
      layoutStore.loadToggle(true)

      // QRcode掃瞄出網址將ct取出
      const ctStr = parseParamCT(code.data)
      // 取得經緯度
      const { lat, lon } = parseClientLocation(code.data)

      // 驗證ct
      const t0kenObj = await verifyCtString(ctStr, lat, lon)

      // 打卡驗證
      const commitRes = await commitStoreCheckIn(String(eventId), t0kenObj)

      if (commitRes) {
        // 打卡成功蓋版
        scanResultContent.value = commitRes
      }
    } catch (error) {
      // 打卡失敗蓋版
      scanErrorMsg.value = String(error)
    }
    layoutStore.loadToggle(false)
  }
}

const cleanOutPutData = () => {
  qrCodeOutputData.value = ''
}

const scanAgain = () => {
  window.location.reload()
}

const isMobile = ref(false)
const tick = () => {
  if (!canvasElement || !canvasCtx || !video) return
  videoLoading.value = true
  if (video.readyState == video.HAVE_ENOUGH_DATA) {
    videoLoading.value = false
    canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
    // 添加遮罩層
    if (isMobile.value) {
      drawOverlayTopDown()
    } else {
      drawOverlayLeftRight()
    }
    const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height)
    updateOutPutData(imageData)
  }
  // 持續執行動畫
  animationId = requestAnimationFrame(tick)
}

const canvasW = ref(0)
const canvasH = ref(0)
let streamInstance: any = null
onMounted(() => {
  const ua = navigator.userAgent
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  layoutStore.loadToggle(true)

  video = document.createElement('video') as HTMLVideoElement
  canvasElement = document.getElementById('canvas') as HTMLCanvasElement
  canvasCtx = canvasElement.getContext('2d')

  // https://stackoverflow.com/questions/14256316/how-can-i-get-the-size-of-the-webcam-image-with-getusermedia
  const getVideoSize = () => {
    if (!video || !canvasElement) return

    const ratio = Math.round((video.videoWidth / video.videoHeight) * 100) / 100
    if (window.innerWidth > 680) {
      // 640:400
      canvasElement.width = 640
      canvasElement.height = 400
    } else {
      // mobile: 480:640
      canvasElement.width = window.innerWidth - 100
      canvasElement.height = Math.round((canvasElement.width / ratio) * 100) / 100
    }
    layoutStore.loadToggle(false)

    canvasW.value = canvasElement.width
    canvasH.value = canvasElement.height

    // 執行動畫
    animationId = requestAnimationFrame(tick)
    video.removeEventListener('playing', getVideoSize, false)
  }

  // 如僅http協定無法使用
  // Use facingMode: environment to attemt to get the front camera on phones
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        canvasVisible.value = true
        if (video) {
          video.srcObject = stream
          streamInstance = stream.getTracks()[0]
          video.setAttribute('playsinline', 'true') // required to tell iOS safari we don't want fullscreen
          video.addEventListener('playing', getVideoSize, false)
          video.play()
        }
      })
      .catch((error) => {
        // 用戶拒絕或未能啟用相機
        console.error(error)
        canvasVisible.value = false
        videoLoading.value = false
        layoutStore.loadToggle(false)
      })
  }
})

const stopMediaTracks = () => {
  scanStatuMsg.value = '攝影機關閉中'
  if (streamInstance) {
    streamInstance.stop()
  }
}

onUnmounted(() => {
  // 暂停和取消動畫
  stopMediaTracks()
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
})
</script>

<template>
  <main class="cameraScan">
    <HeaderMenu />

    <h1 v-if="!canvasVisible" class="loading small">
      <span>🎥 無法存取視訊串流</span>
      <span>請確保您已啟用網路攝影機</span>
      <RouterLink to="/" class="store-btn activity" :title="content.btn.backHome"></RouterLink>
    </h1>
    <h1 v-if="videoLoading" class="loading">Loading...</h1>

    <div
      class="cameraScan__box"
      :style="{
        width: `${canvasW + 32}px`
      }"
    >
      <div
        class="cameraScan__box-canvas"
        :style="{
          width: `${canvasW + 32}px`,
          height: `${canvasH + 48}px`
        }"
      >
        <canvas ref="canvas" id="canvas" v-show="canvasVisible && !videoLoading"></canvas>
      </div>

      <div class="cameraScan__box-result">
        <div class="cameraScan__box-result-image">
          <img :src="dialogCatImg" alt="掃描喵~" width="128" height="115" />
        </div>
        <div class="cameraScan__box-result-text">
          {{
            qrCodeOutputData ? qrCodeOutputData : scanStatuMsg ? scanStatuMsg : '沒有掃描到任何東西'
          }}
        </div>
      </div>
    </div>

    <footer class="cameraScan__button">
      <button class="custom-btn" @click="cleanOutPutData">重新抓取</button>
      <button class="custom-btn" v-if="scanStatuMsg" @click="scanAgain">開啟攝影機</button>
      <button class="custom-btn" v-else @click="stopMediaTracks">關閉攝影機</button>
    </footer>
  </main>

  <ScanResult
    v-if="showsScanResult"
    :result="scanResultContent"
    :error="scanErrorMsg"
    @scanAgain="scanAgain"
  />
</template>

<style lang="scss" scoped>
video {
  object-fit: cover;
}

.cameraScan {
  @extend %pageMain;
  @extend %flexColInfo;
  padding-top: 4rem;

  &__box {
    @extend %roundBox;
    @extend %shadowBox;
    width: 90%;
    margin: auto;
    background-color: $purple;
    &-canvas {
      @extend %bgContainer;
      width: 100%;
      height: 23rem;
      background-image: url('@/assets/images/bg/purple.png');
      padding: 1.5rem 1rem;
    }
    &-result {
      @extend %flexRowInfo;
      justify-content: space-around;
      gap: 0.5rem;
      &-text {
        color: $white;
        width: 16.875rem;
      }
    }
  }
  #canvas {
    overflow: hidden;
    border: 2px solid $yellow2;
    width: 100%;
    height: 100%;
  }
  &__button {
    @extend %flexRowInfo;
    gap: 1.5rem;
  }
}
</style>
