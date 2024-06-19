<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// RWD scale function
const handleResize = () => {
  const siteWidth = 390
  // 傳回兩個數字中較小的一個。
  const windowWidth = Math.min(window.screen.width, 572)
  const scale = windowWidth / siteWidth
  // console.log('handleResize:' + windowWidth)
  if (windowWidth > 390) {
    document.documentElement.style.height = '100%'
  } else {
    document.documentElement.style.height = `${window.screen.height * scale}px`
  }
  document.body.style.setProperty('--vh', `calc(1vh / ${scale})`)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => [layoutStore.showDirection, layoutStore.showScanResult],
  ([showDirection, showScanResult]) => {
    console.log(showDirection || showScanResult ? 1 : 0)
    const bodyScrollForbid = showDirection || showScanResult
    document.body.style.overflowY = bodyScrollForbid ? 'hidden' : 'scroll'
  }
)
</script>

<template>
  <main>
    <h1 v-show="layoutStore.load || layoutStore.pageLoad" class="loading">Loading...</h1>
    <RouterView />
  </main>
</template>
