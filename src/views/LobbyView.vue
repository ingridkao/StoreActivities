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
import CampaignListItem from '@/components/CampaignListItem.vue'
import AdsListItem from '@/components/AdsListItem.vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

// step0
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
const { setLocationStorage } = useBrowserStorage()
const { errorAlert } = useSweetAlert()
const { genrateMockQRCode, fetchCampaign, fetchSpecifyCampaign, fetchAdData, verifyQRCode } = useFetchData()
const { getQueryParam } = useLink()

let getPosition = false
watchEffect(async () => {
  const { latitude, longitude } = coords.value
  if (getPosition) return
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    getPosition = true
    // setLocationStorage(latitude, longitude)
    // try {
    //   const pathQuery = getQueryParam(window.location.href, 'ct')
    //   await verifyQRCode(pathQuery)
    // } catch (error) {
    //   errorAlert(`verifyQRCode:${error}`)
    // }
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
    if(pathQuery){
      storeId.value = pathQuery.substring(2, 8)
    }else{
      // TODO: After check api flow, remove this
      const MockCode = await genrateMockQRCode()
      if(MockCode){
        // storeId.value = MockCode.store || ''
        setLocationStorage(Number(MockCode.lat), Number(MockCode.long))
        qrString.value = `${import.meta.env.VITE_BASE_URL}?ct=${MockCode.qrCode}`
        const pathQuery = getQueryParam(window.location.href, 'ct')
        if(pathQuery){
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
    <div v-else class="lobby-view__menu">
      <CampaignListItem
        v-for="campaignItem in campaignList"
        :campaign="campaignItem"
        :key="campaignItem.id"
      />

      <CampaignListItem
        v-for="campaignItem in specifyCampaignList"
        :campaign="campaignItem"
        :key="campaignItem.id"
      />

      <AdsListItem
        v-for="item in adsList"
        :key="item.id"
        :ads="item"
      />

      <RouterLink to="/album">
        <img src="https://i.imgur.com/d8ptVfB.png" alt="集郵冊-打卡紀錄" />
      </RouterLink>

      <div class="lobby-view__icon-bar">
        <img src="@/assets/images/lobby/icon-facebook.png" alt="facebook" />
        <img src="@/assets/images/lobby/icon-instagram.png" alt="instagram" />
        <img src="@/assets/images/lobby/icon-youtube.png" alt="youtube" />
        <img src="@/assets/images/lobby/icon-line.png" alt="line" />
        <img src="@/assets/images/lobby/icon-open-point.png" alt="open-point" />
      </div>

      <!-- TODO: After check api flow, remove this  -->
      <vueQr 
        :text="qrString" 
        :size="100" 
        :correctLevel="3"
      />
      <a :href="qrString" target="_blank">{{qrString}}</a>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.lobby-view {
  padding: 62px 26px 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/images/background/light-green-bg.png');

  &__menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 26px;
    width: 100%;
  }

  &__icon-bar {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;

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
</style>
