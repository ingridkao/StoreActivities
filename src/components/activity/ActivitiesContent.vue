<script setup lang="ts">
/**
 * 1.取得LINE user profile
 *   - 已登入:網頁導轉到此頁
 *   - 未登入:LINE Login redirect到此頁
 * 2.去檢測ct 
 *   - 有  : 送出打卡資訊
 *   - 沒有: 到活動地圖頁面
 */
import { ref, computed } from 'vue'
// import { useRouter } from 'vue-router'
import { useLIFF } from '@/composable/useLIFF'
import { useFetchData } from '@/composable/useFetch'
import type { ActivityListType, ProfileType } from '@/composable/configurable'
const props = defineProps<{
  content: ActivityListType
}>()

const { getLineProfile } = useLIFF()
const { verifyQRCode, commitStoreCheckIn } = useFetchData()
const userProfile = ref<ProfileType>({})
// const router = useRouter()
const enterActivity = async () => {
  try {
    const profile: ProfileType | undefined = await getLineProfile()
    userProfile.value = profile || {}
    const userId = profile && profile.userId ? profile.userId : ''
    const verifyRes = await verifyQRCode()
    if (verifyRes) {
      const commitRes = await commitStoreCheckIn(userId)
      console.log(commitRes);
      // 打卡成功或失敗
      // 換頁到打卡結果頁面並帶session結果給下一頁
      // router.push({ 
      // path: '/result'
      // })
    }
  } catch (error) {
    // 異常
    console.error(error);
    // 顯示提示錯誤dialog
    // 倒數10秒reset
  }
}
// const content = computed(() => props.content)

</script>

<template>
  <main class="event">
    <h1>活動詳情頁面</h1>
    <section class="event_time">
      <div>4.16</div>
      <div>6.30</div>
    </section>

    <section>
      <h2>活動辦法</h2>
      <p>
        2021河濱自行車挑戰認證，分為「環騎台北」及「小鴨慢騎」2組，並精選數個環繞河濱的指定打卡點，活動時間自11月6日起至12月5日止，無論白天黑夜，只需透過手機就能自由報名參加。依著活動網頁指示，集滿指定數量打卡點，即可獲得電子完騎證明與專屬紀念品乙份。
      </p>
      <p>此活動不需要載任何App，直接Mobile Web就可以直接執行掃描QRCode，GPS定位，打卡等功能。</p>
      <p>此外為鼓勵民眾多多參與2021河濱自行車挑戰認證，特別與進駐河濱公園的商家合作舉辦「集點抽獎」活動，參加者就有機會抽中iPhone 13乙台。心動不如馬上行動，趕快踏上自行車，來趟環騎挑戰之旅吧。</p>
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
    <!-- {{ content }} -->
  </main>
</template>

<style lang="scss" scoped>
.event {
  flex-direction: column;

  section {}

  @media (min-width: 1024px) {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
