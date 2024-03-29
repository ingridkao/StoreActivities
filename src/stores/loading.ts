import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const load = ref(false)
  const toggle = (action) => {
    load.value = action
  }
  return { load, toggle }
})
