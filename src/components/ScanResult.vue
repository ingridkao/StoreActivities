<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { ScanResultType } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'
import { useDay } from '@/composable/useDay'

import content from '@/assets/content'
import checkFailText from '@/assets/images/scan/check-fail-text.svg'
import checkSuccessText from '@/assets/images/scan/check-success-text.svg'
import checkFailImageImg from '@/assets/images/cat/check-fail-cat.png'
import checkSuccessImageImg from '@/assets/images/cat/check-success-cat.png'

const { linkToTargetActivityIdPage } = useLink()
const { parseData } = useDay()
const props = defineProps<{
  result: ScanResultType
  error: Number | String
}>()
const successResult = computed(() => Object.keys(props.result).length > 0)
const errorMsg = computed(() => props.error || '')
const route = useRoute()
const eventId = route?.params?.id
</script>

<template>
  <div
    class="scanResult"
    :class="{
      fail: !successResult
    }"
  >
    <div class="scanResult_container">
      <div class="scanResult_container--img">
        <img v-if="successResult" :src="checkSuccessText" alt="打卡成功" width="225" height="90" />
        <img v-else :src="checkFailText" alt="打卡失敗" width="225" height="90" />
      </div>

      <div v-if="successResult" class="scanResult_container--result scanResult_container--success">
        <div class="catImg">
          <img :src="checkSuccessImageImg" alt="check success" />
        </div>
        <div class="scanResult_container--success-info">
          <p class="scanResult_container--success-info-id">{{ props.result.storeId }}</p>
          <p class="scanResult_container--success-info-name">
            {{ props.result.storeName }}{{ content.mapStore.storeLabel }}
          </p>
          <p class="scanResult_container--success-info-date">
            {{ parseData(props.result.date) }}
          </p>
        </div>
      </div>

      <div v-else class="scanResult_container--result scanResult_container--fail">
        <div class="catImg">
          <img :src="checkFailImageImg" alt="無奈喵~~" width="336" height="403" />
        </div>
        <div class="scanResult_container--fail-msg">{{ errorMsg }}</div>
      </div>

      <footer class="scanResult__button">
        <button
          class="store-btn record"
          @click="linkToTargetActivityIdPage(eventId, 'Collected')"
          :title="content.btn.goCollected"
        >
          {{ content.btn.goCollected }}
        </button>
        <button
          class="store-btn keepCheck"
          @click="$emit('scanAgain')"
          :title="content.btn.scanAgain"
        >
          {{ content.btn.scanAgain }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catImg > img {
  width: 80%;
  margin: auto;
}
.scanResult {
  @extend %fixedSection;
  height: 100dvh;
  overflow-y: scroll;

  &_container {
    @extend %flexColInfo;
    justify-content: center;
    position: relative;
    width: 80%;
    max-width: $card-basic;
    margin: 2.5rem auto;
    &--img {
      width: 14.125rem;
      align-self: end;
    }

    &--result {
      @extend %mainSection;
      max-width: $card-middle;
    }

    &--success {
      margin-bottom: 64px;
      &-info {
        @extend %flexColInfo;
        justify-content: center;
        flex-wrap: wrap;
        @extend %mainSection;
        width: 20.875rem;
        height: 11.875rem;
        color: $brown;

        @extend %imgContainer;
        background-image: url('@/assets/images/scan/check-success-bg.png');

        &-id {
          margin-top: 0.625rem;
          font-size: 1.125rem;
          font-weight: 700;
        }

        &-name {
          font-size: 2rem;
          font-weight: 900;
          margin-top: 0.75rem;
          margin-bottom: 1.125rem;
        }

        &-date {
          font-size: 1rem;
          font-weight: 500;
        }
      }
    }

    &--fail {
      &-msg {
        margin-top: 1.5rem;
        word-break: break-word;
        text-align: center;
      }
    }
  }

  &__button {
    @extend %flexRowInfo;
    gap: 1.5rem;
  }
}
</style>
