import { useGeolocation } from '@vueuse/core'
import { useSweetAlert } from '@/composable/useSweetAlert'

export function useGeo() {
  const GeolocationPositionError = [
    '沒有獲取地理位置信息的權限',
    '資訊回傳了錯誤',
    '取得地理資訊超過時限'
  ]

  //可以控制是否要顯示提示
  const { geoLocationErrorAlert } = useSweetAlert()
  const { resume } = useGeolocation()
  const geoErrorHandler = (errorCode: number) => {
    const GeolocationErrorString = GeolocationPositionError[errorCode - 1]
    geoLocationErrorAlert(GeolocationErrorString, () => {
      resume()
    })
  }
  return {
    geoErrorHandler
  }
}
