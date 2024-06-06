<script setup lang="ts">
/**
 * 活動大廳
 * step1.  確認URL是否有ct參數 >> 驗證是否合法 >> 合法則存起來
 * step2-1.請求所有指定門市活動列表
 * step2-2.請求所有  非門市活動列表
 * step2-3.請求所有廣告列表
 */
import { ref, onMounted } from 'vue'
import type { CampaignInterface } from '@/types/ResponseHandle'

import type { AdsInterface } from '@/types/ResponseHandle'
import data from '@/assets/data'

import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'
import ParagraphTitle from '@/components/ParagraphTitle.vue'
import CampaignItem from '@/components/lobby/CampaignItem.vue'
import LobbyHeader from '@/components/lobby/LobbyHeader.vue'
import LobbyAds from '@/components/lobby/LobbyAds.vue'

const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL || window.location.href

const { errorAlert } = useSweetAlert()
const { fetchAllCampaign, fetchAdData, verifyCtString, parseParamCT } =
  useFetchData()

const layoutStore = useLayoutStore()
const displayCampaignList = ref<CampaignInterface[]>([])
const adsList = ref<AdsInterface[]>([])

const newPath = new URL(window.location.href, ORIGIN_URL)
onMounted(async () => {
  const ctStr = newPath && newPath.search ? parseParamCT(newPath.search) : ''
  layoutStore.loadToggle(true)
  try {
    const storeId = ctStr ? ctStr.substring(2, 8) : ''
    const [result1, result2] = await Promise.all([fetchAllCampaign(storeId), fetchAdData()])
    displayCampaignList.value = result1 || []
    adsList.value = result2 || []
  } catch (error) {
    errorAlert(error)
  }
  layoutStore.loadToggle(false)

  try {
    if (ctStr) {
      // 驗證ct
      await verifyCtString(ctStr)
    }
  } catch (error) {
    errorAlert(error)
  }
})
</script>

<template>
  <main class="lobby">
    <LobbyHeader />

    <section class="lobby__section store-content large">
      <ParagraphTitle :title="data.lobby.eventTitle" />
      <div class="lobby__section--list">
        <CampaignItem v-for="campaignItem in displayCampaignList" :key="campaignItem.id" :campaignItem="campaignItem" />
      </div>
    </section>

    <section class="lobby__section store-content large">
      <ParagraphTitle :title="data.lobby.pastEventTitle" />
      <RouterLink to="/album" class="lobby__section--link">
        <img src="@/assets/images/lobby/album.png" alt="集郵冊-打卡紀錄" />
      </RouterLink>
    </section>

    <LobbyAds :adsList="adsList" />

    <div class="lobby__icon-bar">
      <img src="@/assets/images/lobby/icon-facebook.png" alt="facebook" />
      <img src="@/assets/images/lobby/icon-instagram.png" alt="instagram" />
      <img src="@/assets/images/lobby/icon-youtube.png" alt="youtube" />
      <img src="@/assets/images/lobby/icon-line.png" alt="line" />
      <img src="@/assets/images/lobby/icon-open-point.png" alt="open-point" />
    </div>
  </main>
</template>

<style lang="scss">
$card: 396px;
$medium: 855px;
.lobby {
  background-color: #efefea;

  &__section {
    display: flex;
    flex-direction: column;
    padding: 26px 26px 0 26px;

    &--list{
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
      gap: 1%;
      >div{
        flex-basis: 100%;
        width: $card;
        margin: auto;
      }
      @media screen and (min-width: $medium) {
        flex-direction: row;
        justify-content: space-between;
        >div{
          flex-basis: 49%;
          width: auto;
          min-width: $card;
          margin: 0;
        }
      }
    }
  
    &--link {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      max-width: $card;
      margin: 0 auto;
      gap: 14px;
      @media screen and (min-width: $medium) {
        max-width: $medium;
      }
      img {
        width: 100%;
        height: auto;
        border-radius: 30px;
        aspect-ratio: 169/50;
        object-fit: cover;
        overflow: hidden;
        box-shadow: 0px 4px 4px 0px #00000040;
      }
    }
  }

  &__icon-bar {
    background: url('@/assets/images/lobby/bottom-bg.png');
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: center;
    padding: 28px 0 52px 0;
    img {
      width: 45px;
      height: 45px;
    }
  }
}
</style>
