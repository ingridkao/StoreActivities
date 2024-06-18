<script setup lang="ts">
import topLogoImg from '@/assets/images/lobby/top-logo.png'
import topCatImg from '@/assets/images/cat/ibon-cat.png'
import content from '@/assets/content'
</script>

<template>
  <header class="lobbyHead">
    <div class="lobbyHead_wrapper">
      <img class="lobbyHead_wrapper-logo" :src="topLogoImg" alt="top logo" width="73" height="31" />
      <div class="lobbyHead_wrapper-cat">
        <img
          class="lobbyHead_wrapper-cat-img"
          :src="topCatImg"
          alt="操作ibon的喵~"
          width="135"
          height="125"
        />
        <h1 class="lobbyHead_wrapper-cat-dialog">
          {{ content.lobby.title }}
        </h1>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.lobbyHead {
  &_wrapper {
    @extend %mainSection;
    max-width: $content-large;
    padding: 1.375rem 1.625rem 0.5rem 1.625rem;
    &-logo {
      width: 4.5rem;
      height: 2rem;
      margin-bottom: 0.5rem;
    }
    &-cat {
      @extend %flexRowInfo;
      justify-content: end;
      gap: 0.5rem;

      &-img {
        width: 8.5rem;
      }
      &-dialog {
        @extend %flexColInfo;
        justify-content: center;
        width: 10.25rem;
        height: 4.375rem;
        color: $gray1;
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }
    }
  }
}
</style>
