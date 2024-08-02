<script setup lang="ts">
/**
 * 活動說明
 * step0.確認使用者同意裝置位置資料(經緯度)
 * step1.確認是否為進行中活動
 * step2.去檢測ct
 *       - 有  : 送出打卡資訊
 *       - 沒有: 到活動地圖頁面
 */
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { EventSimpleInterface } from '@/types/ResponseHandle'
import content from '@/assets/content'
import titleDecoTopImg from '@/assets/images/activity/title-deco-top.svg'
import titleDecoBottomImg from '@/assets/images/activity/title-deco-bottom.svg'

import HeaderMenu from '@/components/HeaderMenu.vue'
import ParagraphItem from '@/components/ParagraphItem.vue'
import DirectionInfo from '@/components/DirectionInfo.vue'
import ScanResult from '@/components/ScanResult.vue'

import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useLIFF } from '@/composable/useLIFF'
import { useGeolocation } from '@vueuse/core'
import { useGeo } from '@/composable/useGeo'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useDay } from '@/composable/useDay'

import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const eventId = route?.params?.id
const { confirmEvent, verifyCtString, commitStoreCheckIn } = useFetchData()
const { getQRcodeString, getT0kenCookies } = useBrowserStorage()
const { scanCode } = useLIFF()
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
const { activityErrorAlert, errorAlert } = useSweetAlert()
const { parseYear, parseMD } = useDay()

const layoutStore = useLayoutStore()
const userStore = useUserStore()

let getPosition = false
const confirmCoords = () => {
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // TODO !! 正式環境要打開
    userStore.updateLocation(latitude, longitude)
  } else if (error.value && error.value.code >= 1) {
    geoErrorHandler(error.value.code)
  }
}

const eventInfo = ref<EventSimpleInterface>()
watchEffect(async () => {
  try {
    const confirmRes = await confirmEvent(eventId)
    eventInfo.value = confirmRes
    confirmCoords()
  } catch (error) {
    if (error === 1) {
      activityErrorAlert(content.activity.notFound)
    } else if (error === 2) {
      activityErrorAlert(content.activity.timeOver)
    } else {
      errorAlert(String(error), `/activity/${eventId}`)
    }
  }
})

const scanResultContent = ref({})
const scanErrorMsg = ref<String>('')
const commitScan = async () => {
  scanResultContent.value = {}
  scanErrorMsg.value = ''
  const eventId = eventInfo.value ? String(eventInfo.value.id) : ''
  if (eventId === '') return

  // 具有有效的活動ID
  try {
    layoutStore.loadToggle(true)

    const ctToken = getT0kenCookies()
    let ctStr = getQRcodeString()

    // 沒有驗證過ct,打開手機鏡頭準備掃描
    if (ctToken === null) {
      const { ct, lat, lon } = await scanCode(eventId)
      await verifyCtString(ct, lat, lon)
      ctStr = ct
    }

    const commitRes = await commitStoreCheckIn(eventId, ctStr)
    if (commitRes) {
      // 成功蓋版，顯示打卡成功門市資訊
      scanResultContent.value = commitRes
      layoutStore.toggleScanResult(true)
    }

    layoutStore.loadToggle(false)
  } catch (error) {
    // 錯誤蓋版，顯示錯誤訊息包含打卡失敗
    // 抓經緯度
    scanErrorMsg.value = String(error)
    layoutStore.loadToggle(false)
    layoutStore.toggleScanResult(true)
  }
}

const openDirection = () => {
  layoutStore.toggleDirection(true)
  layoutStore.toggleScanResult(false)
  layoutStore.closeNav()
}
const directionStartScan = () => {
  layoutStore.toggleDirection(false)
  layoutStore.toggleScanResult(false)
  commitScan()
}

const parseHeaderImg =
  eventInfo.value && eventInfo.value.headerImg
    ? new URL(`@/assets/images/activity/${eventInfo.value.headerImg}`, import.meta.url).href
    : new URL(`@/assets/images/activity/activity-main-cat.png`, import.meta.url).href
</script>

