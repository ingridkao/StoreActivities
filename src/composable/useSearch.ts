import { type Ref, ref } from 'vue'
// import { useRouter } from 'vue-router'
import axios from 'axios'

import { point, polygon } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

interface SearchFunctions {
  // searchTerm: Ref<string>
  handleSearch: () => Promise<void>
  reverseLatLonToCity: (latitude: number, longitude: number) => Promise<string>
}

export default function useMap(): SearchFunctions {
  // const router = useRouter()
  // const searchTerm = ref('')
  const defaultCity = 'taipei'

  // const handleSearch = async() => {
  //   if (searchTerm.value) {
  //     try {
  //       await router.push({ name: 'search-results', query: { keyword: searchTerm.value } })
  //     } catch (error) {
  //       console.error('Error navigating to search results:', error)
  //     }
  //   }
  // }

  const checkInTW = (latitude: number, longitude: number): boolean => {
    const pt = point([longitude, latitude])

    // [120.5598, 26.3865], // 最北東引門市
    // [121.9415, 25.0278], // 最東新福隆門市
    // [120.8924, 21.9177], // 最南鵝鑾鼻門市
    // [118.2485, 24.4331], // 最西小金門市
    const taiwanBoundary = polygon([
      [
        [118.2485, 26.3865], // 西北
        [118.2485, 21.9177], // 西南
        [121.9415, 21.9177], // 東南
        [121.9415, 26.3865], // 東北
        [118.2485, 26.3865]  // 第一個和最後一個要依樣
      ]
    ])

    return booleanPointInPolygon(pt, taiwanBoundary)
  }

  //確認是否在台灣範圍內
  const reverseLatLonToCity = async (latitude: number, longitude: number): Promise<string> => {
    const inTw = checkInTW(latitude, longitude)
    if (!inTw) return defaultCity

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    try {
      const response = await axios.get(url)
      const resCity = response?.data?.address?.city || ''
      
      return resCity.toLowerCase()
    } catch (error) {
      console.error('Error detecting city:', error)
      return defaultCity
    }
  }

  return {
    // searchTerm,
    // handleSearch,
    reverseLatLonToCity
  }
}
