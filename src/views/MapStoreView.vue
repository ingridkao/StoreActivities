<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, computed } from 'vue';
import CameraBtn from '@/components/button/CameraBtn.vue';
import HeaderMenu from '@/components/HeaderMenu.vue'

import { useMap } from '@/composable/useMap'
import { useMapbox } from '@/composable/useMapbox'
import { useFetchData } from '@/composable/useFetch'
import { useLoadingStore } from '@/stores/loading'
const { clientLocationCity } = useMap()
const { map } = useMapbox()
const { fetchLayerData } = useFetchData()
const loadStore = useLoadingStore()
const siteLoading = computed(() => loadStore.load)

const updateResult = (results) => {
  console.log(results);

  results.forEach((layerData, layerIndex) => {
    //   const filterValue = storeFilterOptions[layerIndex]['value']
    //   const layerKey = `${targerCity}_${filterValue}`
    //   // console.log(layerData);
    //   const storeData: GeoJsonFeatureCollection | null = layerData['data']
    //     if (storeData) {
    //         const storeCount: number = storeData.features.length
    //         const layerDatas = {
    //             city:targerCity,
    //             type: filterValue,
    //             storeData: storeData,
    //             disabled: storeCount === 0
    //         }
    //         cityStoreData[layerKey] = layerDatas
    //         addDataToMap(layerDatas)
    //     }
  })
  loadStore.toggle(false)
}
watch(
  () => map.value,
  (mapbox) => {
    if (mapbox) {
      mapbox.on('load', async () => {
        console.log('load2')
        const results = await fetchLayerData(clientLocationCity.value)
        updateResult(results)
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
  <main>
    ==={{ siteLoading }} ===
    <HeaderMenu />
    <div id="mapboxBasic"></div>
    <CameraBtn />
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
