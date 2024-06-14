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
    padding: 22px 26px 0 26px;
    &-logo {
      width: 73px;
      height: 31px;
      margin-bottom: 8px;
    }
    &-cat {
      @extend %flexRowInfo;
      justify-content: end;
      gap: 8px;

      padding-bottom: 8px;
      &-img {
        width: 135px;
      }
      &-dialog {
        @extend %flexColInfo;
        width: 163px;
        height: 70px;
        color: $gray1;
        padding-left: 24px;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
