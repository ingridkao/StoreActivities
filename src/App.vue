<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

//TODO: RWD scale function
const handleResize = () => {
  const siteWidth = 390
  const scale = window.screen.width / siteWidth

  if (window.screen.width > 390) {
    document.documentElement.style.height = '100%'
  } else {
    document.documentElement.style.height = `${window.screen.height * scale}px`
  }

  document.body.style.width = `${siteWidth}px`
  document.body.style.transform = `scale(${scale})`
  document.body.style.setProperty('--vh', `calc(1vh / ${scale})`)
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
