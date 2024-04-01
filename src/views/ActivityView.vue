<script setup lang="ts">
/**
 * 1. 已登入:網頁導轉
 * 2. 未登入:LINE Login redirect回來去檢測ct和ac 
 * 有ac >> 導轉到活動詳情頁面
 */
// import { ref, onMounted } from 'vue'
import ActivitiesContent from '@/components/activity/ActivitiesContent.vue';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { useLIFF } from '@/composable/useLIFF'
import { useBrowserStorage } from '@/composable/useBrowserStorage'

const { getAcString, getCtString } = useBrowserStorage()
const acStr = getAcString()
const ctStr = getCtString()

const { externalBrowserLogin } = useLIFF()
const enterActivity = () => {
    externalBrowserLogin(ctStr, acStr)
}

// todo: 判斷活動是否還未開始或是逾期
// onMounted(() => {
// })
</script>

<template>
    <HeaderMenu />
    <ActivitiesContent @enter="enterActivity" />
</template>

<style lang="scss" scoped></style>
