<script setup lang="ts">
import listMarkerImg from '@/assets/images/list-marker.svg'
const props = defineProps<{
  title: string
  content: string
}>()
</script>

<template>
  <div class="paragraph">
    <div class="paragraph__title">
      <img :src="listMarkerImg" alt="list marker" />
      <p>{{ props.title }}</p>
    </div>
    <p class="paragraph__content">
      {{ props.content }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.paragraph {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;

  &__title {
    display: flex;
    gap: 5px;
    color: #2d2a2a;
    font-weight: 700;
    font-size: 18px;

    img {
      width: 20px;
    }
  }

  &__content {
    font-size: 14px;
    color: #000000;
    line-height: 18px;
    font-weight: 500;
    padding-left: 25px;
    white-space: pre-line;
  }
}
</style>
