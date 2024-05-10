<script setup lang="ts">
/**
 * 中獎序號s
 */
import { ref, onMounted } from 'vue'
import { useLink } from '@/composable/useLink'

import ParagraphItem from '@/components/ParagraphItem.vue'
import data from '@/assets/data'
import winningCatImg from '@/assets/images/winning/winning-cat.png'
import endButtonImg from '@/assets/images/winning/end-button.svg'
import nextArrowImg from '@/assets/images/winning/next-arrow.svg'
import prevArrowImg from '@/assets/images/winning/prev-arrow.svg'

const { linkToActivity } = useLink()

//TODO: Remove prizeIndex and prizeInfo after api finish
const prizeIndex = ref(0)

const prizeInfo = ref([
  {
    type: 1,
    title: '咖啡券',
    storeCount: 15,
    content: '拿鐵大杯(冰/熱)',
    usableCount: 3,
    usedCount: 2,
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 5473985660,
    explanation:
      '請直接至 7-ELEVEN 門市內的 ibon 機台列印，於機台首頁選擇左上方「代碼輸入」，輸入取件編號或掃描 QR Code，就可以輕鬆取得文件囉！'
  },
  {
    type: 2,
    title: '4X6貼紙',
    storeCount: 0,
    content: '4X6貼紙一張',
    usableCount: 5,
    usedCount: 1,
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 6695473985,
    explanation:
      '凡於活動期間租借行動電源，於租借時輸入優惠代碼【ibon】，即可享第一小時半價優惠，不限次數。'
  },
  {
    type: 3,
    title: '虛寶',
    storeCount: 0,
    content: '尚方寶劍31天效期',
    usableCount: 5,
    usedCount: 1,
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 6695473985,
    explanation:
      '請進入遊戲大廳後，點選右上角的齒輪進入【系統設置>>基礎】，拉到畫面最下面點選【虛寶兌換】，輸入完整的序號後點選確認兌換。當提示【序號兌換成功】後，獎勵會派送到【系統郵件】，請稍待3~5分鐘檢查收件匣的狀況即可。'
  }
])

onMounted(() => {
  // getSerialNumber().then(number => {
  //   serialNumber.value = number
  // }).catch(error => {
  //   取得中獎序號失敗 -> sweetalert2
  //   console.error(error);
  // })
})
</script>

<template>
  <main class="winning-view">
    <p v-if="prizeInfo[prizeIndex].storeCount > 0" class="winning-view__tip">
      {{ `${data.winning.accumulate}${prizeInfo[prizeIndex].storeCount}${data.winning.store}` }}
    </p>
    <div class="winning-view__prize-container">
      <div
        class="winning-view__prize-container--prev-arrow"
        @click="() => prizeIndex > 0 && prizeIndex--"
      >
        <img v-show="prizeIndex !== 0" :src="prevArrowImg" alt="prev arrow" />
      </div>
      <div class="winning-view__prize-wrapper">
        <div
          class="winning-view__prize-wrapper--top"
          :class="{
            'winning-view__prize-wrapper--top--type1': prizeInfo[prizeIndex].type === 1,
            'winning-view__prize-wrapper--top--type2': prizeInfo[prizeIndex].type === 2,
            'winning-view__prize-wrapper--top--type3': prizeInfo[prizeIndex].type === 3
          }"
        >
          <p>{{ prizeInfo[prizeIndex].title }}</p>
        </div>
        <div class="winning-view__prize-wrapper--middle">
          <p>{{ prizeInfo[prizeIndex].content }}</p>
          <span
            >{{ prizeInfo[prizeIndex].usedCount }} / {{ prizeInfo[prizeIndex].usableCount }}</span
          >
        </div>
        <div class="winning-view__prize-wrapper--bottom">
          <p class="winning-view__prize-wrapper--bottom-number">
            {{ data.winning.serialNumber }} <span>{{ prizeInfo[prizeIndex].serialNumber }}</span>
          </p>
          <p class="winning-view__prize-wrapper--bottom-date">
            {{ data.winning.deadline }} <span>{{ prizeInfo[prizeIndex].deadline }}</span>
          </p>
        </div>
      </div>
      <div
        class="winning-view__prize-container--next-arrow"
        @click="() => prizeIndex < prizeInfo.length - 1 && prizeIndex++"
      >
        <img v-show="prizeIndex !== prizeInfo.length - 1" :src="nextArrowImg" alt="next arrow" />
      </div>
    </div>
    <div class="winning-view__cat">
      <img :src="winningCatImg" alt="winning cat" />
    </div>
    <div class="winning-view__content">
      <ParagraphItem
        :title="data.winning.explanationTitle"
        :content="prizeInfo[prizeIndex].explanation"
      />
      <button class="winning-view__content--button" @click="linkToActivity()">
        <img :src="endButtonImg" alt="enter button" />
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.winning-view {
  overflow: auto;
  background: url('@/assets/images/background/green-bg.png');
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 80px;
  position: relative;

  &__tip {
    color: #fff;
    font-weight: 700;
    font-size: 20px;
    position: absolute;
    top: 60px;
  }

  &__prize-container {
    display: flex;
    align-items: center;
    gap: 12px;

    &--next-arrow,
    &--prev-arrow {
      cursor: pointer;
      width: 32px;
      height: 37px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  &__prize-wrapper {
    width: 270px;
    height: 250px;
    background: #fff;
    margin-top: 28px;
    border-radius: 15px;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    &--top {
      flex: 0 0 63px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: #473423;

      &--type1 {
        background-color: #efdc2b;
      }

      &--type2 {
        background-color: #afeb30;
      }

      &--type3 {
        background-color: #ffa41b;
      }
    }

    &--middle {
      flex: 1;
      width: 100%;
      background-color: #f7f7f7;
      display: flex;
      justify-content: end;
      align-items: center;
      font-size: 24px;
      font-weight: 700;
      color: #85846b;
      gap: 8px;
      flex-direction: column;
      padding-bottom: 8px;

      p {
        padding: 0 12px;
        text-align: center;
      }

      span {
        font-size: 13.5px;
        font-weight: 500;
      }
    }

    &--bottom {
      flex: 0 0 92px;
      width: 100%;
      background-color: #eeecd8;
      display: flex;
      justify-content: center;
      align-items: start;
      font-size: 14px;
      font-weight: 700;
      color: #85846b;
      flex-direction: column;
      padding-left: 25px;
      gap: 8px;

      &-number {
        display: flex;
        align-items: center;

        span {
          font-size: 22px;
          font-weight: 900;
          color: #473423;
          margin-left: 6px;
        }
      }

      &-date {
        span {
          margin-left: 6px;
          font-weight: 500;
        }
      }
    }
  }

  &__cat {
    width: 152px;
    height: 190px;
    overflow: hidden;
    margin: -10px 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__content {
    padding: 42px 57px 42px 27px;
    background-color: #fff;
    width: 100%;
    flex: 1;

    &--button {
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
      border: none;
      background-color: transparent;
    }
  }
}
</style>
