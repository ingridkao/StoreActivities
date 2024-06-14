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
  gap: 5px;
  width: 100%;
  padding-top: 0;
  padding-bottom: 20px;
  img {
    width: 20px;
  }
  h6 {
    color: $black1;
  }
}
</style>
