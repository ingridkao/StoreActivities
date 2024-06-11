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
  result: ScanResultType
  error: Number | String
}>()
const successResult = computed(() => Object.keys(props.result).length > 0)
const errorMsg = computed(() => props.error || '')
const parseData = (date: string = '') => {
  const newdate = date ? dayjs(date) : dayjs()
  return newdate.format('YYYY/MM/DD HH:mm')
}
</script>

<template>
  <div
    class="commom scanResult"
    :class="{
      fail: !successResult
    }"
  >
    <div class="scanResult__content">
      <div class="scanResult__content--result-text">
        <img v-if="successResult" :src="checkSuccessImg" alt="check success" />
        <img v-else :src="checkFailImg" alt="check fail" />
      </div>

      <div v-if="successResult" class="scanResult__content--success">
        <div class="scanResult__content--success-image">
          <img :src="checkSuccessImageImg" alt="check success" />
        </div>
        <div class="scanResult__content--success-info">
          <p class="scanResult__content--success-info-id">{{ props.result.storeId }}</p>
          <p class="scanResult__content--success-info-name">{{ props.result.storeName }}門市</p>
          <p class="scanResult__content--success-info-date">
            {{ parseData(props.result.date) }}
          </p>
        </div>
      </div>
      <div v-else class="scanResult__content--fail">
        <div class="scanResult__content--fail-image">
          <img :src="checkFailImageImg" alt="check fail" />
        </div>
        <div class="scanResult__content--fail-msg">{{ errorMsg }}</div>
      </div>

      <div class="store-btn-list">
        <div
          class="store-btn"
          @click="linkToTargetActivityIdPage(props.result.eventId, 'Collected')"
        >
          <img :src="recordButtonImg" alt="查看紀錄" />
        </div>
        <button class="store-btn" @click="$emit('scanAgain')">
          <img :src="keepCheckButtonImg" alt="繼續打卡" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scanResult {
  position: fixed;
  z-index: 4;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 0;
  left: 0;
  background: url('@/assets/images/scan/success-bg.png') repeat;

  &.fail {
    background: url('@/assets/images/scan/fail-bg.png') repeat;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 700px;
    padding: 0 24px;

    &--result-text {
      width: 225px;
      height: 90px;
      align-self: end;
      overflow: hidden;
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
      }
      &-msg {
        margin-top: 16px;
      }
    }
  }
}
</style>
