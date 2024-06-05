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
  <section class="lobby__ad">
    <Swiper :slides-per-view="'auto'" :space-between="9" :centeredSlides="true">
      <SwiperSlide v-for="item in props.adsList" :key="item.id">
        <a
          v-if="item.link"
          :href="item.link"
          class="lobby__ad--link"
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
.swiper-slide {
  width: 90%;
  max-width: 396px;
}
.lobby__ad {
  padding-top: 66px;
  padding-bottom: 66px;
  &--link {
    cursor: pointer;
    display: block;
    border-radius: 15px;
    overflow: hidden;
    aspect-ratio: 1280/720;
    img {
      object-fit: cover;
    }
    &.invalid {
      opacity: 0.3;
    }
  }
}
</style>
