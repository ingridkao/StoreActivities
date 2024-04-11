<script setup lang="ts">
/**
 * 大廳: 活動廣告列表
 */
import { ref, onMounted, watchEffect, getCurrentInstance } from 'vue'
// const instance = getCurrentInstance()
// console.log(instance?.appContext.config.globalProperties.$swal);
import ActivitiesListItem from '@/components/activity/ActivitiesListItem.vue'

import type { ActivityListType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'
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

let skip = false
watchEffect(
  async () => {
    if (skip) return
    try {
      skip = await verifyQRCode()
    } catch (error) {   
      skip = true   
      proxy.$swal.fire({
        icon: "error",
        title: '驗證錯誤',
        text: error,
      })
    }
  }
)

</script>

<template>
  <main>
    <section v-for="activities in activitiesList" :key="activities.id">
      <ActivitiesListItem v-if="activities.id" :activities="activities" />
    </section>

    <section>
      <ActivitiesListItem 
        :activities="{
        title: '打卡紀錄',
        statu: 1,
        img: 'https://i.imgur.com/d8ptVfB.png',
        link: '/collected'
      }" />
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
