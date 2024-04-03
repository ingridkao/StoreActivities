<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'

const props = defineProps<{
  activities: { id?: number; title?: string; msg?: string; link?: string }
}>()
const img = 'https://picsum.photos/seed/picsum/400/300'

const router = useRouter()
const { setAcStorage } = useBrowserStorage()

const linkTo = async () => {
  const routerPath = props.activities.link
  if (routerPath) {
    const activitiesID = String(props.activities.id) || ''
    setAcStorage(activitiesID)
    router.push({
      path: `${routerPath}`,
      query: {
        ac: activitiesID
      }
    })
  } else {
    // 沒有link
    router.push({ path: '/error' })
  }
}
</script>

<template>
  <div class="activities" @click="linkTo">
    <div class="activities_img">
      <img :src="img" :alt="props.activities.title || ''">
    </div>
    <h2>{{ props.activities.title || '' }}</h2>
    <h3>
      {{ props.activities.msg || '' }}
    </h3>
  </div>
</template>

<style lang="scss" scoped></style>
