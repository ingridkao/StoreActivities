import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProfileType } from '@/composable/configurable'

export const useUserStore = defineStore('user', () => {
  const userProfile = ref<ProfileType>({})
  const updateProfile= (_profile:ProfileType) => {
    userProfile.value = _profile
  }
  return { userProfile, updateProfile}
})
