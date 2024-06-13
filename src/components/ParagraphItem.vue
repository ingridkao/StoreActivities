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
    <b class="paragraph__content">
      {{ props.content }}
    </b>
  </div>
</template>

<style lang="scss" scoped>
.paragraph {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
  &__content {
    color: $black;
    padding-left: 25px;
    white-space: pre-line;
  }
}
</style>
