<script setup lang="ts">
/**
 * 中獎序號s
 */
import { ref, watchEffect, computed } from 'vue'
import content from '@/assets/content'
import type { PrizeUiDisplayInfoType } from '@/types/ResponseHandle'

import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useEventStorage } from '@/composable/useEventStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useDay } from '@/composable/useDay'

import { useLayoutStore } from '@/stores/layout'

import ParagraphItem from '@/components/ParagraphItem.vue'
import winningCatImg from '@/assets/images/cat/winning-cat.png'
import backButtonImg from '@/assets/images/button/back-collected.svg'
import nextArrowImg from '@/assets/images/button/next-arrow.svg'
import prevArrowImg from '@/assets/images/button/prev-arrow.svg'

const { linkToTargetActivityIdPage } = useLink()
const { fetchReceivePrize } = useFetchData()
const { getTargetEventStorage, getAccumulatCheckinCount } = useEventStorage()
const { errorAlert } = useSweetAlert()
const { parseData } = useDay()

const prizeIndex = ref(0)
const prizeTargetInfo = computed(() => prizeInfo.value[prizeIndex.value] || null)

const checkinCount = ref(0)
const prizeInfo = ref<PrizeUiDisplayInfoType[]>([])
const layoutStore = useLayoutStore()
watchEffect(async () => {
  checkinCount.value = getAccumulatCheckinCount()
  const TargetEvent = getTargetEventStorage()
  if (TargetEvent && TargetEvent.id) {
    layoutStore.loadToggle(true)
    try {
      const res = await fetchReceivePrize(TargetEvent.id)
      if (res && res.length > 0) {
        prizeInfo.value = res
      } else {
        errorAlert('未達到兌換門檻，回到活動頁面', `/activity/${TargetEvent.id}`)
      }
    } catch (error) {
      errorAlert(String(error), `/activity/${TargetEvent.id}`)
    }
    layoutStore.loadToggle(false)
  } else {
    errorAlert('操作異常，回到活動大廳')
  }
})
</script>

<template>
  <main class="winning">
    <h5 v-if="prizeTargetInfo && checkinCount > 0" class="winning__tip">
      {{ `${content.winning.accumulate} ${checkinCount} ${content.winning.store}` }}
    </h5>

    <section class="winning__wrapper" v-if="prizeTargetInfo">
      <div class="winning__wrapper--top" :class="`type${prizeTargetInfo.grade}`">
        <p>{{ prizeTargetInfo.awardName || '' }}</p>
        <span> ({{ prizeTargetInfo.count || 0 }}/{{ prizeTargetInfo.total || 0 }}) </span>
      </div>

      <div class="winning__wrapper--middle">
        {{ prizeTargetInfo.instructions || '' }}
      </div>

      <div class="winning__wrapper--bottom">
        <p v-if="prizeTargetInfo.serialNumber">
          <span class="label">{{ content.winning.serialNumber }} </span>
          <span class="desc serial">{{ prizeTargetInfo.serialNumber }}</span>
        </p>
        <p v-if="prizeTargetInfo.useInterval">
          <span class="label">{{ content.winning.deadline }} </span>
          <span class="desc">{{ prizeTargetInfo.useInterval }}</span>
        </p>
        <p v-if="prizeTargetInfo.getSNTime">
          <span class="label">{{ content.winning.create }} </span>
          <span class="desc">{{ parseData(prizeTargetInfo.getSNTime) }}</span>
        </p>
      </div>
    </section>

    <section class="winning__cat">
      <button
        class="winning__cat--prev-arrow"
        :class="{ show: prizeIndex !== 0 }"
        @click="() => prizeIndex > 0 && prizeIndex--"
      >
        <img :src="prevArrowImg" alt="prev arrow" />
      </button>
      <div class="winning__cat--image">
        <img :src="winningCatImg" alt="winning cat" />
      </div>
      <button
        class="winning__cat--next-arrow"
        :class="{ show: prizeIndex !== prizeInfo.length - 1 }"
        @click="() => prizeIndex < prizeInfo.length - 1 && prizeIndex++"
      >
        <img :src="nextArrowImg" alt="next arrow" />
      </button>
    </section>

    <section class="winning__content store-content">
      <ParagraphItem
        :title="content.winning.explanationTitle"
        :content="
          prizeTargetInfo && prizeTargetInfo.operatingProcedures
            ? prizeTargetInfo.operatingProcedures
            : ''
        "
      />
      <button class="store-btn" @click="linkToTargetActivityIdPage('', 'Collected')">
        <img :src="backButtonImg" alt="返回打卡紀錄" />
      </button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.winning {
  position: relative;

  overflow: auto;
  background: url('@/assets/images/bg/green.png');

  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 80px;

  &__tip {
    position: absolute;
    top: 60px;
    color: #fff;
    font-weight: 700;
    font-size: 20px;
  }

  &__wrapper {
    background: #fff;
    margin-top: 28px;
    border-radius: 15px;

    display: flex;
    flex-direction: column;
    overflow: hidden;

    width: 270px;
    @media screen and (min-width: 600px) {
      width: 80%;
      max-width: 520px;
      margin: 28px auto 0 auto;
    }

    > div {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    &--top {
      padding: 8px 0;
      font-size: 20px;
      font-weight: 700;
      color: #473423;
      gap: 4px;

      p {
        margin-top: 6px;
      }

      span {
        font-size: 15px;
        font-weight: 500;
      }

      &.type1 {
        background-color: #efdc2b;
      }

      &.type2 {
        background-color: #afeb30;
      }

      &.type3 {
        background-color: #ffa41b;
      }
    }

    &--middle {
      padding: 12px 0;
      font-size: 24px;
      font-weight: 700;
      color: #85846b;
      background-color: #f7f7f7;
    }

    &--bottom {
      align-items: start;
      padding: 8px 25px;
      background-color: #eeecd8;
      gap: 8px;
      > p {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        width: 100%;
        flex: 1;
      }
      span {
        font-size: 14px;
        color: #85846b;
        font-weight: 500;
        display: inline-block;
      }
      span.label {
        font-weight: 700;
        width: 65px;
      }
      span.desc {
        width: calc(100% - 65px);
        word-wrap: break-word;
        &.serial {
          font-size: 20px;
          font-weight: 900;
          color: #473423;
        }
      }
    }
  }

  &__cat {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-around;

    &--image {
      width: 152px;
      height: 190px;
      overflow: hidden;
      margin: -10px 0;
    }

    &--next-arrow,
    &--prev-arrow {
      cursor: pointer;
      width: 32px;
      height: 37px;
      overflow: hidden;
      visibility: hidden;
      &.show {
        visibility: visible;
      }
    }
  }

  &__content {
    padding: 42px 27px 42px 27px;
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    width: 100%;
    max-width: $card-middle;
    margin: auto;
  }
}
</style>
