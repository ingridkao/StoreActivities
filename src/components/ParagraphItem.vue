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
  @extend %flexColInfo;
  align-items: flex-start;
  gap: 0.875rem;
  
  width: 100%;
  margin-bottom: 1.25rem;
  &__content {
    color: $black;
    padding-left: 1.5rem;
    white-space: pre-line;
  }
}
</style>
