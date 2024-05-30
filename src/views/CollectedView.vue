<script setup lang="ts">
/**
 * 單一打卡紀錄
 */
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import HeaderMenu from '@/components/HeaderMenu.vue'

import type { EventListType, EventInterface } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'

import emptyStampImg from '@/assets/images/collected/empty-stamp.png'
import checkedStampImg from '@/assets/images/collected/checked-stamp.svg'
import yellowEmptyStampImg from '@/assets/images/collected/yellow-empty-stamp.png'
import purpleEmptyStampImg from '@/assets/images/collected/purple-empty-stamp.png'
import orangeEmptyStampImg from '@/assets/images/collected/orange-empty-stamp.png'
import pinkEmptyStampImg from '@/assets/images/collected/pink-empty-stamp.png'
import redeemButtonImg from '@/assets/images/collected/redeem-button.svg'
import backToIndexButtonImg from '@/assets/images/collected/back-to-index-button.svg'

const { fetchCollectData } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()

const stampBaseCount = 20
const activityId = ref<string>('')
const activityExists = ref<boolean>(false)
const collectedActivity = ref<EventListType>({})
const collectedStore = ref<EventInterface[]>([])

const route = useRoute()
const { linkToAlbum, linkToTargetActivityIdPage } = useLink()

const layoutStore = useLayoutStore()
watchEffect(async () => {
  const activityParamsId = String(route.params.id)
  if (!activityParamsId) {
    linkToAlbum()
  } else {
    layoutStore.loadToggle(true)
    try {
      const res = await fetchCollectData(activityParamsId)
      if (res) {
        activityExists.value = true
        collectedActivity.value = res
        collectedStore.value = res.historyList || []
        activityId.value = activityParamsId
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

const specialStampIndexList = [5, 10, 15, 30]
</script>

<template>
  <main class="collected-view">
    <HeaderMenu />
    <div class="collected-view__header">
      <div class="collected-view__header--text-block">
        <!-- <h1 class="collected-view__header--text-block-main">{{ collectedActivity.event_name }}</h1> -->
        <!-- <h1 class="collected-view__header--text-block-bg">{{ collectedActivity.event_name }}</h1> -->
        <h1 class="collected-view__header--text-block-main">歡樂一夏</h1>
        <h1 class="collected-view__header--text-block-bg">歡樂一夏</h1>
      </div>
      <div class="collected-view__header--date">
        <p>
          <!-- {{ collectedActivity.startDate }} -->
          2024.07.15
        </p>
        <div class="collected-view__header--date-line"></div>
        <p>
          <!-- {{ collectedActivity.endDate }} -->
          08.31
        </p>
      </div>
    </div>
    <div class="collected-view__body">
      <div
        class="collected-view__body--stamp"
        v-for="(baseItem) in stampBaseCount"
        :key="baseItem"
      >
        <div
          v-if="collectedStore[baseItem - 1] && Object.keys(collectedStore[baseItem - 1]).length > 0"
          @click="
            () =>
              openStoreInfo({
                countShow: false,
                storeName: collectedStore[baseItem - 1]['storeName'],
                imageUrl: '',
                lastCheckInTime: collectedStore[baseItem - 1]['createTime'] || ''
              })
          "
          class="collected-view__body--stamp-wrapper"
        >
          <p
            class="collected-view__body--stamp-text"
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
          v-else-if="specialStampIndexList"
          :src="
            {
              [specialStampIndexList[0]]: yellowEmptyStampImg,
              [specialStampIndexList[1]]: purpleEmptyStampImg,
              [specialStampIndexList[2]]: orangeEmptyStampImg,
              [specialStampIndexList[3]]: pinkEmptyStampImg
            }[baseItem] ?? emptyStampImg
          "
          alt="empty stamp"
        />
      </div>
    </div>
    <div v-if="activityExists" class="collected-view__footer">
      <button @click="linkToTargetActivityIdPage(activityId, 'Winning')">
        <img :src="redeemButtonImg" alt="前往兌獎" />
      </button>
      <button @click="linkToTargetActivityIdPage(activityId, 'Activity')">
        <img :src="backToIndexButtonImg" alt="回活動首頁" />
      </button>
    </div>
  </main>
</template>

<style lang="scss" scope>
%title {
  font-size: 55px;
  font-weight: 900;
  white-space: pre-line;
}

.collected-view {
  overflow: auto;
  background: url('@/assets/images/collected/bg.png');

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

      &-main {
        @extend %title;
        position: relative;
        z-index: 2;
        color: #fff;
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
        color: #fff;
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
  }
}
</style>
