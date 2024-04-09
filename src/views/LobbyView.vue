<script setup lang="ts">
/**
 * 活動大廳
 * 1.  確認使用者同意裝置位置資料
 * 2-1.確認URL是否有ct參數 >> 驗證是否合法
 * 2-2.請求所有活動列表    >> 連結至指定活動
 */
import { ref, onMounted, watchEffect } from 'vue'
import { useGeolocation } from '@vueuse/core'
import type { ActivityListType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'

import ActivitiesListItem from '@/components/activity/ActivitiesListItem.vue'

const activitiesList = ref<ActivityListType[]>([])
const { fetchActivityData, verifyQRCode } = useFetchData()
onMounted(async () => {
  try {
    const res = await fetchActivityData()
    activitiesList.value = res || []
    await verifyQRCode()
  } catch (error) {
    // 檢核失敗顯示提示錯誤dialog
    console.error(error);
  }
})

const { coords, error, resume } = useGeolocation()
const getPosition = ref<boolean>(false)
const lat = ref<null | number>(null)
const lon = ref<null | number>(null)
const geoErrorCode = ref<number>(0)
const geoError = ref<string>('')
watchEffect(
  async () => {
    const { latitude, longitude } = coords.value
    if (!getPosition.value && Number.isFinite(latitude) && Number.isFinite(longitude)) {
      getPosition.value = true
      lat.value = latitude
      lon.value = latitude
    } else if (error.value && error.value.code >= 1) {
      geoErrorCode.value = error.value.code
      const GeolocationPositionError = ['沒有獲取地理位置信息的權限', '資訊回傳了錯誤', '取得地理資訊超過時限']
      const GeolocationErrorString = GeolocationPositionError[error.value.code - 1]
      geoError.value = GeolocationErrorString || ''
    }
  }
)

</script>

<template>
  <main>
    <!-- <section class="model" v-if="geoError">
      <p>{{ geoError }}</p>
      <p>打卡活動需要裝置位置資訊，請確認是否提供位置存取權</p>
      <button v-if="geoErrorCode > 1" @click="resume">開啟存取權</button>
    </section>
    <section v-else>
      {{ lat }} | {{ lon }}
    </section>
    -->

    <!-- 活動列表(大廳頁面) -->
    <section v-for="activities in activitiesList" :key="activities.id">
      <ActivitiesListItem v-if="activities.id" :activities="activities" />
    </section>

    <section>
      <ActivitiesListItem :activities="{
      title: '打卡紀錄',
      statu: 1,
      img: 'https://i.imgur.com/d8ptVfB.png',
      link: '/collected'
    }" />
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
