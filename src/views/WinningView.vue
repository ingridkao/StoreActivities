<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'

import content from '@/assets/content'
import type { PrizeUiDisplayInfoType } from '@/types/ResponseHandle'

import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useEventStorage } from '@/composable/useEventStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useDay } from '@/composable/useDay'
import { useClipboard } from '@vueuse/core'

import { useLayoutStore } from '@/stores/layout'

import ParagraphItem from '@/components/ParagraphItem.vue'
import winningCatImg from '@/assets/images/cat/winning-cat.png'
import backButtonImg from '@/assets/images/button/back-collected.svg'
import nextArrowImg from '@/assets/images/button/next-arrow.svg'
import prevArrowImg from '@/assets/images/button/prev-arrow.svg'

const { linkToTargetActivityIdPage } = useLink()
const { fetchReceivePrize } = useFetchData()
const { getAccumulatCheckinCount } = useEventStorage()
const { errorAlert } = useSweetAlert()
const { parseData } = useDay()

const { isSupported, copy } = useClipboard()
const copyClipboard = () => {
  if (isSupported.value && prizeTargetInfo.value && prizeTargetInfo.value.serialNumber) {
    copy(prizeTargetInfo.value.serialNumber)
  }
}

const route = useRoute()
const eventId = String(route.params.id)

const checkinCount = ref(0)
const prizeIndex = ref(0)
const prizeTargetInfo = computed(() => prizeInfo.value[prizeIndex.value] || null)
const prizeInfo = ref<PrizeUiDisplayInfoType[]>([])

const layoutStore = useLayoutStore()
watchEffect(async () => {
  checkinCount.value = getAccumulatCheckinCount()
  try {
    layoutStore.loadToggle(true)
    const res = await fetchReceivePrize(eventId)
    if (res && res.length > 0) {
      prizeInfo.value = res
    } else {
      errorAlert(
        content.swal.backActivity,
        `/activity/${eventId}`,
        'question',
        content.swal.notReached
      )
    }
    layoutStore.loadToggle(false)
  } catch (error) {
    errorAlert(String(error), `/activity/${eventId}`)
    layoutStore.loadToggle(false)
  }
})
</script>

<template>
  <main class="winning">
    <h5 v-if="prizeTargetInfo && checkinCount > 0" class="winning__tip">
      {{ `${content.winning.accumulate} ${checkinCount} ${content.winning.store}` }}
    </h5>

    <section class="winning__awards" v-if="prizeTargetInfo">
      <div class="winning__awards--top" :class="`type${prizeTargetInfo.grade}`">
        <p>{{ prizeTargetInfo.awardName || '' }}</p>
        <span> ({{ prizeTargetInfo.count || 0 }}/{{ prizeTargetInfo.total || 0 }}) </span>
      </div>

      <div class="winning__awards--middle">
        {{ prizeTargetInfo.instructions || '' }}
      </div>

      <div class="winning__awards--bottom">
        <p v-if="prizeTargetInfo.serialNumber" @click="copyClipboard">
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
        v-if="prizeTargetInfo"
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
        v-if="prizeTargetInfo"
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
      <button class="store-btn" @click="linkToTargetActivityIdPage(eventId, 'Collected')">
        <img :src="backButtonImg" :alt="content.btn.backCollected" />
      </button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.winning {
  @extend %mainSection;
  @extend %flexColInfo;
  padding-top: 5rem;
  background: url('@/assets/images/bg/green.png');

  &__tip {
    position: absolute;
    top: 3.75rem;
    color: $whitePure;
    font-weight: 700;
    font-size: 1.25rem;
  }

  &__awards {
    font-family: 'GenSenRounded', Helvetica, sans-serif;
    font-weight: 900;

    @extend %flexColInfo;
    @extend %roundBox;
    background: $whitePure;
    margin-top: 1.75rem;

    width: 16.875rem;
    @media screen and (min-width: 600px) {
      width: 80%;
      max-width: 32.5rem;
      margin: 1.75rem auto 0 auto;
    }
    > div {
      @extend %flexColInfo;
      justify-content: center;
      width: 100%;
    }
    &--top {
      padding: 1rem 0 0.5rem 0;
      &.type1 {
        background-color: $yellow0;
      }
      &.type2 {
        background-color: $green0;
      }
      &.type3 {
        background-color: $orange0;
      }
      > * {
        color: $brown2;
        font-weight: 900;
      }
      p {
        font-size: 1.1rem;
      }
      span {
        font-size: 1rem;
      }
    }

    &--middle {
      font-weight: 900;
      font-size: 1.5rem;
      color: $gray2;
      word-break: keep-all;
      text-align: center;
      line-height: 1.3;

      min-height: 7rem;
      background-color: $whitePure;
      padding: 0.75rem 1rem;
    }

    &--bottom {
      align-items: start;
      padding: 1rem;
      background-color: $white3;
      gap: 0.5rem;
      > p {
        @extend %flexRowInfo;
        width: 100%;
        flex: 1;
      }
      span {
        display: inline-block;
        &.label {
          font-weight: 700;
          font-size: 0.875rem;
          width: 3.75rem;
          color: $gray2;
        }
        &.desc {
          font-weight: 500;
          font-size: 0.875rem;
          width: calc(100% - 4rem);
          word-wrap: break-word;
          color: $gray2;
        }
        &.serial {
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1;
          color: $brown2;
        }
      }
    }
  }

  &__cat {
    @extend %flexRowInfo;
    justify-content: space-around;
    width: 100%;

    &--image {
      width: 9.5rem;
      height: 11.875rem;
      overflow: hidden;
      margin: -0.625rem 0;
    }

    &--next-arrow,
    &--prev-arrow {
      width: 2rem;
      height: 2.375rem;
      overflow: hidden;
      visibility: hidden;
      &.show {
        visibility: visible;
      }
    }
  }

  &__content {
    @extend %flexColInfo;
    justify-content: space-between;
    flex: 1;
    @extend %mainSection;
    max-width: $card-middle;
    padding: 2.625rem 1.75rem;
    background-color: $whitePure;
  }
}
</style>
