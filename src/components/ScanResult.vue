<script setup lang="ts">
/**
 * 打卡結果
 */
import { computed } from 'vue'
import type { ScanResultType } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'
import { useDay } from '@/composable/useDay'

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
          <p class="scanResult_container--success-info-name">{{ props.result.storeName }}門市</p>
          <p class="scanResult_container--success-info-date">
            {{ parseData(props.result.date) }}
          </p>
        </div>
      </div>

      <div v-else class="scanResult_container--result scanResult_container--fail">
        <div class="catImg">
          <img :src="checkFailImageImg" alt="check fail" />
        </div>
        <div class="scanResult_container--fail-msg">{{ errorMsg }}</div>
      </div>

      <footer class="scanResult__button">
        <button
          class="store-btn record"
          @click="linkToTargetActivityIdPage(props.result.eventId, 'Collected')"
          title="查看紀錄"
        >
          查看紀錄
        </button>
        <button 
          class="store-btn keepCheck" 
          @click="$emit('scanAgain')"
          title="繼續打卡"
        >
          繼續打卡
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catImg > img{
  width: 80%;
  margin: auto;
}
.scanResult {
  @extend %fixedSection;
  top: 0;
  left: 0;
  height: 100dvh;
  &_container {
    @extend %flexColInfo;
    @extend %mainSection;
    width: 80%;
    max-width: $card-basic;
    margin: 40px auto;
    &--img {
      width: 225px;
      align-self: end;
    }

    &--result{
      // @extend %flexColInfo;
      @extend %mainSection;
      max-width: $card-middle;
    }

    &--success {
      margin-bottom: 64px;
      &-info {
        @extend %flexColInfo;
        @extend %mainSection;
        flex-wrap: wrap;
        width: 334px;
        height: 191px;

        color: $brown;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('@/assets/images/scan/check-success-bg.png');

        &-id {
          margin-top: 10px;
          font-size: 18px;
          font-weight: 700;
        }

        &-name {
          font-size: 32px;
          font-weight: 900;
          margin-top: 12px;
          margin-bottom: 19px;
        }

        &-date {
          font-size: 15px;
          font-weight: 500;
        }
      }
    }

    &--fail {
      &-msg {
        margin-top: 24px;
        word-break: break-word;
        max-width: $content-small;
      }
    }
  }

  &__button{
    @extend %flexRowInfo;
    gap: 24px;
  }
}
</style>
