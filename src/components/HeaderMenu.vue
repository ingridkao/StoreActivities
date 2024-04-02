<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLIFF } from '@/composable/useLIFF'
const {
  getOpenInClient, getUserOS, getLineProfile,
  initLine, externalBrowserLogout
} = useLIFF()
const openInLIFF = getOpenInClient()
const userOS = getUserOS()
const userLoggedIn = ref()
const userProfile = ref()
onMounted(() => {
  initLine().then(res => {
    userLoggedIn.value = res || false
    getLineProfile().then(profile => {
      if (profile) {
        userProfile.value = profile
      }
    })
  })
})

const navOpen = ref<Boolean>(false)
const togggle = () => {
  navOpen.value = !navOpen.value
}
const menuList = ref([
  // {
  //   link: '/',
  //   key: 'lobby',
  //   name: '活動大廳'
  // },
  {
    link: '/activity',
    key: 'Activity',
    name: '活動說明'
  },
  {
    link: '/scan',
    key: 'scan',
    name: '我要打卡'
  },
  {
    link: '/mapStore',
    key: 'mapStore',
    name: '門市地圖'
  },
  {
    link: '/collected',
    key: 'collected',
    name: '集郵冊'
  },
])

</script>

<template>
  <div id="sidemenu" class="mainheader">
    <button class="sidemenu__btn" @click="togggle" :class="{ active: navOpen }">
      <span class="top"></span>
      <span class="mid"></span>
      <span class="bottom"></span>
    </button>
    <div>
      <p>{{ userLoggedIn ? '已登入' : '未登入' }}</p>
      <p>{{ userOS }}開啟|{{ openInLIFF ? 'LINE內開啟' : '外部瀏覽器' }}</p>
    </div>

    <transition name="translateX">
      <nav v-show="navOpen">
        <div class="sidemenu__wrapper">
          <ul class="sidemenu__list">
            <template v-if="userProfile && userProfile.userId">
              <li class="sidemenu__item" v-for="item in menuList" :key="item.key">
                <RouterLink :to="item.link">{{ item.name }}</RouterLink>
              </li>
            </template>
            <li v-else class="sidemenu__item">
              <RouterLink to="/">回到大廳</RouterLink>
            </li>
          </ul>
        </div>
        <div v-if="userProfile && userProfile.userId" class="userProfile">
          <img :src="userProfile.pictureUrl" :alt="userProfile.displayName">
          <div>
            <p>{{ userProfile.displayName || '' }}</p>
            <p>{{ userProfile.userId || '' }}</p>
            <button @click="externalBrowserLogout">登出</button>
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
        transition: all .4s ease;

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
      a {
        text-decoration: none;
        line-height: 1.25rem;
        font-size: 1.25rem;
        padding: .5rem 1rem;
        display: block;
        color: white;
        transition: .4s ease;

        &:hover {
          background: lightgrey;
          color: dimgrey;
        }
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
  transition: .2s ease;
}

.translateX-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}
</style>
