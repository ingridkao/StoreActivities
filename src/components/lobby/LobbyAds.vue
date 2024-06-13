<script setup lang="ts">
import type { AdsInterface } from '@/types/ResponseHandle'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
const { VITE_ASSETS_URL } = import.meta.env
const props = defineProps<{
  adsList: AdsInterface[]
}>()
</script>

<template>
  <section class="ads">
    <Swiper :slides-per-view="'auto'" :space-between="9" :centeredSlides="true">
      <SwiperSlide v-for="item in props.adsList" :key="item.id">
        <a
          v-if="item.link"
          :href="item.link"
          class="ads--link"
          :class="{ invalid: !item.isEnable }"
        >
          <img
            v-if="item.imageFilePath"
            :alt="item.title || item.link || ''"
            :src="`${VITE_ASSETS_URL}${item.imageFilePath}`"
          />
          <img
            v-else
            :alt="item.title || item.link || ''"
            src="https://i.imgur.com/QAgmBa5_d.jpg?maxwidth=520&shape=thumb&fidelity=high"
          />
        </a>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style lang="scss" scoped>
.ads {
  padding-top: 66px;
  padding-bottom: 66px;
  &--link {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 169/50;
    img {
      object-fit: cover;
    }
    &.invalid {
      opacity: 0.3;
    }
  }
}
.swiper-slide {
  width: 90%;
  max-width: $card-middle;
}
</style>
