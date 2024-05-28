import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProfileType } from '@/types/configurable'

export const useUserStore = defineStore('user', () => {
  const userProfile = ref<ProfileType>({})
  const updateProfile = (profile: ProfileType = {}) => {
    userProfile.value = profile
  }
  return { userProfile, updateProfile }
})
