<script setup lang="ts">
/**
 * ComingSoon
 */
import { RouterLink } from 'vue-router'

</script>

<template>
  <main class="comingSoon">
    <h1>Coming soon</h1>
    <RouterLink 
      to="/"
      class="store-btn activity" 
      title="回活動首頁"
    ></RouterLink>
  </main>
</template>

<style lang="scss" scoped>
.comingSoon {
  @extend %pageMain;
  @extend %flexColInfo;
  width: 100%;
  .store-btn{
    display: block;
    margin: 16px auto;
  }
}
</style>
