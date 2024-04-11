<script setup lang="ts">
/**
 * 單一活動打卡紀錄
 * 集郵簿
 */
import { ref, onMounted, watchEffect  } from 'vue'
import { useRoute } from 'vue-router'

// import HeaderMenu from '@/components/HeaderMenu.vue';

// import { useFetchData } from '@/composable/useFetch'
// import { useURL } from '@/composable/useURL'
// const { getQueryParam } = useURL()
// const acStr = getQueryParam(window.location.pathname, 'ac')

const route = useRoute()
console.log(0);

watchEffect(
    async () => {
        const { id } = route.params
        console.log(id);
        // userData.value = await fetchUser(id)
    }
)

console.log(2);
onMounted(() => {
    console.log('onMounted');
})

</script>

<template>
    <!-- <HeaderMenu /> -->
    <div>單一活動打卡紀錄</div>
</template>

<style lang="scss" scoped></style>
