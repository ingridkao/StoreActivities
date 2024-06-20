import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProfileType } from '@/types/LineHandle'

export const useUserStore = defineStore('user', () => {
  const userProfile = ref<ProfileType>({})
  const updateProfile = (profile: ProfileType = {}) => {
    userProfile.value = profile
  }

  const userLatitude = ref<null | number>(null)
  const userLongitude = ref<null | number>(null)
  const updateLocation = (latitude: null | number = null, longitude: null | number = null) => {
    userLatitude.value = latitude ? Number(latitude) : null
    userLongitude.value = longitude ? Number(longitude) : null
  }

  return {
    userProfile,
    updateProfile,

    userLatitude,
    userLongitude,
    updateLocation
  }
})
