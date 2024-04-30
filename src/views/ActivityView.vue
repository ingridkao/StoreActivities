<script setup lang="ts">
/**
 * 活動說明
 * step0.確認裝置是否提供經緯度
 * step1.確認是否為進行中活動
 * step2.取得LINE user profile
 *       - 已登入:網頁導轉到此頁
 *       - 未登入:LINE Login redirect到此頁
 * step3.去檢測ct
 *       - 有  : 送出打卡資訊
 *       - 沒有: 到活動地圖頁面
 */
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderMenu from '@/components/HeaderMenu.vue'

// import type { ProfileType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useGeolocation } from '@vueuse/core'
import { useGeo } from '@/composable/useGeo'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLoadingStore } from '@/stores/loading'

const route = useRoute()
const router = useRouter()
const { confirmActivity, verifyQRCode, commitStoreCheckIn } = useFetchData()
const { getAcStorage, setAcStorage } = useBrowserStorage()

// step0
const { coords, error } = useGeolocation()
const { geoErrorHandler } = useGeo()
let getPosition = false

// step1
const { errorAlert } = useSweetAlert()
const content = ref({})

watchEffect(async () => {
    // step0
    const { latitude, longitude } = coords.value
    if (getPosition) return
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      getPosition = true
      // setLocationStorage(latitude, longitude)
    } else if (error.value && error.value.code >= 1) {
      geoErrorHandler(error.value.code)
    }
    // step1
    let activityId:string | string[] = ''
    if(route.params && route.params.id){
      activityId = route.params.id
    }else{
      activityId = getAcStorage()
    }
    try {
      const confirmRes = await confirmActivity(activityId)
      if (typeof confirmRes === 'object') {
        setAcStorage(activityId)
        content.value = confirmRes
      } else if (confirmRes === 2) {
        router.push({ path: '/wrapup' })
      } else {
        router.push({ name: 'ComingSoon' })
      }
    } catch (error) {
      const errorStr = String(error)
      errorAlert(errorStr)
    }
  } catch (error) {
    const errorStr = String(error)
    errorAlert(errorStr)
  }
})

const gotoDirection = () => {
  router.push({ path: '/direction' })
}

const loadStore = useLoadingStore()
const enterActivity = async () => {
  loadStore.toggle(true)
  try {
    // step3
    const verifyRes = await verifyQRCode()
    if (verifyRes) {
      const commitRes = await commitStoreCheckIn(verifyRes)
      console.log(commitRes)
    } else {
      gotoDirection()
    }
    loadStore.toggle(false)
  } catch (error) {
    const errorStr = String(error)
    errorAlert(errorStr)
    loadStore.toggle(false)
  }
}
</script>

<template>
  <HeaderMenu :knowActivity="true"/>

  <main class="event">
    <section class="event_time">
      <div>4.16</div>
      <div>6.30</div>
    </section>

    <section class="linkBox right">
      <button @click="gotoDirection">info</button>
    </section>

    <section>
      <h2>活動辦法</h2>
      <p>
        2021河濱自行車挑戰認證，分為「環騎台北」及「小鴨慢騎」2組，並精選數個環繞河濱的指定打卡點，活動時間自11月6日起至12月5日止，無論白天黑夜，只需透過手機就能自由報名參加。依著活動網頁指示，集滿指定數量打卡點，即可獲得電子完騎證明與專屬紀念品乙份。
      </p>
      <p>此活動不需要載任何App，直接Mobile Web就可以直接執行掃描QRCode，GPS定位，打卡等功能。</p>
      <p>
        此外為鼓勵民眾多多參與2021河濱自行車挑戰認證，特別與進駐河濱公園的商家合作舉辦「集點抽獎」活動，參加者就有機會抽中iPhone
        13乙台。心動不如馬上行動，趕快踏上自行車，來趟環騎挑戰之旅吧。
      </p>
    </section>

    <section>
      <h2>獎品</h2>
      <p>2024福袋 N組</p>
      <p>City Cafe N組</p>
      <p>City Cafe 鮮萃茶 N杯</p>
    </section>

    <section class="linkBox">
      <button @click="enterActivity">進入活動</button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.event {
  flex-direction: column;
  @media (min-width: 1024px) {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
