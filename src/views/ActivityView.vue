<script setup lang="ts">
/**
 * 活動說明
 * step0.確認使用者同意裝置位置資料(經緯度)
 * step1.確認是否為進行中活動
 * step2.去檢測ct
 *       - 有  : 送出打卡資訊
 *       - 沒有: 到活動地圖頁面
 */
import { ref, watchEffect, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import type { EventSimpleInterface } from '@/types/ResponseHandle'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import HeaderMenu from '@/components/HeaderMenu.vue'
import ParagraphItem from '@/components/ParagraphItem.vue'
import DirectionInfo from '@/components/DirectionInfo.vue'
import ScanResult from '@/components/ScanResult.vue'

import { useGeolocation } from '@vueuse/core'
import { useLIFF } from '@/composable/useLIFF'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useGeo } from '@/composable/useGeo'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'

import data from '@/assets/data'
import titleDecoTopImg from '@/assets/images/activity/title-deco-top.svg'
import titleDecoBottomImg from '@/assets/images/activity/title-deco-bottom.svg'
import activityMainCatImg from '@/assets/images/activity/activity-main-cat.png'
import infoIconButtonImg from '@/assets/images/activity/info-icon-button.svg'
import enterButtonImg from '@/assets/images/activity/enter-button.svg'

const { genrateMockQRCode, confirmCampaign, verifyCtString, commitStoreCheckIn } = useFetchData()
const { getCtT0kenCookies, setLocationStorage } = useBrowserStorage()
const { scanCode } = useLIFF()

const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
let getPosition = false
const confirmCoords = () => {
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // !! 正式環境要打開
    // setLocationStorage(latitude, longitude)
  } else if (error.value && error.value.code >= 1) {
    geoErrorHandler(error.value.code)
  }
}

const { activityErrorAlert } = useSweetAlert()
const eventInfo = ref<EventSimpleInterface>()
const route = useRoute()
const activityId = route?.params?.id
const confirmActivityId = async () => {
  try {
    const confirmRes = await confirmCampaign(activityId)
    eventInfo.value = confirmRes
    confirmCoords()
  } catch (error) {
    if (error === 1) {
      activityErrorAlert('沒有此活動')
    } else if (error === 2) {
      activityErrorAlert('活動已結束')
    } else {
      activityErrorAlert('異常', String(error))
    }
  }
}

watchEffect(() => {
  confirmActivityId()
})

const scanResultContent = ref({})
const scanErrorMsg = ref<String>('')
const showsScanResult = computed(
  () => Object.keys(scanResultContent.value).length > 0 || scanErrorMsg.value !== ''
)
const year = computed(() => (eventInfo.value ? dayjs(eventInfo.value.start).year() || '' : ''))
const startDate = computed(() =>
  eventInfo.value ? dayjs(eventInfo.value.start).format('M.D') || '' : ''
)
const endTime = computed(() =>
  eventInfo.value ? dayjs(eventInfo.value.end).format('M.D') || '' : ''
)

const commitScan = async () => {
  scanResultContent.value = {}
  scanErrorMsg.value = ''
  let ctTokenCookiesObj = getCtT0kenCookies()

  try {
    layoutStore.loadToggle(true)
    if (ctTokenCookiesObj === null) {
      // 打開手機鏡頭
      const ctStr = await scanCode()
      // 驗證ct
      ctTokenCookiesObj = await verifyCtString(ctStr || '')
    }

    // 打卡驗證
    const commitRes = await commitStoreCheckIn(activityId, ctTokenCookiesObj)
    if (commitRes) {
      // 打卡成功蓋版
      console.log(commitRes)
      scanResultContent.value = commitRes
    }
  } catch (error) {
    // 打卡失敗蓋版
    scanErrorMsg.value = String(error)
  }
  layoutStore.loadToggle(false)
}

const layoutStore = useLayoutStore()
const openDirection = () => {
  layoutStore.toggleDirection(true)
  layoutStore.closeNav()
}
const directionStartScan = () => {
  layoutStore.toggleDirection(false)
  commitScan()
}

// TODO: After check api flow, remove this
const qrString = ref<string>('')
const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL || window.location.href

