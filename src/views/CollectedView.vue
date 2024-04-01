<script setup lang="ts">
/**
 * 活動蒐集列表
 * 請求所有|打卡紀錄?
 */
import { reactive } from 'vue'
import HeaderMenu from '@/components/HeaderMenu.vue';

interface CollectedListType {
  store_id?: string;
  store_name?: string;
  checkInTime?: string;
}
const collectedStore = reactive<CollectedListType[]>([
  {
    store_id: '870504',
    store_name: '道生',
    checkInTime: '2024/01/12 09:12'
  },
  {
    store_id: '240709',
    store_name: '威京',
    checkInTime: '2024/01/15 19:12'
  }
])

</script>

<template>
  <HeaderMenu />
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
      <div v-for="storeItem in collectedStore" :key="storeItem['store_id']" class="collected_item">
        <div class="imgBox">
          <img src="~@/assets/images/7-11logo.jpg" :alt="storeItem['store_name']" />
        </div>
        <div class="contenBox">
          <p>門市：{{ storeItem['store_id'] }} {{ storeItem['store_name'] }}</p>
          <p>最後打卡時間：{{ storeItem['checkInTime'] }}</p>
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