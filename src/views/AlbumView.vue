<script setup lang="ts">
/**
 * 所有打卡紀錄
 */
  import { ref, onMounted } from 'vue'

  import type { AlbumType } from '@/composable/configurable'
  import { useFetchData } from '@/composable/useFetch'
  import { useSweetAlert } from '@/composable/useSweetAlert'
  import { useLink } from '@/composable/useLink'
  import { useLoadingStore } from '@/stores/loading'
  const { linkToCollect } = useLink()

  const storeIcon = new URL('@/assets/images/7-11logo.jpg', import.meta.url).href
  const footImportUrl = new URL('@/assets/images/cats/foot.png', import.meta.url).href

  const { fetchAlbumData } = useFetchData()
  const { errorAlert } = useSweetAlert()

  const loadStore = useLoadingStore()
  const albumStore = ref<AlbumType[]>([])
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

</script>

<template>
  <main>
    <section class="album">
      <div 
        v-for="albumItem in albumStore" 
        :key="albumItem.event_id" 
      >
        <div class="album_title">
          <h6>{{ albumItem.event_name || '打卡活動' }}</h6>
          <button @click="linkToCollect(albumItem)">></button>
        </div>
        <div class="album_base">
          <div 
            v-for="albumBase in albumItem.limit" 
            :key="albumBase"
            :style="{backgroundImage:`url('${footImportUrl}')`}"
          >
            <div v-if="albumItem.collection && albumItem.collection >= albumBase" >
              <img :src="storeIcon" alt="已打卡" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

</template>

<style lang="scss" scope>
.album{
  width: 100%;
  &_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &_base{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    >div{
      width: 5rem;
      height: 5rem;
      margin: 0.25rem;
      flex: 1 0 auto;
      background-color: #ddd;
      background-size: contain;
      >div{
        display: flex;
        align-items: center;
        height: 100%;
        img{
          width: 100%;
        }
      }
    }
  }
}
</style>