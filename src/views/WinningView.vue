<script setup lang="ts">
/**
 * 中獎序號s
 */
import { ref, watchEffect, computed } from 'vue'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useEventStorage } from '@/composable/useEventStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'

import { useLayoutStore } from '@/stores/layout'

import ParagraphItem from '@/components/ParagraphItem.vue'
import data from '@/assets/data'
import winningCatImg from '@/assets/images/winning/winning-cat.png'
import backButtonImg from '@/assets/images/winning/back-button.svg'
import nextArrowImg from '@/assets/images/winning/next-arrow.svg'
import prevArrowImg from '@/assets/images/winning/prev-arrow.svg'

const { linkToTargetActivityIdPage } = useLink()
const { fetchReceivePrize } = useFetchData()
const { getTargetEventStorage } = useEventStorage()
const { errorAlert } = useSweetAlert()

//TODO: Remove prizeIndex and prizeInfo after api finish
const prizeIndex = ref(0)

const prizeInfo = ref([
  {
    awardName: '咖啡券',
    grade: 15,
    content: '拿鐵大杯(冰/熱)',
    usableCount: 3,
    usedCount: 2,
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 5473985660,
    explanation:
      '請直接至 7-ELEVEN 門市內的 ibon 機台列印，於機台首頁選擇左上方「代碼輸入」，輸入取件編號或掃描 QR Code，就可以輕鬆取得文件囉！'
  },
  {
    awardName: '4X6貼紙',
    grade: 0,
    content: '4X6貼紙一張',
    usableCount: 5,
    usedCount: 1, 
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 6695473985,
    explanation:
      '凡於活動期間租借行動電源，於租借時輸入優惠代碼【ibon】，即可享第一小時半價優惠，不限次數。'
  },
  {
    awardName: '虛寶',
    grade: 0,
    content: '尚方寶劍31天效期',
    usableCount: 5,
    usedCount: 1,
    deadline: '2024/05/01-2024/08/31',
    serialNumber: 6695473985,
    explanation:
      '請進入遊戲大廳後，點選右上角的齒輪進入【系統設置>>基礎】，拉到畫面最下面點選【虛寶兌換】，輸入完整的序號後點選確認兌換。當提示【序號兌換成功】後，獎勵會派送到【系統郵件】，請稍待3~5分鐘檢查收件匣的狀況即可。'
  }
])

const prizeTargetInfo = computed(() => prizeInfo.value[prizeIndex.value] || null)

// const prizeList = ref([])
const layoutStore = useLayoutStore()
watchEffect(async () => {
  const TargetEvent = getTargetEventStorage()
  if(TargetEvent && TargetEvent.id){
    layoutStore.loadToggle(true)
    try {
      // const res = await fetchReceivePrize(TargetEvent.id)
      // prizeInfo.value = res || []
    } catch (error) {
      errorAlert(String(error), `/activity/${TargetEvent.id}`)
    }
    layoutStore.loadToggle(false)
  }else{
    errorAlert('操作異常，回到活動大廳')
  }
})

</script>

<template>
  <main class="winning">
    <p v-if="prizeTargetInfo && prizeTargetInfo.grade > 0" class="winning__tip">
      {{ `${data.winning.accumulate} ${prizeTargetInfo.grade} ${data.winning.store}` }}
    </p>
    <section class="winning__wrapper">
      <div class="winning__wrapper--top" :class="`type${prizeIndex+1}`">
        <p>{{ prizeTargetInfo.awardName || '' }}</p>
        <span>
          ({{ prizeTargetInfo.usedCount || 0 }}/{{ prizeTargetInfo.usableCount || 0 }})
        </span>
      </div>
      <div class="winning__wrapper--middle">
        <p>{{ prizeTargetInfo.content || '' }}</p>
      </div>
      <div class="winning__wrapper--bottom">
        <p class="winning__wrapper--bottom-number">
          {{ data.winning.serialNumber }} <span>{{ prizeTargetInfo.serialNumber || '' }}</span>
        </p>
        <p class="winning__wrapper--bottom-date">
          {{ data.winning.deadline }} <span>{{ prizeTargetInfo.deadline || '' }}</span>
        </p>
      </div>
    </section>

    <section class="winning__cat">
      <button 
        class="winning__cat--prev-arrow" 
        :class="{show: prizeIndex !== 0}"
        @click="() => prizeIndex > 0 && prizeIndex--"
      >
        <img :src="prevArrowImg" alt="prev arrow" />
      </button>
      <div class="winning__cat--image">
        <img :src="winningCatImg" alt="winning cat" />
      </div>
      <button
        class="winning__cat--next-arrow"
        :class="{show: prizeIndex !== prizeInfo.length - 1}"
        @click="() => prizeIndex < prizeInfo.length - 1 && prizeIndex++"
      >
        <img :src="nextArrowImg" alt="next arrow" />
      </button>
    </section>

    <section class="winning__content store-content">
      <ParagraphItem
        :title="data.winning.explanationTitle"
        :content="prizeTargetInfo.explanation || ''"
      />
      <button class="store-btn" @click="linkToTargetActivityIdPage('', 'Collected')">
        <img :src="backButtonImg" alt="返回打卡紀錄" />
      </button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.winning {
  overflow: auto;
  background: url('@/assets/images/winning/bg.png');
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

  &__wrapper {
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: #473423;
      gap: 4px;

      p {
        margin-top: 6px;
      }

      span {
        font-size: 15px;
        font-weight: 500;
      }

      &.type1 {
        background-color: #efdc2b;
      }

      &.type2 {
        background-color: #afeb30;
      }

      &.type3 {
        background-color: #ffa41b;
      }
    }

    &--middle {
      flex: 1;
      width: 100%;
      background-color: #f7f7f7;
      display: flex;
      justify-content: center;

      align-items: center;
      font-size: 24px;
      font-weight: 700;
      color: #85846b;
      gap: 8px;
      flex-direction: column;
      padding-bottom: 8px;

      p {
        padding: 0 12px;
        margin-top: 12px;
        text-align: center;
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
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-around;

    &--image {
      width: 152px;
      height: 190px;
      overflow: hidden;
      margin: -10px 0;
    }

    &--next-arrow,
    &--prev-arrow {
      cursor: pointer;
      width: 32px;
      height: 37px;
      overflow: hidden;
      visibility: hidden;
      &.show{
        visibility: visible;
      }
    }
  }

  &__content {
    padding: 42px 27px 42px 27px;
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
