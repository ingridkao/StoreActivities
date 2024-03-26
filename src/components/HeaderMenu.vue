<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const navOpen = ref<Boolean>(false)
const menuList = ref([
  {
    link: '/',
    key: 'Home',
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
    name: '門市地圖'
  },
])
const togggle = () => {
  navOpen.value = !navOpen.value
}
</script>

<template>
  <div id="sidemenu">
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
              <RouterLink :to="item.link">{{ item.name }}</RouterLink>
            </li>
          </ul>
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
      padding-top: 50px;
    }

    &__list {
      padding-top: 50px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__item {
      a {
        text-decoration: none;
        line-height: 1.25rem;
        font-size: 1.25rem;
        padding: .5rem;
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
