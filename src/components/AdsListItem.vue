<script setup lang="ts">
/**
 * 廣告
 */
import type { AdListType } from '@/composable/configurable'
const { VITE_ASSETS_URL, VITE_UI_MODE } = import.meta.env
const props = defineProps<{
  ads: AdListType
}>()
</script>

<template>
  <a
    v-if="props.ads.link"
    :href="props.ads.link"
    class="ads"
    :class="{ invalid: !props.ads.isEnable }"
  >
    <img
      :src="
        VITE_UI_MODE
          ? 'https://i.imgur.com/QAgmBa5_d.jpg?maxwidth=520&shape=thumb&fidelity=high'
          : `${VITE_ASSETS_URL}${props.ads.imageFilePath}`
      "
      :alt="props.ads.title || props.ads.link || ''"
      width="169"
      height="50"
    />
  </a>
</template>

<style lang="scss" scoped>
.ads {
  cursor: pointer;
  border-radius: 20px 20px 30px 30px;
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
