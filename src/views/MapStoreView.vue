<script setup lang="ts">
// import { onMounted, onUnmounted, ref, reactive, watch, computed } from 'vue';

import { useMapbox } from '@/composable/useMapbox'
// import { useLoadingStore } from '@/stores/loading'
// const loadStore = useLoadingStore()
const { storeFilterOptions, storeSelectd, updateChecked } = useMapbox()
// const siteLoading = computed(() => loadStore.load)

const filterStoreType = (target: String = '') => {
  updateChecked(target)
  // await updateCityLayer()
}
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
          @click="filterStoreType(item.value)" 
          :class="{active: storeSelectd === item.value}"
        >
          {{ item.nameTw }}
        </button>      </div>
      <button>我要打卡</button>
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
  .mapboxgl-map {

  }
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
</style>
