<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

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

watch(
  () => layoutStore.showDirection,
  (bodyScrollForbid) => {
    document.body.style.overflowY = bodyScrollForbid? 'hidden': 'scroll'
  }
)
</script>

<template>
  <main>
    <div v-show="layoutStore.load || layoutStore.pageLoad" class="loading">Loading...</div>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
  .loading {
    width: 100%;
    height: calc(100 * var(--vh));
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    background-color: #efefea;
    font-size: 36px;
  }
</style>
