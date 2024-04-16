<script setup lang="ts">
/**
 * 活動已結束
 */
  import { useLink } from '@/composable/useLink'
  const { linkToLobby, linkToAlbum } = useLink()
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>活動已結束</h1>
    </section>

    <section class="linkBox">
      <button @click="linkToAlbum">過去活動打卡紀錄</button>
      <button @click="linkToLobby">活動大廳</button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>