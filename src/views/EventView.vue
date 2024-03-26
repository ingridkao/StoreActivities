<script setup lang="ts">
/**
 * 活動詳情頁面
 * 1. 檢測是否為進行中活動
 *    false >>> coming soon | Wrap up
 * 2. 確認LINE login
 *    true  >>> 有userdata且有ct送出打卡
 *    false >>> 點擊按鈕觸發LINE Login
 */

// import { RouterLink } from 'vue-router';
// import CameraBtn from '@/components/button/CameraBtn.vue';
import { useLIFF } from '@/composable/useLIFF'
const { message, error, isLoggedIn } = useLIFF()

</script>

<template>
  <div>
    <p v-if="message">{{ message }}</p>
    <p v-if="error">
      <code>{{ error }}</code>
    </p>
    {{ isLoggedIn }}
  </div>

  <div class="event">
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
      <!-- Line登入 -->
      <button>進入活動</button>
      <!-- <RouterLink to="/mapStore">門市地圖查詢</RouterLink> -->
      <!-- <RouterLink to="/scan">進入活動</RouterLink> -->
    </section>
  </div>
</template>

<style lang="scss" scoped>
.event {
  section {}

  @media (min-width: 1024px) {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
