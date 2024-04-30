import { getCurrentInstance } from 'vue'
import { useGeolocation } from '@vueuse/core'

export function useGeo() {
  const { proxy } = getCurrentInstance()
  const { resume } = useGeolocation()

  const GeolocationPositionError = [
    '沒有獲取地理位置信息的權限',
    '資訊回傳了錯誤',
    '取得地理資訊超過時限'
  ]

  //可以控制是否要顯示提示
  const geoErrorHandler = (errorCode: number) => {
    const GeolocationErrorString = GeolocationPositionError[errorCode - 1]
    proxy.$swal
      .fire({
        icon: 'info',
        title: '打卡活動需要裝置位置資訊，請確認是否提供位置存取權',
        text: GeolocationErrorString || '',
        showCancelButton: true,
        confirmButtonText: '開啟存取權',
        cancelButtonText: '拒絕'
      })
      .then(
        (result: {
          isConfirmed: boolean
          isDenied: boolean
          isDismissed: boolean
          value: boolean
        }) => {
          if (result.isConfirmed) {
            resume()
          }
        }
      )
  }
  return {
    geoErrorHandler
  }
}
