<script setup lang="ts">
/**
 * 門市地圖
 */
import { onMounted, onUnmounted } from 'vue'

import MapNavigationIcon from '@/components/icon/IconMapNavigation.vue'
import HeaderMenu from '@/components/HeaderMenu.vue'
import { useMapbox } from '@/composable/useMapbox'
import { useLink } from '@/composable/useLink'
const { storeFilterOptions, storeFilterSelectd, targetBoxData, toggleStoreInfo, updateChecked, mapNavigation } = useMapbox()
const { linkToDirection } = useLink()

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

const goToDirection = () => {
  // 提示離開此頁面
  linkToDirection()
}
</script>

<template>
  <main id="mapMain">
    <HeaderMenu :knowActivity="true"/>

    <div id="mapboxBasic"></div>

    <div class="drawerBox" :class="{ active: !targetBoxData.toggle }">
      <div class="scanBox">
        <button class="scanBox_btn" @click="goToDirection">我要打卡</button>
      </div>
      <div class="filterBox">
        <button
          v-for="item in storeFilterOptions"
          :key="item.value"
          @click="updateChecked(item.value)"
          class="filterBox_btn"
          :class="{ active: storeFilterSelectd === item.value }"
        >
          {{ item.nameTw }}
        </button>
      </div>
    </div>

    <div class="drawerBox infoBox" :class="{ active: targetBoxData.toggle }">
      <div class="infoBox_img">
        <img src="~@/assets/images/7-11logo.jpg" :alt="targetBoxData.info['store_name']" />
      </div>
      <div v-if="targetBoxData.info['store_id']" class="infoBox_content">
        <p class="infoBox_content_p">門市：{{ targetBoxData.info['store_id'] }} {{ targetBoxData.info['store_name'] }}</p>
        <p class="infoBox_content_p">地址：{{ targetBoxData.info['address'] }}</p>
      </div>
      <KeepAlive>
        <button v-if="targetBoxData.toggle" class="infoBox_navigation" @click="mapNavigation">
          <MapNavigationIcon />
        </button>
      </KeepAlive>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapMain {
  position: relative;
  height: 100dvh;
  padding: 0;
  overflow: hidden;
  #sidemenu{
    position: absolute;
    left: 0;
    --color-background: transparent;
  }
}
#mapboxBasic {
  width: 100%;
  height: calc(100dvh - 5rem);
  .mapboxgl-map {
  }
}

.scanBox{
  .scanBox{
    // &_btn {}
  }
}

.filterBox {
  &_btn {
    opacity: 0.5;
    &.active {
      opacity: 1;
    }
  }
}
.drawerBox {
  position: absolute;
  background: #fff;
  color: #555;
  padding: 0.75rem;
  box-sizing: border-box;
  z-index: 500;
  width: 100%;
  height: 7rem;
  display: flex;
  flex-direction: row;

  will-change: bottom;
  transition-property: bottom;
  transition-duration: 600ms;
  left: 0;
  bottom: -7rem;
  &.active {
    bottom: 0;
  }

}
.infoBox{
  &_content {
    padding: 0.5rem 1rem;
  }
  &_navigation {
    top: -1.5rem;
    right: 0.5rem;
    position: absolute;
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
    z-index: 100;
    cursor: pointer;
    svg {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
  &_img {
    width: 5.5rem;
    height: 5.5rem;
    img {
      width: 100%;
      pointer-events: none;
    }
  }
}
</style>
