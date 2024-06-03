import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('loading', () => {
  const load = ref(true)
  const loadToggle = (action: boolean) => {
    load.value = action
  }

  const pageLoad = ref(true)
  const pageLoadToggle = (action: boolean) => {
    pageLoad.value = action
  }

  const navOpen = ref(false)
  const toggleNav = () => {
    navOpen.value = !navOpen.value
  }
  const closeNav = () => {
    navOpen.value = false
  }

  const showDirection = ref(false)
  const toggleDirection = (action: boolean) => {
    showDirection.value = action
  }

  return {
    load,
    loadToggle,
    pageLoad,
    pageLoadToggle,
    navOpen,
    toggleNav,
    closeNav,
    showDirection,
    toggleDirection
  }
})