<script setup lang="ts">
/**
 * ComingSoon
 */
import { RouterLink, onBeforeRouteLeave  } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const { deleteSessionStorage } = useBrowserStorage()

onBeforeRouteLeave((to) => {
  if (to.name === 'Lobby') {
		deleteSessionStorage('ac')
  }
})
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>Coming soon</h1>
    </section>
    <section class="linkBox">
      <RouterLink to="/">活動大廳</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
