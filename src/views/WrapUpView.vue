<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>活動已結束</h1>
    </section>

    <section class="linkBox">
      <RouterLink to="/album">過去打卡紀錄</RouterLink>
      <RouterLink to="/">活動大廳</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>