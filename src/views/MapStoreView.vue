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
  storeFilterOptions,
  storeFilterSelectd,
  targetBoxData,
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

const goToActivityDetailPage = () => {
  linkToPrepareScan(activityId)
}

onMounted(async () => {
  console.log('onMounted')
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
          <img src="/images/example-logo.svg" alt="7-11 logo" />
        </div>

        <div v-if="targetBoxData.info" class="mapPanel-info-content">
          <p>{{ content.mapStore.storeLabel }}：</p>
          <p>{{ targetBoxData.info['store_id'] }} {{ targetBoxData.info['store_name'] }}</p>
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
            @click="goToActivityDetailPage"
            :title="btnName"
          >
            {{ btnName }}
          </button>
        </div>

        <!-- TODO URL slug有activityId時顯示活動門市 -->
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
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapboxBasic {
  width: 100%;
  height: calc(100vh - 125px);
}

.panelBox {
  @extend %mainSection;
  @extend %flexRowInfo;
  justify-content: space-between;
  max-width: $card-middle;
  height: 100%;
  gap: 15px;
}

.mapPanel {
  @extend %flexColInfo;
  @extend %fixedSection;
  bottom: 0;
  top: auto;

  &-info {
    padding: 20px 25px;
    justify-content: flex-start;

    &-logo {
      width: 84px;
      height: 84px;
    }

    &-content {
      height: 100%;
      display: grid;
      grid-template-columns: 50px 1fr;
      grid-template-rows: 1.5em 3em;
      row-gap: 0.5em;
      p {
        color: $white;
      }
    }

    &-centerBtn {
      position: absolute;
      top: -16px;
      right: 16px;
      z-index: 5;
    }
  }

  &-action {
    gap: 13px;

    &-checkin {
      justify-content: initial;

      .catImg {
        position: absolute;
        width: 157px;
        height: 200px;
        left: 0;
        bottom: 0;
        img {
          object-fit: cover;
        }
      }
      .store-btn {
        margin-top: -25px;
        margin-left: 135px;
        z-index: 5;
      }
    }
  }

  &-filter {
    position: absolute;
    bottom: 30px;
    right: 12px;
    display: flex;
    gap: 9px;
    .custom-btn {
      @extend %flexColInfo;
      width: 70px;
      height: 50px;
      padding: 0 15px;

      box-shadow: 0px 4px 4px rgb($black, 0.3);
      background-color: $grayBlue;

      font-size: 14px;
      color: $gray;
      &.active {
        background-color: $yellow1;
        color: $black;
      }
    }
  }
}
</style>
