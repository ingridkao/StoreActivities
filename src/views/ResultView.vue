<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <section class="cardSection">
      <h1>QR Code檢核錯誤</h1>
    </section>

    <section class="linkBox">
      <RouterLink to="/scan">重新打卡</RouterLink>
      <RouterLink to="/">前往活動大廳</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
