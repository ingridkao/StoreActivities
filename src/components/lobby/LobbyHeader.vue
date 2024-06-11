<script setup lang="ts">
import topLogoImg from '@/assets/images/lobby/top-logo.png'
import topCatImg from '@/assets/images/lobby/top-cat.png'
import data from '@/assets/data'
</script>

<template>
  <header class="lobby__head">
    <div class="lobby__head--wrapper store-img">
      <div class="lobby__head--logo">
        <img :src="topLogoImg" alt="top logo" />
      </div>
      <div class="lobby__head--cat">
        <div class="lobby__head--cat-img">
          <img :src="topCatImg" alt="top cat" />
        </div>
        <div class="lobby__head--cat-dialog">{{ data.lobby.title }}</div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.lobby__head {
  background: url('@/assets/images/lobby/top-bg.png');
  &--wrapper {
    padding: 22px 26px 0 26px;
  }
  &--logo {
    width: 73px;
    height: 31px;
    margin-bottom: 8px;
  }
  &--cat {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 8px;
    padding-bottom: 8px;
    &-img {
      width: 135px;
      height: 125px;
    }
    &-dialog {
      width: 163px;
      height: 70px;
      background: url('@/assets/images/lobby/top-dialog.svg');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #5f5d5d;
      font-size: 24px;
      line-height: 100%;
      font-weight: 700;
      padding-left: 24px;
      transform: translateY(-12px);
    }
  }
}
</style>
