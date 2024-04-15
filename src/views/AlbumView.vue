<script setup lang="ts">
/**
 * 所有打卡紀錄
 */
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
// import HeaderMenu from '@/components/HeaderMenu.vue'

import type { CollectedListType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'
const { fetchCollectData } = useFetchData()

const collectedStore = ref<CollectedListType[]>([])
const { proxy } = getCurrentInstance()
const stampBaseCount = ref(20)
onMounted(async () => {
  try {
    const res = await fetchCollectData()
    collectedStore.value = res || []
  } catch (error) {
    proxy.$swal.fire({
      icon: "error",
      title: '出了一點問題',
      text: error
    })
  }
})

const accumulation = computed(() => {
  const numberStr = String(collectedStore.value.length)
  return numberStr.padStart( 5 - numberStr.length, "0")
})

const storeIcon = new URL('@/assets/images/7-11logo.jpg', import.meta.url).href
const catImportUrl = new URL('@/assets/images/cats/cat1.png', import.meta.url).href
const footImportUrl = new URL('@/assets/images/cats/foot.png', import.meta.url).href
const linkTo = async (storeItem:CollectedListType) => {
  if (storeItem.store_id) {
    proxy.$swal.fire({
      html: `
        <div class="imgBox">
          <img src="${catImportUrl}" alt="喵喵人"/>
        </div>
        <div class="textBox">
          <h6>${storeItem.store_name || '7-11'}門市</h6>
          <p>最後打卡時間</p><p>${storeItem.checkInTime}</p>
        </div>
      `,
      imageUrl: storeIcon,
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: `${storeItem.store_name}門市`,
      showCloseButton: true,
      showConfirmButton: false,
      customClass:{
        //https://sweetalert2.github.io/#customClass
        htmlContainer: 'cat'
      }
    })
  } else {
    proxy.$swal.fire({
      icon: "error",
      title: '出了一點問題'
    })
  }
}
</script>

<template>
  <!-- <HeaderMenu /> -->
  <main>

    <section class="info">
      <div>
        <h5>目前累積蒐集門市</h5>
        <div>
          <p>
            {{ accumulation }}
            <span>家</span>
          </p>
        </div>
      </div>
      <div class="info_img">
        <img :src="catImportUrl" alt="喵喵人" />
      </div>
    </section>

    <section class="stamp">
      <div 
        v-for="baseItem in stampBaseCount" 
        :key="baseItem" 
        class="stamp_base"
        :style="{backgroundImage:  `url('${footImportUrl}')`}"
      >
        <button 
          v-if="collectedStore[baseItem-1] && collectedStore[baseItem-1]['store_id']" 
          @click="linkTo(collectedStore[baseItem-1])"
        >
          <img :src="storeIcon" :alt="collectedStore[baseItem-1]['store_name']" />
        </button>
      </div>
    </section>

  </main>

</template>
<style lang="scss" scope>
img{
  width: 100%;
}

.info{
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &_img{
    width: 40%;
  }
}
.stamp{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap; 
  &_base{
    color: white;
    text-align: center;
    align-items: center;
    width: 5rem;
    height: 5rem;
    margin: 0.25rem;
    flex: 1 0 auto;
    background-color: #ddd;
    background-size: contain;
    button{
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
}
</style>

<style lang="scss">
// For sweetalert2 custom class
.cat{
  &.swal2-html-container{
    display: flex !important;
    flex-direction: row;
    position: relative;
    background-color: #ddd;
    overflow: visible;
    .imgBox{
      position: absolute;
      top: -5rem;
      left: 0;
      width: 10rem;
      img{
        width: 100%;
      }
    }
    .textBox{
      height: 5rem;
    }
  }
}
</style>