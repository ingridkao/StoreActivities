<script setup lang="ts">
/**
 * 打卡教學
 * step1.取得LINE user profile
 *       - 已登入:繼續step2
 *       - 未登入:LINE Login redirect到活動說明頁面
 * step2.開啟打卡頁面|功能
 */
import HeaderMenu from '@/components/HeaderMenu.vue'
import { useLIFF } from '@/composable/useLIFF'

import data from '@/assets/data'
import DecoCatImg from '@/assets/images/direction/deco-cat.png'
import step1IconImg from '@/assets/images/direction/step-1-icon.svg'
import step1PictureImg from '@/assets/images/direction/step-1-picture.png'
import step2IconImg from '@/assets/images/direction/step-2-icon.svg'
import step2PictureImg from '@/assets/images/direction/step-2-picture.png'
import checkInButtonImg from '@/assets/images/direction/check-in-button.svg'

const { scanCode } = useLIFF()
const startScanning = async () => {
  try {
    await scanCode()
  } catch (error) {
    // 異常
    console.error(error)
    // 顯示提示錯誤dialog
    // 倒數10秒reset
  }
}
</script>

<template>
  <main class="direction-view">
    <HeaderMenu :knowActivity="true" />
    <div class="direction-view__deco-cat">
      <img :src="DecoCatImg" alt="deco cat" />
    </div>
    <div class="direction-view__step1">
      <img :src="step1IconImg" alt="step 1 icon" />
      <div class="direction-view__step1--text">
        <p>{{ data.direction.step1Text }}</p>
        <p class="direction-view__step1--text-tip">{{ data.direction.step1Tip }}</p>
      </div>
    </div>
    <div class="direction-view__step1--image">
      <img :src="step1PictureImg" alt="step 1 image" />
    </div>
    <div class="direction-view__step2">
      <img :src="step2PictureImg" alt="step 2 image" class="direction-view__step2--image" />
      <div class="direction-view__step2--text">
        <img :src="step2IconImg" alt="step 2 icon" />
        <p>{{ data.direction.step2Text }}</p>
      </div>
    </div>
    <div class="direction-view__button">
      <img :src="checkInButtonImg" alt="check in button" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.direction-view {
  background: url('@/assets/images/main-bg.png') repeat;
  padding-top: 60px;

  &__deco-cat {
    margin: auto;
    width: 208px;
    img {
      width: 100%;
      height: auto;
      transform: translateX(24px);
    }
  }

  &__step1 {
    display: flex;
    align-items: flex-end;
    color: #fff;
    gap: 12px;
    justify-content: center;

    &--text {
      font-size: 18px;
      line-height: 18px;
      padding-bottom: 10px;
      transform: translateY(10px);

      &-tip {
        margin-top: 8px;
        font-size: 15px;
        line-height: 15px;
      }
    }

    &--image {
      margin: auto;
      width: 230px;
      transform: translateX(24px);
      margin-bottom: 38px;
    }
  }

  &__step2 {
    display: flex;
    margin-left: 34px;
    align-items: center;
    gap: 8px;

    &--image {
      width: 86px;
    }

    &--text {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 8px;

      p {
        width: 130px;
        color: #fff;
        font-size: 18px;
        margin-bottom: 9px;
      }
    }
  }

  &__button {
    padding: 27px 0 42px;
    text-align: center;
  }
}
</style>
