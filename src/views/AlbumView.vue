<script setup lang="ts">
/**
 * 門市打卡紀錄
 * 確認LINE login(router.beforeEach判斷)
 */
import { ref, onMounted, computed } from 'vue'

import HeaderMenu from '@/components/HeaderMenu.vue'
import type { AlbumType } from '@/types/ResponseHandle'
import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'

import emptyStampImg from '@/assets/images/stamp/empty1.png'
import checkedStampImg from '@/assets/images/stamp/checked.svg'

const { fetchAlbumData } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()

const stampBaseCount = ref(20)
const albumStore = ref<AlbumType[]>([])

const accumulation = computed(() => {
  if (albumStore.value.length === 0) return '0000'
  const numberStr = String(albumStore.value.length)
  return numberStr.padStart(5 - numberStr.length, '0')
})

const layoutStore = useLayoutStore()
onMounted(async () => {
  layoutStore.loadToggle(true)
  try {
    const res = await fetchAlbumData()
    albumStore.value = res && res.historyList ? res.historyList : []
    const albumCount = albumStore.value.length
    if(albumCount > stampBaseCount.value){
      stampBaseCount.value =(Math.round((albumCount - 20)/4) + 6)*4
    }
  } catch (error) {
    errorAlert(String(error))
  }
  layoutStore.loadToggle(false)
})
</script>

<template>
  <main class="album">
    <HeaderMenu />
    <div class="album__header">
      <h5 class="album__header--title">目前累積搜集門市</h5>
      <div class="album__header--info">
        <p>{{ accumulation }}<span>家</span></p>
      </div>
    </div>
    <div class="album__body">
      <div class="stamp" v-for="(baseItem, index) in stampBaseCount" :key="baseItem">
        <button
          v-if="albumStore[index]"
          class="stamp-wrapper"
          @click="
            () =>
              openStoreInfo({
                countShow: true,
                storeName: albumStore[index]['storeName'],
                imageUrl: albumStore[index]['iconFilePath'],
                lastCheckInTime: albumStore[index]['checkinTime'],
                count: albumStore[index]['storeTimes']
              })
          "
        >
          <p
            class="stamp-text"
            :class="{
              'three-characters': albumStore[index]['storeName']?.length === 3,
              'four-characters': albumStore[index]['storeName']?.length === 4,
              'five-characters': albumStore[index]['storeName']?.length === 5,
              'six-characters': albumStore[index]['storeName']?.length === 6
            }"
          >
            {{ albumStore[index]['storeName'] }}
          </p>
          <img :src="checkedStampImg" alt="checked stamp" />
        </button>
        <img v-else :src="emptyStampImg" alt="empty stamp" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scope>
.album {
  @extend %pageMain;
  background: url('@/assets/images/bg/pink.png');
  overflow: auto;

  &__header {
    @extend %mainSection;
    max-width: $content-small;
    height: 188px;
    margin-top: 38px;
    margin-bottom: 16px;

    @extend %imgContainer;
    background-image: url('@/assets/images/cat/fish-cat.png');

    &--title {
      color: $white;
      padding-top: 30px;
      padding-left: 17px;
      padding-bottom: 4px;
    }

    &--info {
      @extend %flexRowInfo;
      @extend %imgContainer;
      background-image: url('@/assets/images/album/main-dialog.svg');
      width: 190px;
      height: 82px;
      p {
        color: $gray1;
        font-weight: 700;
        font-size: 40px;
        margin-right: 15px;
      }
      span {
        font-size: 20px;
        margin-left: 6px;
      }
    }
  }

  &__body {
    @extend %stampSection;
  }
}
</style>
