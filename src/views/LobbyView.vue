<script setup lang="ts">
/**
 * 活動大廳
 * 1.  確認使用者同意裝置位置資料
 * 2-1.確認URL是否有ct參數 >> 驗證是否合法
 * 2-2.請求所有活動列表    >> 連結至指定活動
 */
import { ref, onMounted, watchEffect, getCurrentInstance } from 'vue'
// const instance = getCurrentInstance()
// console.log(instance?.appContext.config.globalProperties.$swal);

import { useGeolocation } from '@vueuse/core'
import type { ActivityListType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'

import ActivitiesListItem from '@/components/activity/ActivitiesListItem.vue'

const { proxy } = getCurrentInstance()
const activitiesList = ref<ActivityListType[]>([])
const { fetchActivityData, verifyQRCode } = useFetchData()

onMounted(async () => {
  try {
    const res = await fetchActivityData()
    activitiesList.value = res || []
  } catch (error) {
    proxy.$swal.fire({
      icon: "error",
      title: '出了一點問題',
      text: error,
    })
  }
})

const { coords, error, resume } = useGeolocation()
const geoErrorCode = ref<number>(0)
let getPosition = false
watchEffect(
  async () => {
    const { latitude, longitude } = coords.value
    if (getPosition) return
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      getPosition = true
      try {
        await verifyQRCode(latitude, longitude)
      } catch (error) {
        proxy.$swal.fire({
          icon: "error",
          title: '驗證錯誤',
          text: error,
        })
      }

    } else if (error.value && error.value.code >= 1) {
      geoErrorCode.value = error.value.code
      const GeolocationPositionError = ['沒有獲取地理位置信息的權限', '資訊回傳了錯誤', '取得地理資訊超過時限']
      const GeolocationErrorString = GeolocationPositionError[error.value.code - 1]
      proxy.$swal.fire({
        icon: "info",
        title: '打卡活動需要裝置位置資訊，請確認是否提供位置存取權',
        text: GeolocationErrorString || '',
        showCancelButton: true,
        confirmButtonText: "開啟存取權",
        cancelButtonText: "拒絕",
      }).then((result: { isConfirmed: boolean, isDenied: boolean, isDismissed: boolean, value: boolean }) => {
        if (result.isConfirmed) {
          resume()
        }
      });
    }
  }
)

</script>

<template>
  <main>
    <!-- 活動列表(大廳頁面) -->
    <section v-for="activities in activitiesList" :key="activities.id">
      <ActivitiesListItem v-if="activities.id" :activities="activities" />
    </section>

    <section>
      <ActivitiesListItem :activities="{
      title: '集郵冊-打卡紀錄',
      statu: 1,
      img: 'https://i.imgur.com/d8ptVfB.png',
      link: '/album'
    }" />
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
