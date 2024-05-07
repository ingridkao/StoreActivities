<script setup lang="ts">
/**
 * 廣告
 */
import type { AdListType } from '@/composable/configurable'
const imageFileUrl = import.meta.env.VITE_ASSETS_URL
const props = defineProps<{
  ads: AdListType
}>()

</script>

<template>
  <a v-if="props.ads.link" :href="props.ads.link" class="ads" :class="{ invalid: !props.ads.isEnable }">
    <img 
      :src="`${imageFileUrl}${props.ads.imageFilePath}`" 
      :alt="props.ads.title || props.ads.link || ''"
      width="169"
      height="50"
    />
  </a>
</template>

<style lang="scss" scoped>
.ads {
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
