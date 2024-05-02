<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

//TODO: RWD scale function
const handleResize = () => {
  var siteWidth = 390
  var scale = screen.width / siteWidth

  const meta = document?.querySelector('meta[name="viewport"]')

  meta?.setAttribute('content', `width=${siteWidth}, initial-scale=${scale}`)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <RouterView />
</template>
