<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import { useRouter } from 'vue-router'
import type { CampaignListType } from '@/composable/configurable'
const { VITE_ASSETS_URL, VITE_UI_MODE } = import.meta.env
const props = defineProps<{
  campaign: CampaignListType
}>()
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
  <div class="activities" :class="{ invalid: !props.campaign.isEnable }" @click="linkTo()">
    <img
      :src="VITE_UI_MODE? 'https://i.imgur.com/QAgmBa5_d.webp?maxwidth=760&fidelity=grand': `${VITE_ASSETS_URL}${props.campaign.imageFilePath}`"
      :alt="'' || props.campaign.eventName"
      width="169"
      height="50"
    />
  </div>
</template>

<style lang="scss" scoped>
.activities {
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;

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
