<script setup lang="ts">
/**
 * 廣告
 */
import type { AdsInterface } from '@/types/ResponseHandle'
const { VITE_ASSETS_URL, VITE_UI_MODE } = import.meta.env
const props = defineProps<{
  ads: AdsInterface
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
    />
  </a>
</template>

<style lang="scss" scoped>
.ads {
  cursor: pointer;
  display: block;
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 1280/720;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.invalid {
    opacity: 0.3;
  }
}
</style>
