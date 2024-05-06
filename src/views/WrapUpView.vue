<script setup lang="ts">
/**
 * 活動已結束
 */
import { RouterLink, onBeforeRouteLeave  } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const { deleteSessionStorage } = useBrowserStorage()
onBeforeRouteLeave((to) => {
  if (to.name === 'Lobby' || to.name === 'Album') {
		deleteSessionStorage('ac')
  }
})
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>活動已結束</h1>
    </section>

    <section class="linkBox">
      <RouterLink to="/album">過去活動打卡紀錄</RouterLink>
      <RouterLink to="/">活動大廳</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
