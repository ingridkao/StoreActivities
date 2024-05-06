<script setup lang="ts">
/**
 * 測試環境會被導轉到line登入頁14, 23-27註解就可以避免被轉址
 */
import { ref, onMounted, watchEffect } from 'vue'
import { RouterLink, onBeforeRouteLeave  } from 'vue-router'
import { useLIFF } from '@/composable/useLIFF'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const { getAcStorage, deleteSessionStorage } = useBrowserStorage()
const { 
  getOpenInClient, useLineLogout, 
  // getLineProfileAndAccessToken,
} = useLIFF()
const openInLIFF = getOpenInClient()
const userProfile = ref()
const accessToken = ref()
const props = defineProps<{
  knowActivity: boolean
}>()

onMounted(async() => {
  // const userData = await getLineProfileAndAccessToken()
  // if(userData){
  //   userProfile.value = userData.profile
  //   accessToken.value = userData.accessToken
  // }
})

onBeforeRouteLeave((to) => {
  if (to.name === 'Lobby') {
		deleteSessionStorage('ac')
  }
})

const navOpen = ref<Boolean>(false)
const togggle = () => {
  navOpen.value = !navOpen.value
}
const menuList = ref<
  {
    link?: string
    key?: string
    name?: string
}[]>([          {
  link: '/',
  key: 'Lobby',
  name: '活動大廳'
}])
  
watchEffect(
  () => {
    if(props.knowActivity && userProfile.value){
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
  }
)

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
        <div v-if="userProfile" class="userProfile">
          <img
            v-if="userProfile.pictureUrl"
            :src="userProfile.pictureUrl"
            :alt="userProfile.displayName"
          />
          <div>
            <p>{{ userProfile.displayName || '' }}</p>
            <p>{{ userProfile.userId || '' }}</p>
            <hr />
            <p>{{ accessToken || '' }}</p>
            <button v-if="!openInLIFF" @click="useLineLogout">登出</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
%line {
  display: block;
  width: 24px;
  height: 1px;
  background: white;
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

    &.active {
      .sidemenu__btn--top {
        background: black;
      }

      .sidemenu__btn--mid {
        background: black;
      }

      .sidemenu__btn--bottom {
        background: black;
      }
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
