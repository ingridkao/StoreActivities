<script setup lang="ts">
/**
 * 活動大廳
 * step1.  確認URL是否有ct參數 >> 驗證是否合法 >> 合法則存起來
 * step2-1.請求所有指定門市活動列表
 * step2-2.請求所有  非門市活動列表
 * step2-3.請求所有廣告列表
 */
import { ref, onMounted, watch } from 'vue'
import type { CampaignInterface } from '@/types/ResponseHandle'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import type { AdsInterface } from '@/types/ResponseHandle'
import content from '@/assets/content'

import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useBrowserStorage } from '@/composable/useBrowserStorage'

import { useLayoutStore } from '@/stores/layout'
import ParagraphTitle from '@/components/ParagraphTitle.vue'
import CampaignItem from '@/components/lobby/CampaignItem.vue'
import LobbyHeader from '@/components/lobby/LobbyHeader.vue'
import LobbyAds from '@/components/lobby/LobbyAds.vue'

const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL || window.location.href

const { errorAlert } = useSweetAlert()
const { genrateMockQRCode, fetchAllCampaign, fetchAdData, verifyCtString, parseParamCT } =
  useFetchData()
const { setLocationStorage } = useBrowserStorage()

const layoutStore = useLayoutStore()
const displayCampaignList = ref<CampaignInterface[]>([])
const adsList = ref<AdsInterface[]>([])

const newPath = new URL(window.location.href, ORIGIN_URL)
const qrString = ref<string>('')
onMounted(async () => {
  const ctStr = newPath && newPath.search ? parseParamCT(newPath.search) : ''
  layoutStore.loadToggle(true)
  try {
    const storeId = ctStr ? ctStr.substring(2, 8) : ''
    const [result1, result2] = await Promise.all([fetchAllCampaign(storeId), fetchAdData()])
    displayCampaignList.value = result1 || []
    adsList.value = result2 || []

    if (ctStr) {
      await verifyCtString(ctStr)
    }
  } catch (error) {
    errorAlert(error)
  }
  layoutStore.loadToggle(false)
})

// TODO remove
const activityId = ref('')
const storeId = ref('')
const genrate = async() => {
  const MockCode = await genrateMockQRCode(activityId.value, storeId.value)
  if (MockCode) {
    setLocationStorage(Number(MockCode.lat), Number(MockCode.long))
    qrString.value = `${ORIGIN_URL}?ct=${MockCode.qrCode}`
  }
}
</script>

<template>
  <main class="lobby">
    <LobbyHeader />

    <section class="lobby_section">
      <ParagraphTitle :title="content.lobby.eventTitle" />
      <div class="lobby_section-list">
        <CampaignItem
          v-for="campaignItem in displayCampaignList"
          :key="campaignItem.id"
          :campaignItem="campaignItem"
        />
      </div>
    </section>

    <section class="lobby_section">
      <ParagraphTitle :title="content.lobby.pastEventTitle" />
      <RouterLink to="/album" class="lobby_section-link">
        <img src="@/assets/images/lobby/album.png" alt="集郵冊-打卡紀錄" />
      </RouterLink>
    </section>

    <LobbyAds :adsList="adsList" />
    
    <footer class="lobby_footer">
      <div>
        <a href="https://www.facebook.com/711.ibon/" target="_blank" rel="noreferrer noopenner"><img src="@/assets/images/lobby/icon-facebook.png" alt="facebook" width="45" height="45"/></a>
        <a href="https://www.instagram.com/ibontw/" target="_blank" rel="noreferrer noopenner"><img src="@/assets/images/lobby/icon-instagram.png" alt="instagram" width="45" height="45"/></a>
        <a href="https://www.youtube.com/@ibon1348" target="_blank" rel="noreferrer noopenner"><img src="@/assets/images/lobby/icon-youtube.png" alt="youtube" width="45" height="45"/></a>
        <a href="https://page.line.me/gpk2354t?openQrModal=true" target="_blank" rel="noreferrer noopenner"><img src="@/assets/images/lobby/icon-line.png" alt="line" width="45" height="45"/></a>
        <a href="https://group.openpoint.com.tw/cdn/index.html" target="_blank" rel="noreferrer noopenner"><img src="@/assets/images/lobby/icon-open-point.png" alt="open-point" width="45" height="45"/></a>
      </div>
    </footer>

    <div>
      <label for="activityId">活動ID</label>
      <input type="text" v-model="activityId" />
      <label for="activityId">店號六碼</label>
      <input type="text" v-model="storeId" />
      <button @click="genrate">送出</button>
      <template v-if="qrString">
        <div style="width: 10rem">
          <vueQr :text="qrString" :size="100" :correctLevel="3" />
        </div>
        <a :href="qrString" target="_blank">{{ qrString }}</a>
      </template>
    </div>
  </main>
</template>

<style lang="scss">
.lobby{
  @extend %pageMain;

  &_section {
    @extend %flexColInfo;
    @extend %mainSection;
    flex-wrap: wrap;
    max-width: $content-large;
    padding: 26px 26px 0 26px;
  
    .section__title {
      justify-content: flex-start;
      @media screen and (min-width: $content-large) {
        justify-content: center;
      }
    }
  
    &-list {
      @extend %flexColInfo;
      @extend %mainSection;
      flex-wrap: wrap;
      max-width: $card-middle;
      > div {
        width: 100%;
      }
      @media screen and (min-width: $content-large) {
        max-width: $content-large;
        flex-direction: row;
        justify-content: space-between;
        gap: 1%;
        > div {
          width: 49%;
        }
      }
    }
  
    &-link {
      @extend %flexColInfo;
      @extend %mainSection;
      flex-wrap: wrap;
      @extend %cardWidth;
      box-shadow: 0px 4px 4px 0px rgba($black, 0.3);
      border-radius: 24px;
      background-color: $white2;
      aspect-ratio: 169/50;
      img {
        height: auto;
        overflow: hidden;
        object-fit: cover;
      }
    }
  }

  &_footer{
    background: url('@/assets/images/bg/lime.png') repeat;
    padding: 28px 0 52px 0;
    >div{
      @extend %mainSection;
      max-width: $card-middle;
      @extend %flexRowInfo;
      gap: 16px;
      a {
        width: 45px;
        height: 45px;
      }
    }
  }
}

</style>
