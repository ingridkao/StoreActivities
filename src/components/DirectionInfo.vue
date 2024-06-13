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
      <img class="direction__deco" :src="DecoCatImg" alt="操作ibon的喵~" width="208" height="194"/>

      <div class="direction__step1-desc">
        <img class="direction_stepIcon" :src="step1IconImg" alt="step 1" width="53" height="68" />
        <div>
          <p class="direction__step1-desc-text">{{ content.direction.step1Text }}</p>
          <p class="direction__step1-desc-tip">{{ content.direction.step1Tip }}</p>
        </div>
      </div>
      <img class="direction__step1-img" :src="step1PictureImg" alt="掃描ibon右上角QRcode" width="230" height="177"/>

      <div class="direction__step2">
        <img class="direction__step2-img" :src="step2PictureImg" alt="畫面顯示打卡成功" width="102" height="205"/>
        <div class="direction__step2-text">
          <img class="direction_stepIcon" :src="step2IconImg" alt="step 2" width="53" height="68" />
          <p>{{ content.direction.step2Text }}</p>
        </div>
      </div>

      <footer class="direction__button">
        <button 
          class="store-btn checkin" 
          @click="$emit('checkin')" 
          title="進行打卡"
        ></button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
p{
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  color: $white;
}
.direction {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 4;
  overflow-y: scroll;

  >div{
    padding-top: 80px;
    max-width: $card-basic;
    margin: auto;
  }

  &__deco {
    width: 208px;
    height: 194px;
    margin: 0 46px 0 auto;
  }

  &_stepIcon {
    width: 53px;
    height: 68px;
  }

  &__step1 {
    &-desc{
      @extend %flexRowInfo;
      align-items: flex-end;
      gap: 12px;

      color: $white;
      &-text {
        margin-bottom: 8px;
        font-weight: bold;
      }
      &-tip {
        font-size: 15px;
        font-weight: normal;
      }
    }
    &-img {
      margin: 0 40px 38px auto;
      width: 230px;
      height: 177px;
    }
  }

  &__step2 {
    @extend %flexRowInfo;
    gap: 8px;
    margin: 0 auto auto 34px;
    &-img {
      width: 102px;
      height: 205px;
    }

    &-text {
      @extend %flexRowInfo;
      align-items: flex-end;
      gap: 8px;
      p {
        width: 130px;
        margin-bottom: 9px;
      }
    }
  }

  &__button {
    margin: 27px auto 42px auto;
  }
}
</style>
