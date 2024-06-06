<script setup lang="ts">
/**
 * 門市地圖
 */
import { onMounted, onUnmounted } from 'vue'

import HeaderMenu from '@/components/HeaderMenu.vue'
import { useLink } from '@/composable/useLink'
import { useMapbox } from '@/composable/useMapbox'

import data from '@/assets/data'
import mapIconButtonImg from '@/assets/images/mapStore/map-button.svg'
import checkInButtonImg from '@/assets/images/mapStore/check-in-button.svg'
import mapCatImg from '@/assets/images/mapStore/map-cat.png'

const { linkToTargetActivityIdPage } = useLink()
const {
  storeFilterOptions,
  storeFilterSelectd,
  targetBoxData,
  toggleStoreInfo,
  updateChecked,
  mapNavigation
} = useMapbox()

// 點選門市後出現資訊drawerBox >> 點選drawerBox以外則toggleStoreInfo()
const handleOutsideClick = (event: Event) => {
  const inputTarget = event.target as HTMLInputElement
  toggleStoreInfo(String(inputTarget.classList.value))
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <main class="map-store-view">
    <HeaderMenu />
    <div id="mapboxBasic"></div>

    <div class="map-store-view__panel">
      <div v-if="targetBoxData.toggle" class="map-store-view__panel--info">
        <div class="map-store-view__panel--info-center-button" @click="mapNavigation">
          <img :src="mapIconButtonImg" alt="center icon button" />
        </div>
        <div class="map-store-view__panel--info-logo">
          <img src="/images/example-logo.svg" alt="logo point" />
        </div>
        <div v-if="targetBoxData.info" class="map-store-view__panel--info-content">
          <p>{{ data.mapStore.storeLabel }}：</p>
          <p>{{ targetBoxData.info['store_id'] }} {{ targetBoxData.info['store_name'] }}</p>
          <p>{{ data.mapStore.addressLabel }}：</p>
          <p>{{ targetBoxData.info['address'] }}</p>
        </div>
      </div>
      <div v-else class="map-store-view__panel--filter store-content">
        <div class="map-store-view__panel--cat">
          <img :src="mapCatImg" />
        </div>
        <button class="map-store-view__panel--button store-btn" @click="linkToTargetActivityIdPage('', 'Activity')">
          <img :src="checkInButtonImg" alt="check in button" />
        </button>
        <div class="map-store-view__panel--filterbutton">
          <button
            v-for="item in storeFilterOptions"
            :key="item.value"
            class="map-store-view__panel--filterbutton-item"
            @click="updateChecked(item.value)"
            :class="{ active: storeFilterSelectd === item.value }"
          >
            <p>{{ item.nameTw }}</p>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapboxBasic {
  width: 100%;
  height: calc(100vh - 125px);
}

.map-store-view {
  z-index: 2;
  position: relative;

  &__panel {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    height: 125px;
    background: url('@/assets/images/mapStore/bg.png') repeat;

    &--info {
      padding: 20px 25px;
      display: flex;
      gap: 15px;
      align-items: center;
      position: relative;

      &-center-button {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 4px;
        right: 16px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      &-logo {
        width: 84px;
        height: 84px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      &-content {
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-template-rows: 1fr 1fr;
        row-gap: 12px;
        p {
          color: #fff;
          font-size: 16px;
          line-height: 120%;
        }
      }
    }

    &--filter {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 13px;
      height: 100%;
    }

    &--cat {
      position: absolute;
      width: 157px;
      height: 200px;
      bottom: -5px;
      left: 0;
    }

    &--button {
      height: 40px;
      z-index: 5;
      transform: translateY(-50%);
      @media screen and (min-width: 855px) {
        display: none;
      }
    }

    &--filterbutton {
      position: absolute;
      bottom: 15px;
      right: 12px;
      display: flex;
      gap: 9px;
      &-item {
        padding: 9px 23px;
        width: 71px;
        height: 55px;
        text-align: center;
        background-size: cover;
        background-image: url('@/assets/images/mapStore/inactive-button.svg');

        &.active {
          background-image: url('@/assets/images/mapStore/active-button.svg');

          p {
            color: #000;
          }
        }

        p {
          white-space: pre-line;
          font-size: 12px;
          line-height: 120%;
          font-weight: 700;
          color: #8995a1;
        }
      }
    }
  }
}
</style>
