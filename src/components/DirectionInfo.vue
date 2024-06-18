<script setup lang="ts">
import content from '@/assets/content'
import DecoCatImg from '@/assets/images/cat/ibon-cat-big.png'
import step1IconImg from '@/assets/images/direction/step-1-icon.svg'
import step1PictureImg from '@/assets/images/direction/step-1-picture.png'
import step2IconImg from '@/assets/images/direction/step-2-icon.svg'
import step2PictureImg from '@/assets/images/direction/step-2-picture.png'
</script>

<template>
  <div class="direction topBg">
    <div>
      <img class="direction__deco" :src="DecoCatImg" alt="操作ibon的喵~" width="208" height="194" />

      <div class="direction__step1-desc">
        <img class="direction_stepIcon" :src="step1IconImg" alt="step 1" width="53" height="68" />
        <div>
          <p class="direction__step1-desc-text">{{ content.direction.step1Text }}</p>
          <p class="direction__step1-desc-tip">{{ content.direction.step1Tip }}</p>
        </div>
      </div>
      <img
        class="direction__step1-img"
        :src="step1PictureImg"
        alt="掃描ibon右上角QRcode"
        width="230"
        height="177"
      />

      <div class="direction__step2">
        <img
          class="direction__step2-img"
          :src="step2PictureImg"
          alt="畫面顯示打卡成功"
          width="102"
          height="205"
        />
        <div class="direction__step2-text">
          <img class="direction_stepIcon" :src="step2IconImg" alt="step 2" width="53" height="68" />
          <p>{{ content.direction.step2Text }}</p>
        </div>
      </div>

      <footer class="direction__button">
        <button class="store-btn checkin" @click="$emit('checkin')" :title="content.btn.scanAgain"></button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p {
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1;
  color: $white;
}
.direction {
  @extend %fixedSection;
  z-index: 4;
  height: 100vh;
  overflow-y: scroll;

  > div {
    padding-top: 5rem;
    max-width: $card-basic;
    margin: auto;
  }

  &__deco {
    width: 13rem;
    height: 12.125rem;
    margin: 0 2.875rem 0 auto;
  }

  &_stepIcon {
    width: 3.375rem;
    height: 4.25rem;
  }

  &__step1 {
    &-desc {
      @extend %flexRowInfo;
      align-items: flex-end;
      gap: 0.75rem;

      color: $white;
      &-text {
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      &-tip {
        font-size: 1rem;
        font-weight: normal;
      }
    }
    &-img {
      margin: 0 2.5rem 2.375rem auto;
      width: 14.375rem;
      height: 11.125rem;
    }
  }

  &__step2 {
    @extend %flexRowInfo;
    gap: 0.5rem;
    margin: 0 auto auto 34px;
    &-img {
      width: 6.375rem;
      height: 12.875rem;
    }

    &-text {
      @extend %flexRowInfo;
      align-items: flex-end;
      gap: 0.5rem;
      p {
        width: 8.125rem;
        margin-bottom: 0.5rem;
      }
    }
  }

  &__button {
    margin: 1.75rem auto 2.625rem auto;
  }
}
</style>
