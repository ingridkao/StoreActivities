<script setup lang="ts">
/**
 * 活動大廳
 * step0.  確認使用者同意裝置位置資料
 * step1.  確認URL是否有ct參數 >> 驗證是否合法 >> 合法則存起來
 * step2-1.請求所有活動列表    >> 連結至指定活動
 * step2-2.請求所有廣告列表    >> 連結至指定廣告
 */
import { ref, onMounted, watchEffect, computed } from 'vue'

import type { CampaignListType, AdListType } from '@/composable/configurable'
import { useGeolocation } from '@vueuse/core'
import { useGeo } from '@/composable/useGeo'
import { useLink } from '@/composable/useLink'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLoadingStore } from '@/stores/loading'
import ParagraphTitle from '@/components/ParagraphTitle.vue'
import CampaignListItem from '@/components/CampaignListItem.vue'
import AdsListItem from '@/components/AdsListItem.vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import data from '@/assets/data'

import topCatImg from '@/assets/images/lobby/top-cat.png'
import topLogoImg from '@/assets/images/lobby/top-logo.png'

// step0
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
const { setLocationStorage } = useBrowserStorage()
const { errorAlert } = useSweetAlert()
const { genrateMockQRCode, fetchCampaign, fetchSpecifyCampaign, fetchAdData, verifyQRCode } =
  useFetchData()
const { getQueryParam } = useLink()

let getPosition = false
watchEffect(async () => {
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // setLocationStorage(latitude, longitude)
  } else if (error.value && error.value.code >= 1) {
    geoErrorHandler(error.value.code)
  }
})

const loadStore = useLoadingStore()
const campaignList = ref<CampaignListType[]>([])
const specifyCampaignList = ref<CampaignListType[]>([])
const adsList = ref<AdListType[]>([])
const qrString = ref('')
const storeId = ref<string>('')
onMounted(async () => {
  try {
    loadStore.toggle(true)

    const pathQuery = getQueryParam(window.location.href, 'ct')
    if (pathQuery) {
      storeId.value = pathQuery.substring(2, 8)
      await verifyQRCode(pathQuery)
    } else {
      // TODO: After check api flow, remove this
      const MockCode = await genrateMockQRCode()
      if (MockCode) {
        // storeId.value = MockCode.store || ''
        setLocationStorage(Number(MockCode.lat), Number(MockCode.long))
        qrString.value = `${import.meta.env.VITE_BASE_URL}?ct=${MockCode.qrCode}`
        const pathQuery = getQueryParam(window.location.href, 'ct')
        if (pathQuery) {
          await verifyQRCode(MockCode.qrCode)
        }
      }
    }

    const [result1, result2, result3] = await Promise.all([
      fetchCampaign(),
      fetchSpecifyCampaign(storeId.value),
      fetchAdData()
    ])
    campaignList.value = result1 || []
    specifyCampaignList.value = result2 || []
    adsList.value = result3 || []
    loadStore.toggle(false)
  } catch (error) {
    errorAlert(error)
  }
})

const siteLoading = computed(() => loadStore.load)
</script>

<template>
  <main class="lobby-view">
    <div v-if="siteLoading" class="loading">Loading...</div>
    <div v-else>
      <div class="lobby-view__main">
        <div class="lobby-view__main--logo">
          <img :src="topLogoImg" alt="top logo" />
        </div>
        <div class="lobby-view__main--cat">
          <div class="lobby-view__main--cat-img">
            <img :src="topCatImg" alt="top cat" />
          </div>
          <div class="lobby-view__main--cat-dialog">{{ data.lobby.title }}</div>
        </div>
      </div>
      <div class="lobby-view__menu">
        <div class="lobby-view__menu--category">
          <ParagraphTitle :title="data.lobby.eventTitle" />
        </div>
        <CampaignListItem
          v-for="campaignItem in specifyCampaignList"
          :campaign="campaignItem"
          :key="campaignItem.id"
        />
        <div class="lobby-view__menu--category">
          <ParagraphTitle :title="data.lobby.pastEventTitle" />
        </div>
        <div class="lobby-view__menu--items">
          <CampaignListItem
            v-for="campaignItem in campaignList"
            :campaign="campaignItem"
            :key="campaignItem.id"
          />
        </div>
      </div>
      <!--<AdsListItem v-for="item in adsList" :key="item.id" :ads="item" />

      <RouterLink to="/album" class="album">
        <img src="@/assets/images/lobby/album.png" alt="集郵冊-打卡紀錄" />
      </RouterLink> -->

      <div class="lobby-view__icon-bar">
        <img src="@/assets/images/lobby/icon-facebook.png" alt="facebook" />
        <img src="@/assets/images/lobby/icon-instagram.png" alt="instagram" />
        <img src="@/assets/images/lobby/icon-youtube.png" alt="youtube" />
        <img src="@/assets/images/lobby/icon-line.png" alt="line" />
        <img src="@/assets/images/lobby/icon-open-point.png" alt="open-point" />
      </div>

      <!-- TODO: After check api flow, remove this  -->
      <!--<vueQr :text="qrString" :size="100" :correctLevel="3" />
      <a :href="qrString" target="_blank">{{ qrString }}</a> -->
    </div>
  </main>
</template>

<style lang="scss" scoped>
.lobby-view {
  background-color: #efefea;

  &__main {
    background: url('@/assets/images/lobby/top-bg.png');
    padding: 22px 26px 0 26px;
    width: 100%;

    &--logo {
      width: 73px;
      height: 31px;
      margin-bottom: 8px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
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

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
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

  &__menu {
    min-height: calc(100vh - 186px - 125px);
    padding: 26px;

    &--category {
      padding-bottom: 20px;
    }

    &--items {
      display: flex;
      flex-direction: column;
      gap: 14px;
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
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 36px;
}
.album {
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 169/50;
    object-fit: contain;
  }
}
</style>
