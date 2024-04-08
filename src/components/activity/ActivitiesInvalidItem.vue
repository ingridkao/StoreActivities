<script setup lang="ts">
/**
 * 預告中活動 || 已結束活動
 */
import type { ActivityListType } from '@/composable/configurable'
const props = defineProps<{
  activities: ActivityListType
}>()
const img = 'https://picsum.photos/seed/picsum/400/300'


</script>

<template>
  <div class="activities invalid">
    <div class="activities_img">
      <img :src="img" :alt="props.activities.title || ''">
    </div>
    <h2>{{ props.activities.title || '' }}</h2>
    <h3>
      {{ props.activities.msg || '' }}
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.activities.invalid {
  opacity: 0.3;
}
</style>
