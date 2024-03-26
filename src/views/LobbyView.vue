<script setup lang="ts">
/**
 * 活動大廳
 * 1. 確認使用者同意裝置位置資料
 * 請求所有活動列表
 */
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ActivitiesItem from '@/components/ActivitiesItem.vue'
import { useGeolocation } from '@vueuse/core'
import { useURL } from '@/composable/useURL'
import { useFetchData } from '@/composable/useFetch'
const { coords, error } = useGeolocation()
const { ct } = useURL()
const { verifyQRCode } = useFetchData()
const latitude = computed(() => Number.isFinite(coords.value.latitude) ? coords.value.latitude : null)
const longitude = computed(() => Number.isFinite(coords.value.longitude) ? coords.value.longitude : null)

const activitiesList = ref([
  {
    id: 1,
    title: '使徒來襲',
    msg: '給地圖滿滿的初號機',
    link: '/mapEva',
  },
  {
    id: 2,
    title: '門市打卡活動',
    msg: '全台7-11門市',
    link: '/mapStore ',
  },
  {
    id: 3,
    title: '測試1',
    msg: '測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試',
    link: '/',
  },
  {
    id: 4,
    title: '測試2',
    msg: '測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試',
    link: '/ ',
  }
])

const router = useRouter()
onMounted(async () => {
  const verifyRes = await verifyQRCode()
  console.log(verifyRes);
  if (ct.value) {
    // const verifyRes = await verifyQRCode(ct.value)
    // console.log(verifyRes);
    // 檢核成功 >>> get events
    // 檢核失敗 >>>
    router.push({ path: '/error' })
  } else {

  }
})

</script>

<template>
  <main>
    <h1>大廳</h1>
    <section class="model" v-if="error">
      <p>{{ error ? error.message : error }}</p>
      <p>此活動需要裝置位置，請確認是否提供位置資訊存取權</p>
    </section>
    {{ latitude }}
    {{ longitude }}
    <section v-for="{ id, title, msg, link } in activitiesList" :key="id">
      <ActivitiesItem :title="title" :msg="msg" :link="link" :img="'https://picsum.photos/seed/picsum/400/300'" />
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
