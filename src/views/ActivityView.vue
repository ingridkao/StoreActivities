<script setup lang="ts">
/**
 * 確認是否為進行中活動
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ActivitiesContent from '@/components/activity/ActivitiesContent.vue';
import HeaderMenu from '@/components/HeaderMenu.vue';

import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const router = useRouter()
const { confirmActivity } = useFetchData()
const { getAcString } = useBrowserStorage()
const acStr = getAcString()
const content = ref({})

onMounted(() => {
    confirmActivity(Number(acStr)).then(async (res) => {
        if (typeof res === 'object') {
            content.value = res
        } else if (res === 2) {
            router.push({ path: '/wrapup' })
        } else {
            router.push({ name: 'ComingSoon' })
        }
    })
})

</script>

<template>
    <HeaderMenu />
    <ActivitiesContent :content="content" />
</template>

<style lang="scss" scoped></style>
