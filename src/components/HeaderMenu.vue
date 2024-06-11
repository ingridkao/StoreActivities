<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useLIFF } from '@/composable/useLIFF'
import { useUserStore } from '@/stores/user'
import { useLayoutStore } from '@/stores/layout'

const userStore = useUserStore()
const layoutStore = useLayoutStore()
const { getOpenInClient, useLineLogout } = useLIFF()
const openInLIFF = getOpenInClient()
const menuList = ref<
  {
    link?: string
    key?: string
    name?: string
  }[]
>([])

const route = useRoute()
const activityId = route?.params?.id
watchEffect(() => {
  if (activityId && Object.keys(userStore.userProfile).length > 0) {
    menuList.value = [
      { link: '/mapStore', key: 'MapStore', name: '門市地圖' },
      { link: `/collected/${activityId}`, key: 'Collected', name: '活動打卡紀錄' }
    ]
  }
})

const router = useRouter()
const goToActivityInfo = () => {
  if (route.name === 'Activity') {
    layoutStore.toggleDirection(false)
    layoutStore.closeNav()
  } else if (activityId) {
    router.push({
      name: 'Activity',
      params: {
        id: activityId
      }
    })
  }
}
</script>

<template>
  <aside class="sidemenu">
    <div
      class="sidemenu__btn"
      @click="layoutStore.toggleNav()"
      :class="{ active: layoutStore.navOpen }"
    >
      <span class="sidemenu__btn--top"></span>
      <span class="sidemenu__btn--mid"></span>
      <span class="sidemenu__btn--bottom"></span>
    </div>

    <transition name="fade">
      <div v-show="layoutStore.navOpen" class="sidemenu__wrapper">
        <RouterLink to="/" class="sidemenu__item">活動大廳</RouterLink>
        <button v-if="layoutStore.showDirection" @click="goToActivityInfo" class="sidemenu__item">
          活動說明
        </button>
        <RouterLink
          v-for="item in menuList"
          :to="item.link ?? '/'"
          :key="item.key"
          class="sidemenu__item"
        >
          {{ item.name }}
        </RouterLink>
        <RouterLink to="/album" class="sidemenu__item">過去活動紀錄</RouterLink>

        <!--TODO: keep user info block and wait for the PM to confirm the requirements. -->
        <div
          v-if="Object.keys(userStore.userProfile).length > 0"
          class="sidemenu__item sidemenu__avendar"
        >
          <img
            v-if="userStore.userProfile.pictureUrl"
            :src="userStore.userProfile.pictureUrl"
            :alt="userStore.userProfile.displayName"
          />
          <div>
            <p>{{ userStore.userProfile.displayName || '' }}</p>
            <button v-if="!openInLIFF" class="sidemenu__button" @click="useLineLogout">登出</button>
          </div>
        </div>
      </div>
    </transition>
  </aside>
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
  z-index: 9;

  &__btn {
    position: absolute;
    width: 24px;
    height: 22px;
    top: 28px;
    left: 21px;
    z-index: 21;

    cursor: pointer;
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
    z-index: 8;
    width: 168px;
    height: auto;
    padding: 88px 20px 28px 30px;
    background-color: white;
  }

  &__item {
    display: block;
    width: 100%;
    padding: 10px 0;

    text-align: left;
    color: black;
    font-size: 18px;
    line-height: 100%;

    border-bottom: 1px solid #c3c3c3;
    text-decoration: none;

    &.router-link-active {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  &__avendar {
    display: inline-flex;
    align-items: center;
    margin-top: 3rem;
    gap: 3px;
    > img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    > div {
      font-size: 12px;
    }
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
