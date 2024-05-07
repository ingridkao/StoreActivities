<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import { useRouter } from 'vue-router'
import type { CampaignListType } from '@/composable/configurable'
const props = defineProps<{
  campaign: CampaignListType
}>()
const imageFileUrl = import.meta.env.VITE_ASSETS_URL

const router = useRouter()
const linkTo = async () => {
  const { isEnable, pageRouter } = props.campaign
  if (!isEnable) return
  // toLinkUrl: LIFF URL
  // if (toLinkUrl){
  //   window.open(encodeURI(toLinkUrl), '_blank', 'noreferrer,noopener')
  // }
  if (pageRouter) {
    router.push({
      name: 'Activity',
      params: {
        id: pageRouter
      },
      query: {
        ac: pageRouter
      }
    })
  }
}
</script>

<template>
  <div 
    class="activities" 
    :class="{ invalid: !props.campaign.isEnable}" 
    @click="linkTo()"
  >
    <img 
      :src="`${imageFileUrl}${props.campaign.imageFilePath}`" 
      :alt="props.campaign.eventName || ''"
      width="169"
      height="50"
    />
  </div>
</template>

<style lang="scss" scoped>
.activities {
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 169/50;
    object-fit: contain;
  }

  &.invalid {
    opacity: 0.3;
  }
}
</style>
