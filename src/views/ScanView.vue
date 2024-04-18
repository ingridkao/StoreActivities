<script setup lang="ts">
/**
 * 開啟相機掃描QR Code
 */
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from "jsqr"
import { useFetchData } from '@/composable/useFetch'
import ScanResult from '@/components/ScanResult.vue'
const { VITE_BASE_URL } = import.meta.env
const { commitStoreCheckIn } = useFetchData()

// https://github.com/cozmo/jsQR/blob/master/docs/index.html
const canvasVisible = ref(false)
const videoLoading = ref(false)
const qrCodeOutputData = ref<string>('')

let video: HTMLVideoElement | null = null;
let canvasElement: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;

// 畫線
const drawLine = (begin: { x: number; y: number }, end: { x: number; y: number }, color: string = "#FF3B58") => {
    if (!canvasCtx) return
    canvasCtx.beginPath()
    canvasCtx.moveTo(begin.x, begin.y)
    canvasCtx.lineTo(end.x, end.y)
    canvasCtx.lineWidth = 4
    canvasCtx.strokeStyle = color
    canvasCtx.stroke()
}

// 在 Canvas 的左右兩側各繪製一個半透明的黑色矩形，使得中間的 450x450 方格保持可見。
const OverlayColor = 'rgba(0, 0, 0, 0.5)';
const drawOverlayLeftRight = () => {
    if (!canvasElement || !canvasCtx) return;
    const visibleArea = 450;
    const canvasW = canvasElement.width;
    const canvasH = canvasElement.height;
    canvasCtx.fillStyle = OverlayColor;
    // 左邊遮罩
    canvasCtx.fillRect(0, 0, (canvasW - visibleArea) / 2, canvasH);
    // 右邊遮罩
    canvasCtx.fillRect(canvasW - (canvasW - visibleArea) / 2, 0, (canvasW - visibleArea) / 2, canvasH);
}
// 在 Canvas 的上下兩側各繪製一個半透明的黑色矩形，使得中間的 350x350 方格保持可見。
const drawOverlayTopDown = () => {
    if (!canvasElement || !canvasCtx) return;
    const visibleArea = 350;
    const canvasW = canvasElement.width;
    const canvasH = canvasElement.height;
    canvasCtx.fillStyle = OverlayColor;
    // 上面遮罩
    canvasCtx.fillRect(0, 0, canvasW, (canvasH - visibleArea) / 2);
    // 下面遮罩
    canvasCtx.fillRect(0, canvasH - (canvasH - visibleArea) / 2, canvasW, (canvasH - visibleArea) / 2);
}

// 動畫函数的類型
type AnimationFunction = (time: number) => void;
// 動畫請求的類型
type AnimationRequestId = number;
// 動畫請求的函数
declare function requestAnimationFrame(callback: AnimationFunction): AnimationRequestId;
// 取消動畫的函数
declare function cancelAnimationFrame(requestId: AnimationRequestId): void;
let animationId: AnimationRequestId | null = null;

// const imageDatas = ref()
// const codes = ref()
const showsScanResult = ref(false)
const scanResultContent = ref({})

const updateOutPutData = async(imageData: any) => {
    if (qrCodeOutputData.value !== '') return
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });
    // codes.value = code
    if (code) {
        // 標示出QRcode的紅框
        drawLine(code.location.topLeftCorner, code.location.topRightCorner)
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner)
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner)
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner)
        qrCodeOutputData.value = code.data

        try {
            const codeSplit = code.data.split(`${VITE_BASE_URL}/?ct=`)
            // const ctCode = (codeSplit.length === 2 && codeSplit[1])?codeSplit[1]: ''
            // const verifyRes = await verifyQRCode(ctCode)
            // const commitRes = await commitStoreCheckIn(verifyRes)            
            const qrcodeOk = (codeSplit.length === 2 && codeSplit[1])?true: false
            const commitRes = await commitStoreCheckIn(qrcodeOk)
            if(commitRes){
                // 打卡成功蓋版
                showsScanResult.value = true
                scanResultContent.value = commitRes
            }else{
                // 打卡失敗蓋版
                showsScanResult.value = true
                scanResultContent.value = {}
            }
        } catch (error) {
            // 打卡失敗蓋版
            showsScanResult.value = true
            scanResultContent.value = {}
            console.error(error);
        }
        // pauseAnimation()
    }
}
const cleanOutPutData = () => {
    qrCodeOutputData.value = ''
}

