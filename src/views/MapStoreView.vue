<script setup lang="ts">
/**
 * 門市地圖
 */
import { onMounted, onUnmounted } from 'vue'

import HeaderMenu from '@/components/HeaderMenu.vue'
import { useMapbox } from '@/composable/useMapbox'
import { useLink } from '@/composable/useLink'

import data from '@/assets/data'
import centerIconButtonImg from '@/assets/images/mapStore/center-icon-button.svg'
import checkInButtonImg from '@/assets/images/mapStore/check-in-button.svg'
import mapCatImg from '@/assets/images/mapStore/map-cat.png'

const {
  storeFilterOptions,
  storeFilterSelectd,
  targetBoxData,
  toggleStoreInfo,
  updateChecked,
  mapNavigation
} = useMapbox()
const { linkToDirection } = useLink()
const goToDirection = () => {
  // TODO: 提示離開此頁面
  linkToDirection()
}

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
    <HeaderMenu :knowActivity="true" />
    <div id="mapboxBasic"></div>

    <div class="map-store-view__panel">
      <div v-if="targetBoxData.toggle" class="map-store-view__panel--info">
        <div class="map-store-view__panel--info-center-button" @click="mapNavigation">
          <img :src="centerIconButtonImg" alt="center icon button" />
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
      <div v-else class="map-store-view__panel--filter">
        <div class="map-store-view__panel--cat">
          <img :src="mapCatImg" />
        </div>
        <div class="map-store-view__panel--button" @click="goToDirection">
          <img :src="checkInButtonImg" alt="check in button" />
        </div>
        <div class="map-store-view__panel--store-button">
          <div
            v-for="item in storeFilterOptions"
            :key="item.value"
            class="map-store-view__panel--store-button-item"
            @click="updateChecked(item.value)"
            :class="{ active: storeFilterSelectd === item.value }"
          >
            <p>{{ item.nameTw }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapMain {
  position: relative;
  height: 100dvh;
  padding: 0;
  overflow: hidden;
  #sidemenu {
    position: absolute;
    left: 0;
    --color-background: transparent;
  }
}
#mapboxBasic {
  width: 100%;
  height: calc(100dvh - 5rem);
}

.map-store-view {
  &__panel {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 125px;
    background: url('@/assets/images/background/gray-2-bg.png') repeat;

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
        grid-template-row: 1fr 1fr;
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
    }

    &--cat {
      width: 157px;
      height: 200px;
      position: absolute;
      bottom: -5px;
      left: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &--button {
      width: 143px;
      height: 40px;
      position: relative;
      z-index: 5;
      transform: translateY(-50%);

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    &--store-button {
      display: flex;
      align-self: end;
      padding-right: 12px;
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
