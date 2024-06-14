<script setup lang="ts">
/**
 * ComingSoon
 */
import { RouterLink } from 'vue-router'
import checkFailImageImg from '@/assets/images/cat/check-fail-cat.png'
</script>

<template>
  <main class="comingSoon">
    <div>
      <div class="comingSoon-top">
        <div class="catImg">
          <img :src="checkFailImageImg" alt="無奈喵~~" width="336" height="403" />
        </div>
        <div class="text">
          <h5>404 訪問的頁面不存在</h5>
          <div class="dialog">Coming soon</div>
        </div>
      </div>
      <RouterLink to="/" class="store-btn activity" title="回活動首頁"></RouterLink>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.comingSoon {
  @extend %pageMain;
  background: url('@/assets/images/bg/fail.png');
  overflow: hidden;
  height: 100vh;
  > div {
    @extend %flexColInfo;
    @extend %mainSection;
    max-width: $content-small;
    height: 100%;
  }

  &-top {
    @extend %flexRowInfo;
    align-items: flex-start;
    .catImg {
      padding-top: 2rem;
    }
    .text {
      text-align: right;
      > h5 {
        color: $white;
        margin-bottom: 0.25rem;
      }
      .dialog {
        @extend %flexColInfo;
        @extend %imgContainer;
        background-image: url('@/assets/images/lobby/top-dialog.svg');
        aspect-ratio: 163/70;
        width: 12rem;
        padding-right: 0.5rem;

        color: $gray1;
        font-weight: 700;
        font-size: 2rem;
      }
    }
  }
  .store-btn {
    margin: 2rem auto;
  }
}
</style>
