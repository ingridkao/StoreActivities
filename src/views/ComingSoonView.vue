<script setup lang="ts">
import { RouterLink } from 'vue-router'
import content from '@/assets/content'
import partyCatImg from '@/assets/images/cat/party-cats.png'
</script>

<template>
  <main class="comingSoon">
    <div>
      <img :src="partyCatImg" alt="喵喵開派對" width="336" height="403" />
      <div class="box">
        <h5>404</h5>
        <h5>訪問的頁面不存在</h5>
        <RouterLink to="/" class="store-btn activity" :title="content.btn.backHome"></RouterLink>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.comingSoon {
  @extend %pageMain;
  @extend %flexColInfo;
  background: url('@/assets/images/bg/fail.png');
  overflow: hidden;
  height: 100vh;

  > div {
    @extend %mainSection;
    max-width: $content-small;
    .box{
      position: absolute;
      bottom: 0.5rem;
      left: 20%;
      width: 60%;
      height: 10rem;
      @extend %roundBox;
      @extend %shadowBox1;
      background-color: $whitePure;

      @extend %flexColInfo;
      justify-content: center;

      .store-btn {
        width: 60%;
        margin: 1rem auto 0;
        background-size: contain;
      }
    }
  }

}
</style>
