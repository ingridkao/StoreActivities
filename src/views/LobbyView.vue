<script setup lang="ts">
/**
 * 活動大廳
 * step1.  確認URL是否有ct參數 >> 驗證是否合法 >> 合法則存起來
 * step2-1.請求所有指定門市活動列表
 * step2-2.請求所有  非門市活動列表
 * step2-3.請求所有廣告列表
 */
import { ref, onMounted, computed } from 'vue'
import type { EventInterface } from '@/types/ResponseHandle'

import type { AdsInterface } from '@/types/ResponseHandle'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLoadingStore } from '@/stores/loading'
import ParagraphTitle from '@/components/ParagraphTitle.vue'
import CampaignListItem from '@/components/CampaignListItem.vue'
// import AdsListItem from '@/components/AdsListItem.vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import data from '@/assets/data'

import topCatImg from '@/assets/images/lobby/top-cat.png'
import topLogoImg from '@/assets/images/lobby/top-logo.png'

const { setLocationStorage, setQRcodeString, setAcStringStorage } = useBrowserStorage()
const { errorAlert } = useSweetAlert()
const { genrateMockQRCode, fetchAllCampaign, fetchAdData, verifyQRCode } = useFetchData()

const loadStore = useLoadingStore()
const displayCampaignList = ref<EventInterface[]>([])
const adsList = ref<AdsInterface[]>([])
const siteLoading = computed(() => loadStore.load)
const qrString = ref<string>('')

setAcStringStorage('')
onMounted(async () => {
  const originURL = window.location.origin
  const newPath = new URL(window.location.href, originURL)
  let ctCode = ''
  let storeId = ''
  if (newPath.origin === originURL && newPath && newPath.search) {
    const codeSplit = newPath.search.split('?ct=')
    ctCode = codeSplit.length === 2 && codeSplit[1] ? codeSplit[1] : ''
    storeId = ctCode.substring(2, 8)
    setQRcodeString(ctCode)
  }

  loadStore.toggle(true)
  try {
    const [result1, result2] = await Promise.all([fetchAllCampaign(storeId), fetchAdData()])
    displayCampaignList.value = result1 || []
    adsList.value = result2 || []
  } catch (error) {
    errorAlert(error)
  }
  loadStore.toggle(false)

  try {
    if (ctCode) {
      const res = await verifyQRCode(ctCode)
      console.log(res)
    } else {
      // TODO: After check api flow, remove this
      const MockCode = await genrateMockQRCode()
      if (MockCode) {
        setLocationStorage(Number(MockCode.lat), Number(MockCode.long))
      }
      qrString.value = `${originURL}?ct=${MockCode.qrCode}`
    }
  } catch (error) {
    errorAlert(error)
  }
})
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
          v-for="campaignItem in displayCampaignList"
          :campaign="campaignItem"
          :key="campaignItem.id"
        />

        <div class="lobby-view__menu--category">
          <ParagraphTitle :title="data.lobby.pastEventTitle" />
        </div>
        <div class="lobby-view__menu--items">
          <RouterLink to="/album" class="album">
            <div class="album__img">
              <img src="@/assets/images/lobby/album.png" alt="集郵冊-打卡紀錄" />
            </div>
          </RouterLink>
        </div>
      </div>

      <!--<AdsListItem v-for="item in adsList" :key="item.id" :ads="item" /> -->

      <div class="lobby-view__icon-bar">
        <img src="@/assets/images/lobby/icon-facebook.png" alt="facebook" />
        <img src="@/assets/images/lobby/icon-instagram.png" alt="instagram" />
        <img src="@/assets/images/lobby/icon-youtube.png" alt="youtube" />
        <img src="@/assets/images/lobby/icon-line.png" alt="line" />
        <img src="@/assets/images/lobby/icon-open-point.png" alt="open-point" />
      </div>

      <!-- TODO: After check api flow, remove this  -->
      <vueQr :text="qrString" :size="100" :correctLevel="3" />
      <template v-if="qrString">
        <a :href="qrString" target="_blank">{{ qrString }}</a>
      </template>
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
    min-height: calc(100 * var(--vh) - 186px - 125px);
    padding: 26px;

    &--category {
      padding-bottom: 20px;
      padding-top: 20px;
      &:first-child {
        padding-top: 0px;
      }
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

  .loading {
    width: 100%;
    height: calc(100 * var(--vh));
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    font-size: 36px;
  }
}

.album {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px #00000040;
  &__img {
    width: 338px;
    height: 100px;
  }
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 169/50;
    object-fit: cover;
  }
}
</style>