<template>
  <main class="activity">
    <HeaderMenu />

    <div class="activity__top topBg"></div>

    <div class="activity__main">
      <div class="activity__main_title">
        <div class="activity__main_title-text">
          <h1 class="activity__main_title-text-main">{{ eventInfo?.eventName }}</h1>
          <h1 class="activity__main_title-text-bg">{{ eventInfo?.eventName }}</h1>
        </div>
        <div class="activity__main_title--deco">
          <img :src="titleDecoTopImg" alt="title deco top" width="68" height="64" />
          <img :src="titleDecoBottomImg" alt="title deco bottom" width="68" height="64" />
        </div>
      </div>

      <div class="activity__main_banner">
        <img :src="parseHeaderImg" :alt="eventInfo?.eventName" width="586" height="793" />
      </div>

      <div class="activity__main_date">
        <h3>{{ content.activity.dateTitle }} {{ parseYear(eventInfo?.start) }}</h3>
        <div class="activity__main_date--day">
          <h4>{{ parseMD(eventInfo?.start) }}</h4>
          <div class="activity__main_date--day-line"></div>
          <h4>{{ parseMD(eventInfo?.end) }}</h4>
        </div>
      </div>
    </div>

    <div class="activity__content" v-if="eventInfo && eventInfo.content">
      <button
        class="activity__content_directionBtn round-btn info"
        @click="openDirection"
        :title="content.btn.openDirection"
      >
        {{ content.btn.openDirection }}
      </button>
      <ParagraphItem
        v-for="{ title, text } in eventInfo.content"
        :key="title"
        :title="title"
        :content="text || ''"
      />
      <footer>
        <button class="store-btn enter" @click="commitScan" :title="content.btn.goScan">
          {{ content.btn.goScan }}
        </button>
      </footer>
    </div>

    <DirectionInfo v-show="layoutStore.showDirection" @checkin="directionStartScan" />

    <ScanResult
      v-if="layoutStore.showScanResult"
      :result="scanResultContent"
      :error="scanErrorMsg"
      @scanAgain="commitScan"
    />
  </main>
</template>

<style lang="scss" scoped>
%titleLargeStyle {
  font-size: 4rem;
  line-height: 75px;
  letter-spacing: calc(65px * 0.17);
  color: $white;
}

.activity {
  @extend %pageMain;
  background-color: $whitePure;
  padding-top: 1.875rem;
  padding-bottom: 1.875rem;

  &__top {
    @extend %absoluteTopSection;
    left: 0;
    max-height: 30rem;
    overflow-y: hidden;
    aspect-ratio: 65 / 58;
  }

  &__main {
    @extend %mainSection;
    max-width: $card-middle;

    &_title {
      @extend %absoluteTopSection;
      width: 18.75rem;
      right: 0.875rem;
      display: flex;

      &-text {
        position: relative;
        text-align: right;
        &-main {
          @extend %titleLargeStyle;
          position: relative;
          z-index: 2;
          text-shadow:
            -1px -1px 0 $yellow3,
            1px -1px 0 $yellow3,
            -1px 1px 0 $yellow3,
            1px 1px 0 $yellow3;
        }

        &-bg {
          @extend %titleLargeStyle;
          @extend %absoluteTopSection;
          -webkit-text-stroke: 0.5rem $yellow2;
        }
      }

      &--deco {
        @extend %flexColInfo;
        justify-content: center;
        > img {
          width: 4.25rem;
          height: 64px;
          overflow: hidden;
        }
      }
    }

    &_banner {
      padding-top: 2rem;
      > img {
        z-index: 2;
        aspect-ratio: 65/88;
      }
    }

    &_date {
      @extend %flexColInfo;
      justify-content: center;
      gap: 0.25rem;

      position: absolute;
      width: 11.25rem;
      bottom: 8%;
      right: 1.25rem;
      z-index: 2;
      color: $white2;
      &--day {
        @extend %flexRowInfo;
        border: 0.5px solid rgba($white3, 0.6);
        padding: 0.5rem;
        gap: 0.5rem;
        h4 {
          font-size: 1.3rem;
        }
        &-line {
          width: 1.5rem;
          height: 1px;
          background-color: rgba($white3, 0.6);
        }
      }
    }
  }

  &__content {
    @extend %mainSection;
    max-width: $card-middle;
    padding: 1.5rem 2.625rem 0 1.625rem;
    @media screen and (min-width: $content-middle) {
      max-width: $content-middle;
    }
    &_directionBtn {
      position: absolute;
      top: -1.25rem;
      right: 1.25rem;
      z-index: 3;
    }
  }
}
</style>
