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
import { useDay } from '@/composable/useDay'

import { useLayoutStore } from '@/stores/layout'

import titleDecoTopImg from '@/assets/images/activity/title-deco-top.svg'
import titleDecoBottomImg from '@/assets/images/activity/title-deco-bottom.svg'
import activityMainCatImg from '@/assets/images/activity/activity-main-cat.png'

const { confirmCampaign, verifyCtString, commitStoreCheckIn } = useFetchData()
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

const { parseYear, parseMD } = useDay()
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

watchEffect(async () => {
  confirmActivityId()
})

const scanResultContent = ref({})
const scanErrorMsg = ref<String>('')
const commitScan = async () => {
  scanResultContent.value = {}
  scanErrorMsg.value = ''
  let ctTokenCookiesObj = getCtT0kenCookies()
  try {
    layoutStore.loadToggle(true)
    if (ctTokenCookiesObj === null) {
      // 打開手機鏡頭
      const ctStr = await scanCode()
      ctTokenCookiesObj = await verifyCtString(ctStr || '')
    }
    
    // 打卡驗證
    const commitRes = await commitStoreCheckIn(activityId, ctTokenCookiesObj)
    if (commitRes) {
      scanResultContent.value = commitRes
      layoutStore.toggleScanResult(true)
    }
  } catch (error) {
    // 打卡失敗蓋版
    scanErrorMsg.value = String(error)
    layoutStore.toggleScanResult(true)
  }
  layoutStore.loadToggle(false)
}

const layoutStore = useLayoutStore()
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
          <img :src="titleDecoTopImg" alt="title deco top" width="68" height="64"/>
          <img :src="titleDecoBottomImg" alt="title deco bottom" width="68" height="64"/>
        </div>
      </div>

      <div class="activity__main_banner">
        <img :src="activityMainCatImg" :alt="eventInfo?.eventName" width="586" height="793"/>
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
        class="activity__content_directionBtn round-btn info " 
        @click="openDirection"
        title="打開說明"
      >
        打開說明
      </button>
      <ParagraphItem
        v-for="{ title, text } in eventInfo.content"
        :key="title"
        :title="title"
        :content="text || ''"
      />
      <footer>
        <button 
          class="store-btn enter"
          @click="commitScan" 
          title="進入活動"
        >
          進入活動
        </button>
      </footer>
    </div>

    <DirectionInfo 
      v-show="layoutStore.showDirection" 
      @checkin="directionStartScan" 
    />

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
  font-size: 65px;
  line-height: 75px;
  letter-spacing: calc(65px * 0.17);
  color: $white;
}

.activity {
  @extend %pageMain;
  background-color: $white;
  padding-top: 30px;
  padding-bottom: 30px;
  
  &__top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    overflow-y: hidden;
  }

  &__main {
    @extend %mainSection;
    max-width: $card-middle;

    &_title {
      position: absolute;
      width: 300px;
      right: 14px;
      top: 0px;
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
          position: absolute;
          top: 0;
          -webkit-text-stroke: 8px $yellow2;
        }
      }

      &--deco {
        @extend %flexColInfo;
        >img{
          width: 68px;
          height: 64px;
          overflow: hidden;
        }
      }
    }

    &_banner{
      padding-top: 80px;
      > img {
        z-index: 2;
        aspect-ratio: 65/88;
      }
    }

    &_date {
      @extend %flexColInfo;
      gap: 4px;
  
      position: absolute;
      width: 180px;
      bottom: 8%;
      right: 20px;
      z-index: 2;
      color: $white2;
      &--day {
        @extend %flexRowInfo;
        border: 0.5px solid $white2;
        padding: 8px 12px;
        gap: 8px;
        &-line {
          width: 32px;
          height: 1px;
          background-color: $white;
        }
      }
    }
  }

  &__content {
    @extend %mainSection;
    max-width: $card-middle;
    padding: 25px 43px 0 26px;
    @media screen and (min-width: $content-middle) {
      max-width: $content-middle;
    }
    &_directionBtn {
      position: absolute;
      top: -30px;
      right: 20px;
      z-index: 3;
    }
  }
}

</style>
