<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { useLink } from '@/composable/useLink'
import { useMapbox } from '@/composable/useMapbox'

import HeaderMenu from '@/components/HeaderMenu.vue'
import content from '@/assets/content'
import mapCatImg from '@/assets/images/cat/map-cat.png'

const { linkToPrepareScan } = useLink()
const {
  storeFilterSelectd,
  storeFilterOptions,
  targetBoxData,
  mapDisplayCountMsg,
  toggleStoreInfo,
  updateChecked,
  mapNavigation
} = useMapbox()

const route = useRoute()
const activityId = route?.params?.id
const btnName = activityId ? '進入活動' : '進行打卡'
const btnClassName = activityId ? 'enter' : 'checkin'

// 點選門市後出現資訊drawerBox >> 點選drawerBox以外則toggleStoreInfo()
const handleOutsideClick = (event: Event) => {
  const inputTarget = event.target as HTMLInputElement
  toggleStoreInfo(String(inputTarget.classList.value))
}

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <main>
    <HeaderMenu />

    <div id="mapboxBasic"></div>

    <div class="mapPanel">
      <div v-if="targetBoxData.toggle" class="panelBox mapPanel-info">
        <div class="mapPanel-info-logo">
          <img
            v-if="targetBoxData.imgURL"
            :src="targetBoxData.imgURL"
            :alt="targetBoxData.info['storename']"
          />
          <img v-else src="/images/example-logo.svg" alt="7-11 logo" />
        </div>

        <div v-if="targetBoxData.info" class="mapPanel-info-content">
          <p>{{ content.mapStore.storeLabel }}：</p>
          <p>{{ targetBoxData.info['storeid'] }} {{ targetBoxData.info['storename'] }}</p>
          <!-- <p>{{ targetBoxData.info.storetype }}</p> -->
          <p>{{ content.mapStore.addressLabel }}：</p>
          <p>{{ targetBoxData.info['address'] }}</p>
        </div>

        <button
          class="round-btn mapCenter mapPanel-info-centerBtn"
          @click="mapNavigation"
          title="開啟google"
        ></button>
      </div>

      <div v-else class="panelBox mapPanel-action">
        <div class="panelBox mapPanel-action-checkin">
          <div class="catImg">
            <img :src="mapCatImg" width="157" height="200" />
          </div>
          <button
            class="store-btn"
            :class="btnClassName"
            @click="linkToPrepareScan(activityId)"
            :title="btnName"
          >
            {{ btnName }}
          </button>
        </div>

        <div class="mapPanel-filter">
          <button
            v-for="item in storeFilterOptions"
            :key="item.value"
            class="custom-btn"
            :class="{ active: storeFilterSelectd === item.value }"
            @click="updateChecked(item.value)"
            :title="item.nameTw"
          >
            {{ item.nameTw }}
          </button>
        </div>

        <div class="mapPanel-count">
          {{ mapDisplayCountMsg }}
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapboxBasic {
  width: 100%;
  height: calc(100vh - 7.5rem);
}

.panelBox {
  @extend %flexRowInfo;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  width: 100%;
  max-width: $card-middle;
  height: 7.5rem;
}

.mapPanel {
  @extend %flexColInfo;
  @extend %fixedSection;
  bottom: 0;
  top: auto;

  &-info {
    padding: 1.25rem 1.5rem;
    justify-content: flex-start;

    &-logo {
      width: 5.25rem;
      height: 5.25rem;
    }

    &-content {
      height: 100%;
      display: grid;
      grid-template-columns: 3.125rem 1fr;
      grid-template-rows: 1.5em 3em;
      row-gap: 0.5em;
      p {
        color: $white;
      }
    }

    &-centerBtn {
      position: absolute;
      top: -1rem;
      right: 1rem;
      z-index: 5;
    }
  }

  &-action {
    gap: 0.75rem;

    &-checkin {
      justify-content: initial;
      .catImg {
        position: absolute;
        width: 10rem;
        height: 12.5rem;
        left: 0;
        bottom: 0;
        border: 1px solid transparent; // 加了手機上就不會往上移
        img {
          object-fit: cover;
        }
      }
      .store-btn {
        margin: -8.5rem 0 0 8.5rem;
        z-index: 5;
      }
    }
  }

  &-filter {
    position: absolute;
    bottom: 1.875rem;
    right: 0.75rem;
    display: flex;
    gap: 9px;
    .custom-btn {
      @extend %flexColInfo;
      justify-content: center;
      width: 4.375rem;
      height: 3.125rem;
      padding: 0 1rem;

      @extend %shadowBox2;
      background-color: $grayBlue;

      font-size: 0.875rem;
      color: $gray;
      &.active {
        background-color: $yellow1;
        color: $black;
      }
    }
  }

  &-count {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