const isMobile = ref(false)
const tick = () => {
    if (!canvasElement || !canvasCtx || !video) return;

    videoLoading.value = true
    if (video.readyState == video.HAVE_ENOUGH_DATA) {
        videoLoading.value = false
        canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        // 添加遮罩層
        if (isMobile.value) {
            drawOverlayTopDown()
        } else {
            drawOverlayLeftRight();
        }
        const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        // imageDatas.value = imageData
        updateOutPutData(imageData)
    }
    // 持續執行動畫
    animationId = requestAnimationFrame(tick);
}
// const videoW = ref(0)
// const videoH = ref(0)
let streamInstance: any = null
onMounted(() => {
    const ua = navigator.userAgent
    isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

    video = document.createElement('video') as HTMLVideoElement
    canvasElement = document.getElementById('canvas') as HTMLCanvasElement
    canvasCtx = canvasElement.getContext("2d")

    // https://stackoverflow.com/questions/14256316/how-can-i-get-the-size-of-the-webcam-image-with-getusermedia
    const getVideoSize = () => {
        if (!video || !canvasElement) return

        // videoW.value = video.videoWidth
        // videoH.value = video.videoHeight
        const ratio = Math.round(video.videoWidth / video.videoHeight * 100) / 100

        if (window.innerWidth > 680) {
            // 640:400
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
        } else {
            // mobile: 480:640
            canvasElement.width = window.innerWidth - 40;
            canvasElement.height = Math.round(canvasElement.width / ratio * 100) / 100;
        }
        // 執行動畫
        animationId = requestAnimationFrame(tick);
        video.removeEventListener('playing', getVideoSize, false);
    };

    // 如僅http協定無法使用
    // Use facingMode: environment to attemt to get the front camera on phones
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                canvasVisible.value = true;
                if (video) {
                    video.srcObject = stream;
                    streamInstance = stream.getTracks()[0];
                    video.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
                    video.addEventListener('playing', getVideoSize, false);
                    video.play();
                }
            }).catch(error => {
                // 用戶拒絕或未能啟用相機
                canvasVisible.value = false;
                console.error(error);
            });
    }
});

const stopMediaTracks = () => {
    streamInstance.stop()
};

onUnmounted(() => {
    // 暂停和取消動畫
    stopMediaTracks()
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null
    }
})


</script>

<template>
    <div class="cameraBox">
        <div v-if="!canvasVisible" class="loadingMessage">
            🎥 Unable to access video stream (please make sure you have a webcam enabled)
        </div>
        <div v-if="videoLoading" class="loadingMessage">
            ⌛ Loading video...
        </div>
        <!-- videoW:{{ videoW }} | videoH: {{videoH}} -->
        <canvas ref="canvas" id="canvas" v-show="canvasVisible && !videoLoading"></canvas>
        <div id="output" class="outputBox">
            <div v-if="qrCodeOutputData">
                <b>Data:</b>
                <span>{{ qrCodeOutputData }}</span>
            </div>
            <div v-else>
                No QR code detected.
            </div>
        </div>
        <button @click="cleanOutPutData">重新抓取</button>
        <button @click="stopMediaTracks">關閉攝影機</button>
    </div>

    <ScanResult v-if="showsScanResult" :result="scanResultContent"/>
</template>

<style lang="scss" scoped>
video {
    object-fit: cover;
}

.cameraBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;

    .loadingMessage {
        text-align: center;
        padding: 40px;
        background-color: #eee;
    }

    .outputBox {
        max-width: 25rem;
        margin-top: 1rem;
        background: #eee;
        padding: 1rem;

        div {
            word-wrap: break-word;
        }
    }
}
</style>