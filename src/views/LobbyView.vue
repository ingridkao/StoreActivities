<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    errorAlert(String(error))
  }
  layoutStore.loadToggle(false)
})

const shareList = ref([{
  link: "https://www.facebook.com/711.ibon/",
  img: new URL(`@/assets/images/lobby/icon-facebook.png`, import.meta.url).href,
  name: "facebook",
},{
  link: "https://www.instagram.com/ibontw/",
  img: new URL(`@/assets/images/lobby/icon-instagram.png`, import.meta.url).href,
  name: "instagram",
},{
  link: "https://www.youtube.com/@ibon1348/",
  img: new URL(`@/assets/images/lobby/icon-youtube.png`, import.meta.url).href,
  name: "youtube",
},{
  link: "https://page.line.me/gpk2354t?openQrModal=true",
  img: new URL(`@/assets/images/lobby/icon-line.png`, import.meta.url).href,
  name: "line",
},{
  link: "https://group.openpoint.com.tw/cdn/index.html",
  img: new URL(`@/assets/images/lobby/icon-open-point.png`, import.meta.url).href,
  name: "open-point",
}])

// TODO remove
const activityId = ref('')
const storeId = ref('')
const genrate = async () => {
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
        <a 
          v-for="item in shareList" :key="item.name"
          :href="item.link" 
          target="_blank" 
          rel="noreferrer noopenner"
        >
          <img :src="item.img" :alt="item.name" width="45" height="45"/>
        </a>
      </div>
    </footer>

    <div>
      <label for="activityId">活動ID</label>
      <input type="text" v-model="activityId" />
      <label for="activityId">店號六碼</label>
      <input type="text" v-model="storeId" />
      <button @click="genrate">送出</button>
      <template v-if="qrString">
        <div style="width: 80px">
          <vueQr :text="qrString" :size="80" :correctLevel="0" :margin="0"/>
        </div>
        <a :href="qrString" target="_blank">{{ qrString }}</a>
      </template>
    </div>
  </main>
</template>

<style lang="scss">
.lobby {
  @extend %pageMain;

  &_section {
    @extend %flexColInfo;
    @extend %mainSection;
    max-width: $content-large;
    padding: 1.625rem;

    .section__title {
      justify-content: flex-start;
      margin-bottom: 1.25rem;
      @media screen and (min-width: $content-large) {
        justify-content: center;
      }
    }

    &-list {
      @extend %flexColInfo;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      @extend %mainSection;
      max-width: $card-middle;
      > div {
        width: 100%;
      }
      @media screen and (min-width: $content-large) {
        max-width: $content-large;
        flex-direction: row;
        justify-content: space-between;
        column-gap: 1%;
        > div {
          width: 49%;
        }
      }
    }

    &-link {
      @extend %flexColInfo;
      @extend %cardWidth;
      box-shadow: 0px 0.25rem 0.25rem 0px rgba($black, 0.3);
      border-radius: 1.75rem;
      background-color: $white2;
      aspect-ratio: 169/50;
      img {
        height: auto;
        overflow: hidden;
        object-fit: cover;
      }
    }
  }

  &_footer {
    background: url('@/assets/images/bg/lime.png') repeat;
    padding: 1.75rem 0 3.25rem 0;
    > div {
      @extend %mainSection;
      max-width: $card-middle;
      @extend %flexRowInfo;
      gap: 1rem;
      a {
        width: 2.75rem;
        height: 2.75rem;
      }
    }
  }
}
</style>
