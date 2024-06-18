<script setup lang="ts">
import listMarkerImg from '@/assets/images/icon/list-marker.svg'
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="section__title">
    <img :src="listMarkerImg" alt="list marker" />
    <h6>{{ props.title }}</h6>
  </div>
</template>

<style lang="scss" scoped>
.section__title {
  @extend %flexRowInfo;
  justify-content: flex-start;
  gap: 0.25rem;
  width: 100%;
  img {
    width: 1.25rem;
  }
  h6 {
    color: $black1;
  }
}
</style>
