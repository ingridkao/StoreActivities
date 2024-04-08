<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, computed } from 'vue';
import CameraBtn from '@/components/button/CameraBtn.vue';
import HeaderMenu from '@/components/HeaderMenu.vue'
import FilterBox from '@/components/maps/FilterBox.vue'

import { useMap } from '@/composable/useMap'
import { useMapbox } from '@/composable/useMapbox'
import { useFetchData } from '@/composable/useFetch'
import { useLoadingStore } from '@/stores/loading'
import { useConvenienceStore } from '@/stores/convenience'
const convenienceStore = useConvenienceStore()

const { clientLocationCity } = useMap()
const { map, addDataToMap } = useMapbox()
const { fetchLayerData } = useFetchData()
const loadStore = useLoadingStore()
const siteLoading = computed(() => loadStore.load)

// 地圖右下角按鈕
const filterBoxToogle = ref<Boolean>(false)

const updateStoreResult = (results) => {
  results.forEach((layerData, layerIndex) => {
    const filterValue = convenienceStore.storeFilterOptions[layerIndex]['value']
    // const layerKey = `${clientLocationCity.value}_${filterValue}`
    const storeData = layerData['data']
    if (storeData && storeData.features) {
      const storeCount: number = storeData.features.length
      const layerDatas = {
        city: clientLocationCity.value,
        type: filterValue,
        storeData: storeData,
        disabled: storeCount === 0
      }
      // cityStoreData[layerKey] = layerDatas
      addDataToMap(layerDatas)
    }
  })
  loadStore.toggle(false)
}
watch(
  () => map.value,
  (mapbox) => {
    if (mapbox) {
      mapbox.on('load', async () => {
        console.log('load2')
        const storeResults = await fetchLayerData(clientLocationCity.value)
        updateStoreResult(storeResults)
      })
    }
  }, {
  deep: true,
  once: true
}
)

watch(
  () => clientLocationCity.value,
  (city) => {
    if (city) {
      console.log(city);
    };
  }, {
  once: true
}
)
</script>

<template>
  <main id="mapMain">
    <HeaderMenu />
    <!-- <a href="https://qwaretest-9b8d6.web.app/map8">先看這個</a> -->
    <div id="mapboxBasic"></div>
    <!-- <CameraBtn /> -->
    <FilterBox :toggle="filterBoxToogle" />
  </main>
</template>

<style scoped>
.mapboxgl-map {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>
