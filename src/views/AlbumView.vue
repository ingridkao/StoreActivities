<script setup lang="ts">
/**
 * 所有活動打卡紀錄列表
 */
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
// import HeaderMenu from '@/components/HeaderMenu.vue';
import { useFetchData } from '@/composable/useFetch'

import type { CollectedListType } from '@/composable/configurable'
const { fetchCollectData } = useFetchData()

const collectedStore = ref<CollectedListType[]>([])
const { proxy } = getCurrentInstance()

onMounted(async () => {
  try {
    const res = await fetchCollectData()
    collectedStore.value = res || []
  } catch (error) {
    proxy.$swal.fire({
      icon: "error",
      title: '出了一點問題',
      text: error,
    })
  }
})

const router = useRouter()

const linkTo = async (id:string) => {
  if (id) {
    router.push({
      name: 'Collected',
      params: {
        id: id
      }
    })
  } else {
    router.push({ path: '/error' })
  }
}
</script>

<template>
  <!-- <HeaderMenu /> -->
  <main>
    <section v-if="collectedStore.length === 0">
      <h1>一起來蒐集吧</h1>
    </section>

    <section v-else class="collected">
      <div class="collected_info">
        放大圖示的img??
      </div>
      <div class="collected_text">
        <h6>累積蒐集門市數：{{ collectedStore.length }}家</h6>
      </div>
      <div v-for="storeItem in collectedStore" :key="storeItem['store_id']" class="collected_item" >
        <div @click="linkTo(storeItem['store_id'])">
          <div class="imgBox">
            <img src="~@/assets/images/7-11logo.jpg" :alt="storeItem['store_name']" />
          </div>
          <div class="contenBox">
            <p>門市：{{ storeItem['store_id'] }} {{ storeItem['store_name'] }}</p>
            <p>最後打卡時間：{{ storeItem['checkInTime'] }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.collected {
  box-sizing: border-box;
  padding: .75rem;

  &_info {}

  &_text {}

  &_item {
    width: 100%;
    display: flex;
    flex-direction: row;
    background: #fff;
    color: #555;
    box-sizing: content-box;
    margin-bottom: .5rem;

    .imgBox {
      width: 5.5rem;
      height: 5.5rem;

      img {
        width: 100%;
      }
    }

    .contenBox {
      padding: 1rem;
    }
  }
}
</style>