<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import { useRouter } from 'vue-router'
import type { ActivityListType } from '@/composable/configurable'
const props = defineProps<{
  activities: ActivityListType
}>()
const router = useRouter()
const linkTo = async () => {
  const { id, statu, link } = props.activities
  if (id && link) {
    if (statu != 1) return
    const activitiesID = String(id)
    router.push({
      path: `${link}`,
      query: {
        ac: activitiesID
      }
    })
  } else if (link) {
    router.push({
      path: `${link}`
    })
  }
}
</script>

<template>
  <div class="activities" :class="{ invalid: props.activities.statu != 1 }" @click="linkTo">
    <img :src="props.activities.img" :alt="props.activities.title || ''" />
  </div>
</template>

<style lang="scss" scoped>
.activities {
  aspect-ratio: 169/50;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  &.invalid {
    opacity: 0.3;
  }
}
</style>
