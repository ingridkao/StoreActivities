<script setup lang="ts">
/**
 * 活動大廳
 * 1. 確認使用者同意裝置位置資料
 * 2. 確認URL是否有ct參數
 * 3. 請求所有活動列表
 * 4. 連結至指定活動
 */
import { ref, onMounted, computed } from 'vue'
import ActivitiesItem from '@/components/ActivitiesItem.vue'
import { useGeolocation } from '@vueuse/core'
import { useFetchData } from '@/composable/useFetch'

const { coords, error } = useGeolocation()
const latitude = computed(() => Number.isFinite(coords.value.latitude) ? coords.value.latitude : null)
const longitude = computed(() => Number.isFinite(coords.value.longitude) ? coords.value.longitude : null)
console.log(error.value);

type CollectedListType = {
  id?: number;
  title?: string;
  msg?: string;
  link?: string;
}
const activitiesList = ref<CollectedListType[]>([])

const { fetchActivityData } = useFetchData()
onMounted(async () => {
  fetchActivityData().then((res: any) => {
    activitiesList.value = res || []
  })
})

</script>

<template>
  <main>
    <h1>大廳</h1>
    <section class="model" v-if="error">
      <p>{{ error ? error.message : error }}</p>
      <p>此活動需要裝置位置，請確認是否提供位置資訊存取權</p>
    </section>
    {{ latitude }} | {{ longitude }}
    <section v-for="activities in activitiesList" :key="activities.id">
      <ActivitiesItem v-if="activities.id" :activities="activities" />
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
