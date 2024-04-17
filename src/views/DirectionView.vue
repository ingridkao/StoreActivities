<script setup lang="ts">
/**
 * 打卡教學
 * step1.取得LINE user profile
 *       - 已登入:繼續step2
 *       - 未登入:LINE Login redirect到活動說明頁面
 * step2.開啟打卡頁面|功能
 */
import HeaderMenu from '@/components/HeaderMenu.vue'
import { useLIFF } from '@/composable/useLIFF'
const { scanCode } = useLIFF()
const startScanning = async () => {
  try {
    await scanCode()
  } catch (error) {
    // 異常
    console.error(error)
    // 顯示提示錯誤dialog
    // 倒數10秒reset
  }
}
</script>

<template>
  <HeaderMenu />
  <main>
    <section>
      <!-- 步驟 -->
    </section>

    <section>
      <button @click="startScanning">我要打卡</button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
