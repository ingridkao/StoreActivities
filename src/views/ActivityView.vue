<script setup lang="ts">
/**
 * 活動說明
 * step0.確認裝置是否提供經緯度
 * step1.確認是否為進行中活動
 * step2.取得LINE user profile
 *       - 已登入:網頁導轉到此頁
 *       - 未登入:LINE Login redirect到此頁
 * step3.去檢測ct
 *       - 有  : 送出打卡資訊
 *       - 沒有: 到活動地圖頁面
 */
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderMenu from '@/components/HeaderMenu.vue'
import ParagraphItem from '@/components/ParagraphItem.vue'

// import type { ProfileType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useGeolocation } from '@vueuse/core'
import { useGeo } from '@/composable/useGeo'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLoadingStore } from '@/stores/loading'

import data from '@/assets/data'
import titleDecoTopImg from '@/assets/images/activity/title-deco-top.svg'
import titleDecoBottomImg from '@/assets/images/activity/title-deco-bottom.svg'
import activityMainCatImg from '@/assets/images/activity/activity-main-cat.png'
import infoIconButtonImg from '@/assets/images/activity/info-icon-button.svg'
import enterButtonImg from '@/assets/images/activity/enter-button.svg'

const route = useRoute()
const router = useRouter()
const { confirmActivity, verifyQRCode, commitStoreCheckIn } = useFetchData()
const { getAcStorage, setAcStorage } = useBrowserStorage()

// step0
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
let getPosition = false

// step1
const { errorAlert } = useSweetAlert()
const content = ref({})

watchEffect(async () => {
  // step0
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // setLocationStorage(latitude, longitude)
  } else if (error.value && error.value.code >= 1) {
    geoErrorHandler(error.value.code)
  }
  // step1
  let activityId: string | string[] = ''
  if (route.params && route.params.id) {
    activityId = route.params.id
  } else {
    activityId = getAcStorage()
  }
  try {
    const confirmRes = await confirmActivity(activityId)
    if (typeof confirmRes === 'object') {
      setAcStorage(activityId)
      content.value = confirmRes
    } else if (confirmRes === 2) {
      router.push({ path: '/wrapup' })
    } else {
      router.push({ name: 'ComingSoon' })
    }
  } catch (error) {
    const errorStr = String(error)
    errorAlert(errorStr)
  }
})

const gotoDirection = () => {
  router.push({ path: '/direction' })
}

const loadStore = useLoadingStore()
const enterActivity = async () => {
  loadStore.toggle(true)
  try {
    // step3
    const verifyRes = await verifyQRCode()
    if (verifyRes) {
      const commitRes = await commitStoreCheckIn(verifyRes)
      console.log(commitRes)
    } else {
      gotoDirection()
    }
    loadStore.toggle(false)
  } catch (error) {
    const errorStr = String(error)
    errorAlert(errorStr)
    loadStore.toggle(false)
  }
}
</script>

<template>
  <main class="activity-view">
    <HeaderMenu :knowActivity="true" />
    <div class="activity-view__top-bg"></div>

    <div class="activity-view__main">
      <div class="activity-view__title">
        <div class="activity-view__title--text-block">
          <h1 class="activity-view__title--text-block-main">{{ data.activity.title }}</h1>
          <h1 class="activity-view__title--text-block-bg">{{ data.activity.title }}</h1>
        </div>
        <div class="activity-view__title--deco">
          <div class="activity-view__title--deco-top">
            <img :src="titleDecoTopImg" alt="title deco top" />
          </div>
          <div class="activity-view__title--deco-bottom">
            <img :src="titleDecoBottomImg" alt="title deco bottom" />
          </div>
        </div>
      </div>
      <img :src="activityMainCatImg" alt="activity main cat" />
      <div class="activity-view__date">
        <p class="activity-view__date--year">
          {{ data.activity.dateTitle }} {{ data.activity.year }}
        </p>
        <div class="activity-view__date--day-block">
          <p class="activity-view__date--day">{{ data.activity.startDate }}</p>
          <div class="activity-view__date--connect-line"></div>
          <p class="activity-view__date--day">{{ data.activity.endDate }}</p>
        </div>
      </div>
    </div>
    <img class="activity-view__info-icon-button" :src="infoIconButtonImg" alt="info icon button" />
    <div class="activity-view__content">
      <ParagraphItem
        :key="title"
        v-for="{ title, text } in data.activity.content"
        :title="title"
        :content="text"
      />
      <div class="activity-view__content--button">
        <img :src="enterButtonImg" alt="enter button" />
      </div>
    </div>
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

.activity-view {
  background-image: #fff;
  padding-top: 30px;

  &__top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: url('@/assets/images/background/green-bg.png') repeat;
  }

  &__main {
    position: relative;
    width: 100%;
    height: 598px;
    padding-top: 68px;

    > img {
      width: 100%;
      height: 100%;
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
    bottom: 45px;
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
    padding: 25px 43px 32px 26px;
    position: relative;

    &--button {
      margin-top: 10px;
      text-align: center;
    }
  }

  &__info-icon-button {
    position: absolute;
    width: 40px;
    height: 40px;
    right: 20px;
    z-index: 3;
    transform: translateY(-50%);
  }
}

.event {
  flex-direction: column;
  @media (min-width: 1024px) {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
