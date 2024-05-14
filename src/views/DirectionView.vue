<script setup lang="ts">
/**
 * 打卡教學
 * step1.取得LINE user profile
 *       - 已登入:繼續step2
 *       - 未登入:LINE Login redirect到活動說明頁面
 * step2.開啟打卡頁面|功能
 */
import HeaderMenu from '@/components/HeaderMenu.vue'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useLIFF } from '@/composable/useLIFF'

import data from '@/assets/data'
import DecoCatImg from '@/assets/images/direction/deco-cat.png'
import step1IconImg from '@/assets/images/direction/step-1-icon.svg'
import step1PictureImg from '@/assets/images/direction/step-1-picture.png'
import step2IconImg from '@/assets/images/direction/step-2-icon.svg'
import step2PictureImg from '@/assets/images/direction/step-2-picture.png'
import checkInButtonImg from '@/assets/images/direction/check-in-button.svg'

const { setParamsIdStorage } = useBrowserStorage()
setParamsIdStorage()

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
    <HeaderMenu />
    <div class="direction-view__deco-cat">
      <img :src="DecoCatImg" alt="deco cat" />
    </div>
    <div class="direction-view__step1">
      <div class="direction-view__step1--icon">
        <img :src="step1IconImg" alt="step 1 icon" />
      </div>
      <div class="direction-view__step1--text">
        <p>{{ data.direction.step1Text }}</p>
        <p class="direction-view__step1--text-tip">{{ data.direction.step1Tip }}</p>
      </div>
    </div>
    <div class="direction-view__step1--image">
      <img :src="step1PictureImg" alt="step 1 image" />
    </div>
    <div class="direction-view__step2">
      <div class="direction-view__step2--image">
        <img :src="step2PictureImg" alt="step 2 image" />
      </div>
      <div class="direction-view__step2--text">
        <div class="direction-view__step2--text-icon">
          <img :src="step2IconImg" alt="step 2 icon" />
        </div>
        <p>{{ data.direction.step2Text }}</p>
      </div>
    </div>
    <div class="direction-view__button" @click="startScanning">
      <img :src="checkInButtonImg" alt="check in button" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.direction-view {
  background: url('@/assets/images/direction/bg.png') repeat;
  padding-top: 60px;

  &__deco-cat {
    margin: auto;
    width: 208px;
    height: 194px;
    overflow: hidden;
    transform: translateX(24px);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__step1 {
    display: flex;
    align-items: flex-end;
    color: #fff;
    gap: 12px;
    justify-content: center;

    &--icon {
      width: 53px;
      height: 68px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

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
      height: 177px;
      overflow: hidden;
      margin-bottom: 38px;
      transform: translateX(24px);

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  &__step2 {
    display: flex;
    margin-left: 34px;
    align-items: center;
    gap: 8px;

    &--image {
      width: 102px;
      height: 205px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &--text {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 8px;

      &-icon {
        width: 53px;
        height: 68px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

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
