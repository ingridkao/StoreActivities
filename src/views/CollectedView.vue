<script setup lang="ts">
/**
 * 單一打卡紀錄
 */
import { ref, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

import HeaderMenu from '@/components/HeaderMenu.vue'

import type { EventSimpleInterface, EventInterface } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useEventStorage } from '@/composable/useEventStorage'

import { useLayoutStore } from '@/stores/layout'

import emptyStampImg from '@/assets/images/collected/empty-stamp.png'
import checkedStampImg from '@/assets/images/collected/checked-stamp.svg'
import BorderStampImg from '@/assets/images/collected/border-stamp.png'
import redeemButtonImg from '@/assets/images/collected/redeem-button.svg'
import backToIndexButtonImg from '@/assets/images/collected/back-to-index-button.svg'

const { fetchCollectData, commitReceivePrize, fetchReceivePrize } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()
const { getTargetEventStorage } = useEventStorage()

const stampBaseCount = 20
const activityId = ref<string>('')
const collectedActivity = ref<EventSimpleInterface | null>(null)
const collectedStore = ref<EventInterface[]>([])

const route = useRoute()
const router = useRouter()

const { linkToTargetActivityIdPage } = useLink()

const clickReceivePrize = async () => {
  if(collectedActivity.value && collectedActivity.value.redeemPrize.length > 0 && collectedActivity.value.redeemPrize[0] >= collectedStore.value.length){
    try {
      await fetchReceivePrize(activityId.value)
      const commitRes = await commitReceivePrize(activityId.value)
      if (commitRes) {
        // 兌獎觸發成功引導到兌獎頁面
        console.log(commitRes)
        router.push({ name: 'Winning' })
      }
    } catch (error) {
      errorAlert(String(error), `/activity/${activityId.value}`)
    }
  }else{
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
        debugger
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

const startDate = computed(() => collectedActivity.value ? dayjs(collectedActivity.value.end).format('YYYY.MM.DD') || '' : '')
const endDate = computed(() => collectedActivity.value ? dayjs(collectedActivity.value.end).format('M.D') || '' : '')
const stampBorder = ['#ffcf24', '#b26cf7', '#ff8d3b', '#f06f9d']
const isGradeStamp = (index:number) => {
  if(collectedActivity.value && collectedActivity.value.redeemPrize.length > 0 && collectedStore.value.length >= 0){
    const borderStampIndex = collectedActivity.value.redeemPrize.findIndex(item => item === index)
    if(borderStampIndex === -1)return false
    return stampBorder[borderStampIndex]
  }else{
    return false
  }
}

</script>

<template>
  <main class="collected">
    <HeaderMenu />
    <div>
      <div class="collected__header">
        <div class="collected__header--text-block">
          <h1 class="collected__header--text-block-main">{{ collectedActivity?.eventName }}</h1>
          <h1 class="collected__header--text-block-bg">{{ collectedActivity?.eventName }}</h1>
        </div>
        <div class="collected__header--date">
          <p>{{ startDate }}</p>
          <div class="collected__header--date-line"></div>
          <p>{{ endDate }}</p>
        </div>
      </div>
      <div class="collected__body">
        <div 
          class="collected__body--stamp" 
          v-for="baseItem in stampBaseCount" 
          :key="baseItem"
        >
          <div
            v-if="collectedStore[baseItem - 1] && Object.keys(collectedStore[baseItem - 1]).length > 0"
            class="collected__body--stamp-wrapper"
            @click="() => openStoreInfo({
              countShow: false,
              storeName: collectedStore[baseItem - 1]['storeName'],
              imageUrl: '',
              lastCheckInTime: collectedStore[baseItem - 1]['createTime'] || ''
            })"
          >
            <p
              class="collected__body--stamp-text"
              :class="{
                'three-characters': collectedStore[baseItem - 1]['storeName']?.length === 3,
                'four-characters': collectedStore[baseItem - 1]['storeName']?.length === 4,
                'five-characters': collectedStore[baseItem - 1]['storeName']?.length === 5,
                'six-characters': collectedStore[baseItem - 1]['storeName']?.length === 6
              }"
            >
              {{ collectedStore[baseItem - 1]['storeName'] }}
            </p>
            <img :src="checkedStampImg" alt="checked stamp" />
          </div>
          <img 
            v-else-if="isGradeStamp(baseItem)" 
            :src="BorderStampImg" 
            class="collected__body--stamp-grade"
            :style="{ borderColor: `${isGradeStamp(baseItem)}`}"
            :alt="`stamp`"
          />
          <img v-else :src="emptyStampImg" alt="empty stamp"/>
        </div>
      </div>
      <div v-if="activityId" class="collected__footer">
        <button @click="clickReceivePrize()">
          <img :src="redeemButtonImg" alt="前往兌獎" />
        </button>
        <button @click="linkToTargetActivityIdPage(activityId, 'Activity')">
          <img :src="backToIndexButtonImg" alt="回活動首頁" />
        </button>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scope>
$card: 396px;
%title {
  font-size: 55px;
  font-weight: 900;
  white-space: pre-line;
}

.collected {
  overflow: auto;
  background: url('@/assets/images/collected/bg.png');
  padding-bottom: 60px;

  >div{
    width: $card;
    margin: 0 auto;
  }

  &__header {
    height: 145px;
    background-color: #009f66;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &--text-block {
      margin-top: 12px;
      position: relative;
      >h1{
        color: #fff;
        white-space: normal;
      }
      &-main {
        @extend %title;
        position: relative;
        z-index: 2;
        text-shadow:
          -1px -1px 0 #009031,
          1px -1px 0 #009031,
          -1px 1px 0 #009031,
          1px 1px 0 #009031;
      }

      &-bg {
        @extend %title;
        position: absolute;
        top: 0;
        -webkit-text-stroke: 8px #12b84a;
      }
    }

    &--date {
      font-size: 22px;
      color: #fff;
      font-weight: 900;
      margin-top: 12px;
      display: flex;
      align-items: end;
      gap: 8px;

      &-line {
        width: 32px;
        height: 1px;
        background-color: #fff;
      }
    }
  }

  &__body {
    display: grid;
    gap: 12px;
    padding: 0 20px;
    margin-top: 9px;
    margin-bottom: 16px;
    grid-template-columns: repeat(4, 1fr);

    &--stamp {
      &-wrapper {
        position: relative;
      }

      &-grade{
        border-width: 4px;
        border-style: solid;
        border-radius: 15px;
        object-fit: cover;
      }
      &-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 28px;
        text-align: left;
        line-height: 120%;
        font-weight: 700;

        &.three-characters {
          font-size: 22px;
          padding: 0 6px;
        }

        &.four-characters {
          text-align: center;
          font-size: 26px;
          padding: 0 10px;
        }

        &.five-characters {
          font-size: 22px;
          padding: 0 6px;
        }

        &.six-characters {
          text-align: center;
          font-size: 22px;
          padding: 0 6px;
        }
      }
    }
  }

  &__footer {
    position: fixed;
    z-index: 4;
    bottom: 60px;
    width: 100%;
    max-width: $card;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
  }
}
</style>
