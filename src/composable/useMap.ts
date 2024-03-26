import { ref, onMounted } from 'vue'
import axios from 'axios'
import { point, polygon } from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export function useMap() {
  const checkInTW = (latitude: number, longitude: number): boolean => {
    const pt = point([longitude, latitude])
    // [120.4855, 26.5870], // 最北 東引門市
    // [121.9415, 25.0278], // 最東 新福隆門市
    // [120.8924, 21.9177], // 最南 鵝鑾鼻門市
    // [118.2485, 24.4331], // 最西 小金門市
    const taiwanBoundary = polygon([
      [
        [118.2485, 26.5870], // 西北
        [118.2485, 21.9177], // 西南
        [121.9415, 21.9177], // 東南
        [121.9415, 26.5870], // 東北
        [118.2485, 26.5870]  // 第一個和最後一個要依樣
      ]
    ])
    return booleanPointInPolygon(pt, taiwanBoundary)
  }

  //確認是否在台灣範圍內
  const defaultCity = 'taipei'
  const reverseLatLonToCity = async (latitude: number, longitude: number): Promise<string> => {
    const inTw = checkInTW(latitude, longitude)
    
    if (!inTw) return defaultCity
    const pt = point([longitude, latitude])
    const LienchiangPoly  = bboxPolygon([119.8488, 26.1304, 120.026, 26.2945])
    const isLienchiang = booleanPointInPolygon(pt, LienchiangPoly)

    if(isLienchiang){
      return 'lienchiang'
    }else{
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
      try {
        const response = await axios.get(url)
        const resCity = response?.data?.address?.city || response?.data?.address?.county || ''
        return resCity.toLowerCase()
      } catch (error) {
        console.error('Error detecting city:', error)
        return defaultCity
      }
    }
  }

  const clientLocationCity = ref('')
  const clientCoords = ref<Position|null>(null)
  const getClientLocation = async() => {
    const fetchLocationFound = async(position:Position) => {
      console.log(position);

      if(position && position.coords){
        clientCoords.value = position.coords
        const {latitude, longitude } = position.coords
        const cityName = await reverseLatLonToCity(latitude, longitude)
        if(cityName){
          clientLocationCity.value = cityName
        }
      }
    }
    const fetchLocationError = async(err:PositionError) => {
      clientCoords.value = null
      clientLocationCity.value = defaultCity
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    try {
      if (navigator.geolocation) {
        console.log('getClientLocation');
        // maximumAge: 接受返回快取的最大期限（以毫秒為單位）
        // timeout: 設備返回位置所允許的最大時間長度（以毫秒為單位）
        // enableHighAccuracy: 希望收到最佳結果
        navigator.geolocation.getCurrentPosition(fetchLocationFound, fetchLocationError,{
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
          immediate: true
        })
      } else {
        /* geolocation IS NOT available */
        clientCoords.value = null
        clientLocationCity.value = defaultCity
        console.warn('geolocation IS NOT available')
      }
    } catch (error) {
      clientCoords.value = null
      clientLocationCity.value = defaultCity
      console.warn('geolocation IS NOT available')
    }
  }

  onMounted(async () => {
    console.log(1);
    await getClientLocation()
  })

  return {
    clientLocationCity,
    clientCoords,
    getClientLocation
  }
}
