<script setup lang="ts">
/**
 * ComingSoon
 */
import { useLink } from '@/composable/useLink'
const { linkToLobby } = useLink()
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>Coming soon</h1>
    </section>

    <section class="linkBox">
      <button @click="linkToLobby">活動大廳</button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
