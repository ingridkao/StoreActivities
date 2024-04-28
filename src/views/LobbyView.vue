<script setup lang="ts">
/**
 * 活動大廳
 * step0.  確認使用者同意裝置位置資料
 * step1.  確認URL是否有ct參數 >> 驗證是否合法 >> 合法則存起來
 * step2-1.請求所有活動列表    >> 連結至指定活動
 * step2-2.請求所有廣告列表    >> 連結至指定廣告
 */
import { ref, onMounted, watchEffect, computed } from 'vue'

import type { ActivityListType } from '@/composable/configurable'
import { useGeolocation } from '@vueuse/core'
import { useGeo } from '@/composable/useGeo'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLoadingStore } from '@/stores/loading'
import ActivitiesListItem from '@/components/ActivitiesListItem.vue'

// step0
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
const { setLocationStorage } = useBrowserStorage()
const { errorAlert } = useSweetAlert()
const { fetchActivityData, verifyQRCode } = useFetchData()
const { getQueryParam } = useLink()

let getPosition = false
watchEffect(async () => {
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // setLocationStorage(latitude, longitude)
    try {
      // step1
      const pathQuery1 = getQueryParam(window.location.href, 'ct')
      const pathQuery2 = getQueryParam(window.location.href, 'lat')
      const pathQuery3 = getQueryParam(window.location.href, 'lon')
      setLocationStorage(Number(pathQuery2), Number(pathQuery3))
      await verifyQRCode(pathQuery1)
    } catch (error) {
      errorAlert(`verifyQRCode:${error}`)
    }
  } else if (error.value && error.value.code >= 1) {
    geoErrorHandler(error.value.code)
  }
})

const loadStore = useLoadingStore()
const activitiesList = ref<ActivityListType[]>([])
onMounted(async () => {
  try {
    //step2-1
    //step2-2
    loadStore.toggle(true)
    Promise.all([
      fetchActivityData()
      // fetchAdData(),
    ]).then((dataArray) => {
      activitiesList.value = dataArray[0] || []
      loadStore.toggle(false)
    })
  } catch (error) {
    errorAlert(`fetchActivityData:${error}`)
  }
})

const siteLoading = computed(() => loadStore.load)
</script>

<template>
  <main>
    <template v-for="activities in activitiesList" :key="activities.id">
      <ActivitiesListItem v-if="activities.id" :activities="activities" />
    </template>

    <ActivitiesListItem
      :activities="{
        title: '集郵冊-打卡紀錄',
        statu: 1,
        img: 'https://i.imgur.com/d8ptVfB.png',
        link: '/album'
      }"
    />

    <div v-if="siteLoading" class="loading">Loading...</div>
  </main>
</template>

<style lang="scss" scoped>
.loading {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
