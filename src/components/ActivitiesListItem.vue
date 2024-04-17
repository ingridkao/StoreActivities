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
    <div class="activities_img">
      <img v-if="props.activities.img" :src="props.activities.img" :alt="props.activities.title || ''" />
      <div v-else>{{ props.activities.title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activities {
  position: relative;
  display: block;
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: 22rem;
  &.invalid {
    opacity: 0.3;
  }

  &:not(.invalid) {
    .activities_img {
      cursor: pointer;
    }
  }

  &_img {
    width: 100%;
    overflow: hidden;

    >img {
      width: 100%;
    }

    >div {
      height: 5rem;
      background-color: rgba(255,255,255,0.5);
      color: #000;
      border-radius: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