onMounted(async () => {
  try {
    const MockCode = await genrateMockQRCode()
    if (MockCode) {
      setLocationStorage(Number(MockCode.lat), Number(MockCode.long))
    }
    qrString.value = `${ORIGIN_URL}?ct=${MockCode.qrCode}`
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <main class="activity">
    <HeaderMenu />
    <div class="activity__top-bg"></div>

    <div class="activity__main store-content">
      <div class="activity__title">
        <div class="activity__title--text-block">
          <h1 class="activity__title--text-block-main">{{ eventInfo?.eventName }}</h1>
          <h1 class="activity__title--text-block-bg">{{ eventInfo?.eventName }}</h1>
        </div>
        <div class="activity__title--deco">
          <div class="activity__title--deco-top">
            <img :src="titleDecoTopImg" alt="title deco top" />
          </div>
          <div class="activity__title--deco-bottom">
            <img :src="titleDecoBottomImg" alt="title deco bottom" />
          </div>
        </div>
      </div>
      <img :src="activityMainCatImg" alt="activity main cat" />
      <div class="activity__date">
        <p class="activity__date--year">{{ data.activity.dateTitle }} {{ year }}</p>
        <div class="activity__date--day-block">
          <p class="activity__date--day">{{ startDate }}</p>
          <div class="activity__date--connect-line"></div>
          <p class="activity__date--day">{{ endTime }}</p>
        </div>
      </div>
    </div>

    <div class="activity__content store-content" v-if="eventInfo && eventInfo.content">
      <button class="activity__info-icon-button" @click="openDirection">
        <img :src="infoIconButtonImg" alt="info icon button" />
      </button>
      <ParagraphItem
        v-for="{ title, text } in eventInfo.content"
        :key="title"
        :title="title"
        :content="text || ''"
      />
      <footer class="activity__footer">
        <button @click="commitScan">
          <img :src="enterButtonImg" alt="enter button" />
        </button>
      </footer>
    </div>

    <DirectionInfo v-show="layoutStore.showDirection" @checkin="directionStartScan" />
    <ScanResult
      v-if="showsScanResult"
      :result="scanResultContent"
      :error="scanErrorMsg"
      @scanAgain="commitScan"
    />

    <template v-if="qrString">
      <div style="width: 10rem">
        <vueQr :text="qrString" :size="100" :correctLevel="3" />
      </div>
      <a :href="qrString" target="_blank">{{ qrString }}</a>
    </template>
  </main>
</template>

<style lang="scss" scoped>
%title {
  font-size: 65px;
  line-height: 75px;
  letter-spacing: calc(65px * 0.17);
  font-weight: 900;
  white-space: pre-line;
}

.activity {
  background-color: #fff;
  padding-top: 30px;

  &__top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: url('@/assets/images/activity/bg.png') repeat;
  }

  &__main {
    padding-top: 68px;
    > img {
      position: relative;
      object-fit: contain;
      z-index: 2;
    }
  }

  &__title {
    display: flex;
    position: absolute;
    right: 14px;
    top: 0px;

    &--text-block {
      position: relative;

      &-main {
        @extend %title;
        position: relative;
        z-index: 2;
        color: #fff;
        text-shadow:
          -1px -1px 0 #bc8700,
          1px -1px 0 #bc8700,
          -1px 1px 0 #bc8700,
          1px 1px 0 #bc8700;
      }

      &-bg {
        @extend %title;
        position: absolute;
        top: 0;
        color: #fff;
        -webkit-text-stroke: 8px #ffbd14;
      }
    }

    &--deco {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &-top,
      &-bottom {
        width: 68px;
        height: 64px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }

  &__date {
    text-align: center;
    display: flex;
    gap: 4px;
    flex-direction: column;
    width: 180px;
    position: absolute;
    bottom: 8%;
    right: 20px;
    z-index: 2;

    &--year {
      color: #d3d3d3;
      font-size: 12px;
      font-weight: 700;
    }

    &--day-block {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.5px solid #d3d3d3;
      padding: 8px 12px;
      gap: 8px;
    }

    &--connect-line {
      width: 36px;
      background-color: #d3d3d3;
      height: 1px;
    }

    &--day {
      color: #d3d3d3;
      font-size: 26px;
      font-weight: 700;
    }
  }

  &__content {
    padding: 25px 43px 0 26px;
  }
  &__footer {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 32px;
    > button {
      width: 150px;
    }
  }

  &__info-icon-button {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 20px;
    z-index: 3;
    top: -30px;
  }
}

.event {
  flex-direction: column;
  @media (min-width: 1024px) {
    min-height: calc(100 * var(--vh));
    display: flex;
    align-items: center;
  }
}
</style>
