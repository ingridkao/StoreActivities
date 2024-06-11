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

import emptyStampImg from '@/assets/images/album/empty-stamp.png'
import checkedStampImg from '@/assets/images/album/checked-stamp.svg'

const { fetchAlbumData } = useFetchData()
const { errorAlert, openStoreInfo } = useSweetAlert()

const stampBaseCount = 20
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
  } catch (error) {
    errorAlert(String(error))
  }
  layoutStore.loadToggle(false)
})
</script>

<template>
  <main class="commom album">
    <HeaderMenu />
    <div>
      <div class="album__header">
        <h5 class="album__header--title">目前累積搜集門市</h5>
        <div class="album__header--info">
          <p>{{ accumulation }}<span>家</span></p>
        </div>
      </div>
      <div class="album__body">
        <div class="album__body--stamp" v-for="(baseItem, index) in stampBaseCount" :key="baseItem">
          <button
            v-if="albumStore[index]"
            class="album__body--stamp-wrapper"
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
              class="album__body--stamp-text"
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
    </div>
  </main>
</template>

<style lang="scss" scope>
.album {
  background: url('@/assets/images/album/bg.png');
  overflow: auto;
  > div {
    padding-bottom: 1.5rem;
  }

  &__header {
    width: 336px;
    height: 188px;
    background: url('@/assets/images/album/main-cat.png') no-repeat center;
    background-size: contain;
    margin: auto;
    margin-top: 38px;
    margin-bottom: 16px;

    &--title {
      color: #fff;
      padding-top: 30px;
      padding-left: 17px;
      padding-bottom: 4px;
    }

    &--info {
      background: url('@/assets/images/album/main-dialog.svg') no-repeat center;
      background-size: contain;
      width: 190px;
      height: 82px;
      font-weight: 700;
      color: #5f5d5d;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        font-size: 40px;
        transform: translateX(-15px);
      }

      span {
        font-size: 20px;
        margin-left: 6px;
      }
    }
  }

  &__body {
    display: grid;
    gap: 12px;
    padding: 0 20px;
    margin-bottom: 16px;
    grid-template-columns: repeat(4, 1fr);

    &--stamp {
      &-wrapper {
        position: relative;
      }

      &-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 28px;
        text-align: left;
        line-height: 120%;
        font-weight: 700;

        &.three-characters {
          font-size: 22px;
          padding: 0 6px;
        }

        &.four-characters {
          text-align: center;
          font-size: 26px;
          padding: 0 10px;
        }

        &.five-characters {
          font-size: 22px;
          padding: 0 6px;
        }

        &.six-characters {
          text-align: center;
          font-size: 22px;
          padding: 0 6px;
        }
      }
    }
  }
}
</style>
