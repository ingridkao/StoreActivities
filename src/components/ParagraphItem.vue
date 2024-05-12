<script setup lang="ts">
import ParagraphTitle from './ParagraphTitle.vue'

const props = defineProps<{
  title: string
  content: string
}>()
</script>

<template>
  <div class="paragraph">
    <ParagraphTitle :title="props.title" />
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
