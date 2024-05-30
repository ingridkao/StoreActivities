<script setup lang="ts">
/**
 * 打卡結果
 */
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { ScanResultType } from '@/types/ResponseHandle'
import { useLink } from '@/composable/useLink'

import checkFailImg from '@/assets/images/scan/check-fail.svg'
import checkSuccessImg from '@/assets/images/scan/check-success.svg'
import checkFailImageImg from '@/assets/images/scan/check-fail-image.png'
import keepCheckButtonImg from '@/assets/images/scan/keep-check-button.svg'
import recordButtonImg from '@/assets/images/scan/record-button.svg'
import checkSuccessImageImg from '@/assets/images/scan/check-success-image.png'

const { linkToTargetActivityIdPage } = useLink()

const props = defineProps<{
  result: ScanResultType,
  error: Number | String,
}>()
const successResult = computed(() => Object.keys(props.result).length > 0)
const errorMsg = computed(() => {
  if(props.error == 1){
    return '此活動異常，請重新操作'
  }else if(props.error == 2){
    return '服務中斷'
  }else if(props.error == 3){
    return '請重新進行掃描打卡'
  }else if(props.error == 4){
    return '訪客無法進行打卡，請重新操作'
  }else if(props.error == 5){
    return '你不在門市所在位置，請重新操作'
  }else{
    return String(props.error)
  }
})
</script>

<template>
  <div
    class="scan-result"
    :class="{
      fail: !successResult
    }"
  >
    <div class="scan-result__content">
      <div class="scan-result__content--result-text">
        <img v-if="successResult" :src="checkSuccessImg" alt="check success" />
        <img v-else :src="checkFailImg" alt="check fail" />
      </div>

      <div v-if="successResult" class="scan-result__content--success">
        <div class="scan-result__content--success-image">
          <img :src="checkSuccessImageImg" alt="check success" />
        </div>
        <div class="scan-result__content--success-info">
          <p class="scan-result__content--success-info-id">{{ props.result.storeId }}</p>
          <p class="scan-result__content--success-info-name">{{ props.result.storeName }}門市</p>
          <p class="scan-result__content--success-info-date">{{ props.result.date || dayjs().format('YYYY_MM_DD_HH:mm') }}</p>
        </div>
      </div>
      <div v-else class="scan-result__content--fail">
        <div class="scan-result__content--fail-image">
          <img :src="checkFailImageImg" alt="check fail" />
        </div>
        <div class="scan-result__content--fail-msg">{{ errorMsg }}</div>
      </div>

      <div class="scan-result__button">
        <div class="scan-result__button--wrapper">
          <img
            @click="linkToTargetActivityIdPage(props.result.eventId, 'Collected')"
            :src="recordButtonImg"
            alt="查看紀錄"
          />
        </div>
        <button class="scan-result__button--wrapper-keep" @click="$emit('scanAgain')">
          <img :src="keepCheckButtonImg" alt="繼續打卡" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scan-result {
  position: fixed;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: scroll;
  top: 0;
  left: 0;
  background: url('@/assets/images/scan/success-bg.png') repeat;

  &.fail {
    background: url('@/assets/images/scan/fail-bg.png') repeat;
  }

  &__content {
    width: 100%;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 700px;
    height: 100%;

    &--result-text {
      width: 225px;
      height: 90px;
      align-self: end;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &--success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 64px;

      &-image {
        width: 210px;
        height: 278px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      &-info {
        width: 334px;
        height: 191px;
        display: flex;
        color: #594c40;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateY(-10px);
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 78px;
      padding-top: 20px;
      &-image {
        width: 300px;
        height: 278px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      &-msg{
        margin-top: 16px;
      }
    }
  }

  &__button {
    display: flex;
    justify-content: center;
    gap: 24px;

    &--wrapper {
      width: 135px;
      height: 40px;
      overflow: hidden;

      &-keep {
        width: 143px;
        height: 40px;
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
