<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLIFF } from '@/composable/useLIFF'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { getAcStorage } = useBrowserStorage()
const { getOpenInClient, useLineLogout } = useLIFF()
const openInLIFF = getOpenInClient()
const props = defineProps<{
  knowActivity: boolean
}>()

const navOpen = ref<Boolean>(false)
const togggle = () => {
  navOpen.value = !navOpen.value
}
const menuList = ref<
  {
    link?: string
    key?: string
    name?: string
  }[]
>([
  {
    link: '/',
    key: 'Lobby',
    name: '活動大廳'
  }
])

watchEffect(() => {
  if (props.knowActivity && userStore.userProfile) {
    const acString = getAcStorage()
    menuList.value = [
      ...menuList.value,
      {
        link: `/activity/${acString}`,
        key: 'Activity',
        name: '活動說明'
      },
      {
        link: '/mapStore',
        key: 'MapStore',
        name: '門市地圖'
      },
      {
        link: `/collected/${acString}`,
        key: 'Collected',
        name: '活動打卡紀錄'
      }
    ]
  }
})
</script>

<template>
  <div class="sidemenu">
    <div class="sidemenu__btn" @click="togggle" :class="{ active: navOpen }">
      <span class="sidemenu__btn--top"></span>
      <span class="sidemenu__btn--mid"></span>
      <span class="sidemenu__btn--bottom"></span>
    </div>

    <transition name="fade">
      <div v-show="navOpen" class="sidemenu__wrapper">
        <RouterLink
          v-for="item in menuList"
          :to="item.link ?? '/'"
          :key="item.key"
          class="sidemenu__item"
        >
          {{ item.name }}
        </RouterLink>
        <!--TODO: keep user info block and wait for the PM to confirm the requirements. -->
        <template v-if="userStore.userProfile.userId">
          <img
            v-if="userStore.userProfile.pictureUrl"
            :src="userStore.userProfile.pictureUrl"
            :alt="userStore.userProfile.displayName"
          />
          <div>
            <p>{{ userStore.userProfile.displayName || '' }}</p>
            <p>{{ userStore.userProfile.userId || '' }}</p>
          </div>
        </template>
        <button
          v-if="userStore.userProfile.userId && !openInLIFF"
          class="sidemenu__item sidemenu__button"
          @click="useLineLogout"
        >
          登出
        </button>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
%line {
  display: block;
  width: 24px;
  height: 1px;
  background: #000;
  transition: all 0.3s ease;
}

.sidemenu {
  position: fixed;
  top: 0;
  z-index: 999;

  &__btn {
    width: 24px;
    height: 22px;
    top: 28px;
    left: 21px;
    z-index: 21;
    position: absolute;

    &--top {
      @extend %line;
      transform: translateY(0);
    }

    &--mid {
      @extend %line;
      width: 16px;
      transform: translateY(6px);
    }

    &--bottom {
      @extend %line;
      transform: translateY(12px);
    }
  }

  &__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 168px;
    height: auto;
    padding: 88px 20px 28px 30px;
    background-color: white;
  }

  &__item {
    display: block;
    padding: 10px 0;
    color: black;
    text-decoration: none;
    font-size: 18px;
    line-height: 100%;
    border-bottom: 1px solid #c3c3c3;

    &:last-child {
      border-bottom: none;
    }
  }

  &__button {
    width: 100%;
    background-color: transparent;
    text-align: left;
    border: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
