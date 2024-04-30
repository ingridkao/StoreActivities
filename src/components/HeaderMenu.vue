<script setup lang="ts">
/**
 * 測試環境會被導轉到line登入頁14, 23-27註解就可以避免被轉址
 */
import { ref, onMounted, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLink } from '@/composable/useLink'
import { useLIFF } from '@/composable/useLIFF'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const { getAcStorage } = useBrowserStorage()
const { linkToLobby } = useLink()
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

  const navOpen = ref<Boolean>(false)
  const togggle = () => {
    navOpen.value = !navOpen.value
  }
  const menuList = ref<{
    link?: string
    key?: string
    name?: string
  }[]>([])
  
  watchEffect(
    () => {
      if(props.knowActivity && userProfile.value){
        const acString = getAcStorage()
        menuList.value = [
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
      }else{
        menuList.value = []
      }
    }
  )

</script>

<template>
  <div id="sidemenu" class="mainheader">
    <button class="sidemenu__btn" @click="togggle" :class="{ active: navOpen }">
      <span class="top"></span>
      <span class="mid"></span>
      <span class="bottom"></span>
    </button>

    <transition name="translateX">
      <nav v-show="navOpen">
        <div class="sidemenu__wrapper">
          <ul class="sidemenu__list">
            <li class="sidemenu__item" v-for="item in menuList" :key="item.key">
              <RouterLink v-if="item.link" :to="item.link">{{ item.name }}</RouterLink>
            </li>
            <li class="sidemenu__item">
              <button @click="linkToLobby">回到活動大廳</button>
            </li>
          </ul>
        </div>
        <div v-if="userProfile" class="userProfile">
          <img v-if="userProfile.pictureUrl" :src="userProfile.pictureUrl" :alt="userProfile.displayName">
          <div>
            <p>{{ userProfile.displayName || '' }}</p>
            <p>{{ userProfile.userId || '' }}</p>
            <hr>
            <p>{{ accessToken || '' }}</p>
            <button v-if="!openInLIFF" @click="useLineLogout">登出</button>
          </div>
        </div>
      </nav>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#sidemenu {
  nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 200px;
    height: 100vh;
    background: grey;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: column;

    overflow: hidden;
  }

  .sidemenu {
    &__btn {
      display: block;
      width: 50px;
      height: 50px;
      background: grey;
      border: none;
      position: relative;
      z-index: 100;
      appearance: none;
      cursor: pointer;
      outline: none;

      span {
        display: block;
        width: 20px;
        height: 2px;
        margin: auto;
        background: white;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all 0.4s ease;

        &.top {
          transform: translateY(-8px);
        }

        &.bottom {
          transform: translateY(8px);
        }
      }

      &.active {
        .top {
          transform: rotate(-45deg);
        }

        .mid {
          transform: translateX(-20px) rotate(360deg);
          opacity: 0;
        }

        .bottom {
          transform: rotate(45deg);
        }
      }
    }

    &__wrapper {
      width: 100%;
      padding-top: 4.5rem;
    }

    &__list {
      padding-top: 4.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__item {
      a,
      button {
        width: 100%;
        line-height: 2rem;
        font-size: 1.25rem;
        padding: 0.5rem 1rem;
        display: block;
        color: white;
        transition: 0.4s ease;
        text-align: center;
        &:hover {
          background: lightgrey;
          color: dimgrey;
        }
      }
      a {
        text-decoration: none;
      }
      button {
        background: transparent;
        outline: none;
        border: none;
      }
    }
  }
}

.translateX-enter {
  transform: translateX(-200px);
  opacity: 0;
}

.translateX-enter-active,
.translateX-leave-active {
  transform-origin: top left 0;
  transition: 0.2s ease;
}

.translateX-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}
</style>
