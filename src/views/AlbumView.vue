<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { AlbumType } from '@/types/ResponseHandle'

import emptyStampImg from '@/assets/images/stamp/empty1.png'
import checkedStampImg from '@/assets/images/stamp/checked.svg'
import HeaderMenu from '@/components/HeaderMenu.vue'

import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'
const { fetchAlbumData } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()
const layoutStore = useLayoutStore()

const albumStore = ref<AlbumType[]>([])
const accumulation = computed(() => {
  if (albumStore.value.length === 0) return '0000'
  const numberStr = String(albumStore.value.length)
  return numberStr.padStart(5 - numberStr.length, '0')
})
const stampBaseCount = computed(() => {
  const albumCount = albumStore.value.length
  if (albumCount <= 24) return 24
  return (Math.round((albumCount - 24) / 4) + 6) * 8
})

onMounted(async () => {
  try {
    layoutStore.loadToggle(true)
    const res = await fetchAlbumData()
    albumStore.value = res && res.historyList ? res.historyList : []
    layoutStore.loadToggle(false)
  } catch (error) {
    errorAlert(String(error))
    layoutStore.loadToggle(false)
  }
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
          <div class="stamp-count" v-if="albumStore[index]['storeTimes'] > 1">
            {{ albumStore[index]['storeTimes'] >= 99 ? 99 : albumStore[index]['storeTimes'] }}
          </div>
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
    height: 11.75rem;
    margin-top: 2rem;
    margin-bottom: 1rem;

    @extend %imgContainer;
    background-image: url('@/assets/images/cat/fish-cat.png');

    &--title {
      color: $white;
      padding-top: 1.875rem;
      padding-left: 1rem;
      padding-bottom: 0.25rem;
    }

    &--info {
      @extend %flexRowInfo;
      @extend %imgContainer;
      background-image: url('@/assets/images/album/main-dialog.svg');
      width: 11.875rem;
      height: 5.125rem;
      p {
        color: $gray1;
        font-weight: 700;
        font-size: 2.5rem;
        margin-right: 1rem;
      }
      span {
        font-size: 1.25rem;
        margin-left: 0.5rem;
      }
    }
  }

  &__body {
    @extend %stampSection;
  }
}

.stamp {
  &-count {
    @extend %flexRowInfo;
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: $orange1;
    color: $whitePure;
    border-radius: 1.5rem;
  }
}
</style>
