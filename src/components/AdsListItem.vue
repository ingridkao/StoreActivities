<script setup lang="ts">
/**
 * 廣告
 */
import type { AdListType } from '@/composable/configurable'
const props = defineProps<{
  ads: AdListType
}>()

</script>

<template>
  <a v-if="props.ads.link" :href="props.ads.link" class="ads" :class="{ invalid: props.ads.isEnable }">
    <!-- <img :src="props.ads.imageFilePath || 'https://i.imgur.com/d8ptVfB.png'" :alt="props.ads.title || props.ads.link || ''" /> -->
    廣告{{props.ads.link}}
  </a>
</template>

<style lang="scss" scoped>
.ads {
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
