<script setup lang="ts">
import { RouterLink } from 'vue-router'
import CameraIcon from '@/components/icon/IconCamera.vue'
</script>

<template>
  <RouterLink to="/scan" class="linkBtn">
    <CameraIcon />
  </RouterLink>
</template>

<style lang="scss" scoped>
.linkBtn {
  position: fixed;
  bottom: 1.5rem;
  left: calc(50% - 1rem);

  z-index: 90;

  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
