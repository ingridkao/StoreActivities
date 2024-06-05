<script setup lang="ts">
import listMarkerImg from '@/assets/images/list-marker.svg'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="lobby__section--title">
    <img :src="listMarkerImg" alt="list marker" />
    <h6>{{ props.title }}</h6>
  </div>
</template>

<style lang="scss" scoped>
.lobby__section--title {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-top: 0;
  padding-bottom: 20px;
  img {
    width: 20px;
  }
  h6 {
    font-weight: 700;
    font-size: 18px;
    color: #2d2a2a;
  }
}
</style>
