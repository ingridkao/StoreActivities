<script setup lang="ts">
/**
 * 單一打卡紀錄
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { EventSimpleInterface, EventInterface, IconInterface } from '@/types/ResponseHandle'

import content from '@/assets/content'
import emptyStampImg from '@/assets/images/stamp/empty.png'
import checkedStampImg from '@/assets/images/stamp/checked.svg'
import BorderStampImg from '@/assets/images/stamp/border.png'
import HeaderMenu from '@/components/HeaderMenu.vue'

import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useEventStorage } from '@/composable/useEventStorage'
import { useDay } from '@/composable/useDay'
import { useLink } from '@/composable/useLink'
import { useLayoutStore } from '@/stores/layout'
const { confirmEvent, fetchCollectData, commitReceivePrize } = useFetchData()
const { activityErrorAlert, errorAlert, openStoreInfo } = useSweetAlert()
const { setAccumulatCheckinCount } = useEventStorage()
const { parseYMD, parseMD } = useDay()
const { linkToTargetActivityIdPage } = useLink()
const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()

const collectedActivity = ref<EventSimpleInterface | null>(null)
const collectedStore = ref<EventInterface[]>([])
const iconStore = ref<IconInterface[]>([])
const stampBaseCount = computed(() => {
  const albumCount = collectedStore.value.length
  if (albumCount <= 16) return 16
  return (Math.round((albumCount - 16) / 4) + 6) * 8
})

const eventId = String(route.params.id)
const goToEventPage = () => {
  linkToTargetActivityIdPage(eventId, 'Activity')
}

const clickReceivePrize = async () => {
  // 檢查是否符合第一階段兌獎門檻，其他門檻透過API確認
  if (
    collectedActivity.value &&
    collectedActivity.value.redeemPrize.length > 0 &&
    collectedStore.value.length >= collectedActivity.value.redeemPrize[0]
  ) {
    try {
      const commitRes = await commitReceivePrize(eventId)
      if (commitRes) {
        // 兌獎觸發成功引導到兌獎頁面
        router.push({ path: `/winning/${eventId}` })
      } else {
        errorAlert(content.swal.backActivity, `/activity/${eventId}`, 'question', content.swal.notReached)
      }
    } catch (error) {
      errorAlert(String(error), `/activity/${eventId}`)
    }
  } else {
    errorAlert(content.swal.backActivity, `/activity/${eventId}`, 'question', content.swal.notReached)
  }
}

onMounted(async () => {
  layoutStore.loadToggle(true)
  try {
    const confirmRes = await confirmEvent(eventId)
    collectedActivity.value = confirmRes
    const res = await fetchCollectData(eventId)
    if (res) {
      collectedStore.value = res.historyList || []
      iconStore.value = res.storeIconList || []
      setAccumulatCheckinCount(collectedStore.value.length)
    }
    layoutStore.loadToggle(false)
  } catch (error) {
    if (error === 1) {
      activityErrorAlert(content.activity.notFound)
    } else if (error === 2) {
      activityErrorAlert(content.activity.timeOver)
    } else {
      errorAlert(String(error), `/activity/${eventId}`)
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

const parseIconURL = (baseItem: EventInterface) => {
  if (!baseItem) return ''
  const target = iconStore.value.find((item) => item.storeId === baseItem.storeId)
  return target ? target.iconFilePath : ''
}
</script>

<template>
  <main class="collected topBg">
    <HeaderMenu />
    <div>
      <div class="collected__header">
        <div class="collected__header--text-block">
          <h1 class="collected__header--text-block-main">
            {{ collectedActivity?.eventName || '-' }}
          </h1>
          <h1 class="collected__header--text-block-bg">
            {{ collectedActivity?.eventName || '-' }}
          </h1>
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
            :alt="`門市${baseItem}`"
          />
          <img v-else :src="emptyStampImg" alt="還沒打卡" />
        </div>
      </div>
      <footer class="collected__footer">
        <button 
          class="store-btn redeem" 
          @click="clickReceivePrize()"
          :title="content.btn.goRedeem"
        >
          {{ content.btn.goRedeem }}
        </button>
        <button 
          class="store-btn activity" 
          @click="goToEventPage()"
          :title="content.btn.backHome"
        >
          {{ content.btn.backHome }}
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
  min-height: 100dvh;

  &__header {
    @extend %flexColInfo;
    justify-content: center;
    @extend %mainSection;
    flex-wrap: wrap;
    height: 145px;
    background-color: $green4;

    &--text-block {
      position: relative;
      margin-top: 0.75rem;
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
        -webkit-text-stroke: 0.5rem $green3;
      }
    }

    &--date {
      color: $white;
      margin-top: 0.75rem;
      display: flex;
      align-items: end;
      gap: 0.5rem;

      &-line {
        width: 2rem;
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
    height: 2.5rem;
    bottom: 60px;
    top: auto;
    @extend %flexRowInfo;
    gap: 0.875rem;
    .store-btn{
      margin: 0;
    }
  }

  .stamp-grade {
    border-color: $white;
  }
}
</style>
