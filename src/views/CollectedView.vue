<script setup lang="ts">
/**
 * 單一打卡紀錄
 */
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDay } from '@/composable/useDay'

import HeaderMenu from '@/components/HeaderMenu.vue'

import type { EventSimpleInterface, EventInterface, IconInterface } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useEventStorage } from '@/composable/useEventStorage'

import { useLayoutStore } from '@/stores/layout'

import emptyStampImg from '@/assets/images/stamp/empty.png'
import checkedStampImg from '@/assets/images/stamp/checked.svg'
import BorderStampImg from '@/assets/images/stamp/border.png'
import redeemButtonImg from '@/assets/images/button/redeem.svg'
import backToActivityImg from '@/assets/images/button/back-activity.svg'

const { parseYMD, parseMD } = useDay()
const { fetchCollectData, commitReceivePrize } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()
const { getTargetEventStorage, setAccumulatCheckinCount } = useEventStorage()

const stampBaseCount = 20
const activityId = ref<string>('')
const collectedActivity = ref<EventSimpleInterface | null>(null)
const collectedStore = ref<EventInterface[]>([])
const iconStore = ref<IconInterface[]>([])

const route = useRoute()
const router = useRouter()

const { linkToTargetActivityIdPage } = useLink()

const clickReceivePrize = async () => {
  // 檢查是否符合第一階段兌獎門檻，其他門檻透過API確認
  if (
    collectedActivity.value &&
    collectedActivity.value.redeemPrize.length > 0 &&
    collectedStore.value.length >= collectedActivity.value.redeemPrize[0]
  ) {
    try {
      const commitRes = await commitReceivePrize(activityId.value)
      if (commitRes) {
        // 兌獎觸發成功引導到兌獎頁面
        router.push({ name: 'Winning' })
      }
    } catch (error) {
      errorAlert(String(error), `/activity/${activityId.value}`)
    }
  } else {
    errorAlert('未達到兌獎門檻', `/activity/${activityId.value}`)
  }
}

const layoutStore = useLayoutStore()
watchEffect(async () => {
  const activityParamsId = String(route.params.id)
  if (!activityParamsId) {
    router.push({ name: 'Album' })
  } else {
    layoutStore.loadToggle(true)
    const TargetEvent = getTargetEventStorage()
    collectedActivity.value = TargetEvent || null
    try {
      const res = await fetchCollectData(activityParamsId)
      if (res) {
        activityId.value = activityParamsId
        collectedStore.value = res.historyList || []
        iconStore.value = res.storeIconList || []

        setAccumulatCheckinCount(collectedStore.value.length)
      } else {
        activityId.value = ''
        linkToTargetActivityIdPage('', 'Activity')
      }
    } catch (error) {
      errorAlert(String(error), `/activity/${activityParamsId}`)
    }
    layoutStore.loadToggle(false)
  }
})

const stampBorder = ['#ffcf24', '#b26cf7', '#ff8d3b', '#f06f9d']
const isGradeStamp = (index: number) => {
  if (
    collectedActivity.value &&
    collectedActivity.value.redeemPrize.length > 0 &&
    collectedStore.value.length >= 0
  ) {
    const borderStampIndex = collectedActivity.value.redeemPrize.findIndex((item) => item === index)
    if (borderStampIndex === -1) return false
    return stampBorder[borderStampIndex]
  } else {
    return false
  }
}

const parseIconURL = (baseItem:EventInterface) => {
  if(!baseItem) return ''
  const target = iconStore.value.find(item => item.storeId === baseItem.storeId)
  return target? target.iconFilePath: ''
}
</script>

<template>
  <main class="collected topBg">
    <HeaderMenu />
    <div>
      <div class="collected__header">
        <div class="collected__header--text-block">
          <h1 class="collected__header--text-block-main">{{ collectedActivity?.eventName || '-' }}</h1>
          <h1 class="collected__header--text-block-bg">{{ collectedActivity?.eventName || '-' }}</h1>
        </div>
        <div class="collected__header--date">
          <h2>{{ parseYMD(collectedActivity?.start) || 'YYYY.MM.DD' }}</h2>
          <div class="collected__header--date-line"></div>
          <h2>{{ parseMD(collectedActivity?.end) || 'MM.DD' }}</h2>
        </div>
      </div>
      <div class="collected__body">
        <div class="stamp" v-for="baseItem in stampBaseCount" :key="baseItem">
          <div
            v-if="
              collectedStore[baseItem - 1] && Object.keys(collectedStore[baseItem - 1]).length > 0
            "
            class="stamp-wrapper"
            @click="
              () =>
                openStoreInfo({
                  countShow: false,
                  storeName: collectedStore[baseItem - 1]['storeName'],
                  imageUrl: parseIconURL(collectedStore[baseItem - 1]),
                  lastCheckInTime: collectedStore[baseItem - 1]['createTime'] || ''
                })
            "
          >
            <p
              class="stamp-text"
              :class="{
                'three-characters': collectedStore[baseItem - 1]['storeName']?.length === 3,
                'four-characters': collectedStore[baseItem - 1]['storeName']?.length === 4,
                'five-characters': collectedStore[baseItem - 1]['storeName']?.length === 5,
                'six-characters': collectedStore[baseItem - 1]['storeName']?.length === 6
              }"
            >
              {{ collectedStore[baseItem - 1]['storeName'] }}
            </p>
            <img 
              :src="checkedStampImg" 
              class="stamp-grade"
              :style="{ borderColor: `${isGradeStamp(baseItem)}` }"
              :alt="collectedStore[baseItem - 1]['storeName']"
            />
          </div>
          <img
            v-else-if="isGradeStamp(baseItem)"
            :src="BorderStampImg"
            class="stamp-grade"
            :style="{ borderColor: `${isGradeStamp(baseItem)}` }"
            :alt="`stamp`"
          />
          <img 
            v-else 
            :src="emptyStampImg" 
            alt="empty stamp"
          />
        </div>
      </div>
      <footer v-if="activityId" class="collected__footer">
        <button @click="clickReceivePrize()">
          <img :src="redeemButtonImg" alt="前往兌獎" />
        </button>
        <button @click="linkToTargetActivityIdPage(activityId, 'Activity')">
          <img :src="backToActivityImg" alt="回活動首頁" />
        </button>
      </footer>
    </div>
  </main>
</template>

<style lang="scss" scope>
%titleMiddleStyle {
  font-size: 55px;
}

.collected {
  @extend %pageMain;

  &__header {
    @extend %flexColInfo;
    @extend %mainSection;
    flex-wrap: wrap;
    height: 145px;
    background-color: $green4;

    &--text-block {
      position: relative;
      margin-top: 12px;
      > h1 {
        color: $white;
        white-space: normal;
      }
      &-main {
        @extend %titleMiddleStyle;
        position: relative;
        z-index: 2;
        text-shadow:
          -1px -1px 0 $green2,
          1px -1px 0 $green2,
          -1px 1px 0 $green2,
          1px 1px 0 $green2;
      }

      &-bg {
        @extend %titleMiddleStyle;
        position: absolute;
        top: 0;
        -webkit-text-stroke: 8px $green3;
      }
    }

    &--date {
      color: $white;
      margin-top: 12px;
      display: flex;
      align-items: end;
      gap: 8px;

      &-line {
        width: 32px;
        height: 1px;
        background-color: $white;
      }
    }
  }

  &__body {
    @extend %stampSection;
    margin-top: 9px;
  }

  &__footer {
    @extend %fixedSection;
    @extend %flexRowInfo;
    bottom: 60px;
    gap: 14px;
  }

  .stamp-grade{
    border-color: $white;
  }
}
</style>
