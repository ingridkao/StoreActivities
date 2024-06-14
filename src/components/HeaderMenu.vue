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
  if (Object.keys(userStore.userProfile).length > 0) {
    if (activityId) {
      menuList.value = [
        { link: `/collected/${activityId}`, key: 'Collected', name: '活動打卡紀錄' },
        { link: `/mapStore/${activityId}`, key: 'MapStore', name: '活動門市地圖' }
      ]
    } else {
      menuList.value = [{ link: '/mapStore', key: 'MapStore', name: '門市地圖' }]
    }
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
    <button
      class="sidemenu__btn"
      @click="layoutStore.toggleNav()"
      :class="[{ close: layoutStore.navOpen }, route.name]"
    >
      <span class="sidemenu__btn--top"></span>
      <span class="sidemenu__btn--mid"></span>
      <span class="sidemenu__btn--bottom"></span>
    </button>

    <transition name="fade">
      <div v-show="layoutStore.navOpen" class="sidemenu__wrapper">
        <button v-if="layoutStore.showDirection" class="sidemenu__item" @click="goToActivityInfo">
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

        <br />
        <RouterLink to="/" class="sidemenu__item">活動大廳</RouterLink>
        <RouterLink to="/album" class="sidemenu__item last">門市打卡紀錄</RouterLink>

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
  height: 2px;
  background: $black1;
  transition: all 0.3s ease;
  margin-bottom: 6px;
}

.sidemenu {
  @extend %fixedSection;
  z-index: 9;

  &__btn {
    position: absolute;
    width: 24px;
    height: 22px;
    top: 28px;
    left: 21px;
    z-index: 21;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
    &--top {
      @extend %line;
    }
    &--mid {
      @extend %line;
      width: 16px;
    }
    &--bottom {
      @extend %line;
    }
    &.Activity {
      .sidemenu__btn--top,
      .sidemenu__btn--mid,
      .sidemenu__btn--bottom {
        background: $whitePure;
      }
    }
    &.close {
      .sidemenu__btn--top {
        background: $black1;
        transform: translateY(8px) rotate(45deg);
      }
      .sidemenu__btn--mid {
        background: $black1;
        width: 0;
      }
      .sidemenu__btn--bottom {
        background: $black1;
        transform: translateY(-8px) rotate(-45deg);
      }
    }
  }

  &__wrapper {
    @extend %fixedSection;
    z-index: 8;
    width: 168px;

    height: auto;
    padding: 88px 20px 28px 30px;
    background-color: $whitePure;
  }

  &__item {
    display: block;
    width: 100%;
    padding: 10px 0;

    text-align: left;
    font-weight: bold;
    color: $black;
    font-size: 18px;
    line-height: 100%;

    border-bottom: 1px solid $white2;

    &.last {
      border-bottom: none;
    }
  }

  &__avendar {
    @extend %flexColInfo;
    margin-top: 3rem;
    gap: 3px;
    > img {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      margin-bottom: 0.5rem;
    }
    > div {
      text-align: center;
    }
  }
}
</style>
