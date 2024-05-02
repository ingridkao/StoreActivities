<script setup lang="ts">
/**
 * 所有打卡紀錄
 * API待後端開發完成
 */
import { ref, onMounted, computed } from 'vue'
  import HeaderMenu from '@/components/HeaderMenu.vue'
  import type { AlbumType } from '@/composable/configurable'
  import { useFetchData } from '@/composable/useFetch'
  import { useSweetAlert } from '@/composable/useSweetAlert'
  import { useLink } from '@/composable/useLink'
  import { useLoadingStore } from '@/stores/loading'

const { linkToCollect } = useLink()
  const { fetchAlbumData } = useFetchData()
const { errorAlert, storeInfoAlert } = useSweetAlert()

  const loadStore = useLoadingStore()
  const albumStore = ref<AlbumType[]>([])

  const accumulation = computed(() => {
    let storeCount = 0
    albumStore.value.map(item=>{
      storeCount += Number(item.collection)
    })
    if(storeCount === 0)return '0000'
    const numberStr = String(storeCount)
    return numberStr.padStart(5 - numberStr.length, '0')
  })

  onMounted(async () => {
    loadStore.toggle(true)
    try {
      const res = await fetchAlbumData()
      albumStore.value = res || []
      loadStore.toggle(false)
    } catch (error) {
      const errorStr = String(error)
      errorAlert(errorStr)
      loadStore.toggle(false)
    }
  })

const footImportUrl = new URL('@/assets/images/cats/foot.png', import.meta.url).href
const catImportUrl = new URL('@/assets/images/cats/cat1.png', import.meta.url).href
const storeIcon = new URL('@/assets/images/7-11logo.jpg', import.meta.url).href
const openStoreInfo = async () => {
  storeInfoAlert({}, catImportUrl, storeIcon)
}

</script>

<template>
  <HeaderMenu :knowActivity="false"/>

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
  
    <section class="album">
      <!-- API待後端開發完成，可覆蓋此區域 -->
      <div v-for="albumItem in albumStore" :key="albumItem.event_id">
        <div class="album_title">
          <h6>{{ albumItem.event_name || '打卡活動' }}</h6>
          <button @click="linkToCollect(albumItem)">></button>
        </div>
        <div class="album_base">
          <div
            v-for="albumBase in albumItem.limit"
            :key="albumBase"
            :style="{ backgroundImage: `url('${footImportUrl}')` }"
          >
            <button v-if="albumItem.collection && albumItem.collection >= albumBase" @click="openStoreInfo">
              <img :src="storeIcon" alt="已打卡" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scope>
img {
  width: 100%;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 22rem;
  &_img {
    width: 40%;
  }
}
.album{
  width: 100%;
  max-width: 22rem;
  &_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &_base {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > div {
      width: 5rem;
      height: 5rem;
      margin: 0.25rem;
      flex: 1 0 auto;
      background-color: #ddd;
      background-size: contain;
      > div {
        display: flex;
        align-items: center;
        height: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>

<style lang="scss">
// For sweetalert2 custom class
.cat {
  &.swal2-html-container {
    display: flex !important;
    flex-direction: row;
    position: relative;
    background-color: #ddd;
    overflow: visible;
    .imgBox {
      position: absolute;
      top: -5rem;
      left: 0;
      width: 10rem;
      img {
        width: 100%;
      }
    }
    .textBox {
      height: 5rem;
    }
  }
}
</style>

