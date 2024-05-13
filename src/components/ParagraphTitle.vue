<script setup lang="ts">
import listMarkerImg from '@/assets/images/list-marker.svg'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="paragraph-title">
    <img :src="listMarkerImg" alt="list marker" />
    <p>{{ props.title }}</p>
  </div>
</template>

<style lang="scss" scoped>
.paragraph-title {
  display: flex;
  gap: 5px;
  color: #2d2a2a;
  font-weight: 700;
  font-size: 18px;

  img {
    width: 20px;
  }
}
</style>
