<script setup lang="ts">
/**
 * 門市地圖
 */
 import MapNavigationIcon from '@/components/icon/IconMapNavigation.vue'

import { useMapbox } from '@/composable/useMapbox'
const { storeFilterOptions, storeFilterSelectd, targetBoxData, updateChecked, mapNavigation } = useMapbox()

</script>

<template>
  <main id="mapMain">
    <!-- <a href="https://qwaretest-9b8d6.web.app/map8">先看這個</a> -->
    <div id="mapboxBasic"></div>

    <div class="mapFilter">
      <div class="mapFilter_btn">
        <button 
          v-for="item in storeFilterOptions" 
          :key="item.value"
          @click="updateChecked(item.value)" 
          :class="{active: storeFilterSelectd === item.value}"
        >
          {{ item.nameTw }}
        </button>      </div>
      <button>我要打卡</button>
    </div>

    <div class="drawerBox" :class="{ active: targetBoxData.toggle }">
      <div class="imgBox">
        <img src="~@/assets/images/7-11logo.jpg" :alt="targetBoxData.info['store_name']"/>
      </div>
      <div v-if="targetBoxData.info['store_id']" class="contenBox">
        <p>門市：{{ targetBoxData.info['store_id'] }} {{ targetBoxData.info['store_name'] }}</p>
        <p>地址：{{ targetBoxData.info['address'] }}</p>
      </div>
      <button class="mapBtn" @click="mapNavigation">
        <MapNavigationIcon />
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#mapMain {
  position: relative;
  height: 100dvh;
  padding: 0;
  overflow: hidden;
}
#mapboxBasic{
  width: 100%;
  height: calc(100dvh - 5rem);
  .mapboxgl-map {}
}
.mapFilter{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  background: #ddd;
  &_btn {
    button{
      opacity:0.5;
      &.active{
        opacity:1;
      }
    }
  }
}
.drawerBox {
  position: absolute;
	background: #fff;
	color: #555;
	padding: .75rem;
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
	.imgBox {
		width: 5.5rem;
		height: 5.5rem;
		img{
			width: 100%;
		}
	}
	.contenBox {
		padding: 0.5rem 1rem;
	}
	.mapBtn {
		display: none;
		top: -1.5rem;
		right: .5rem;
	}
	&.active {
		.mapBtn {
			display: block;
		}
	}
}
</style>
