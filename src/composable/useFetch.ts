import { getCurrentInstance } from 'vue'
import { UAParser } from 'ua-parser-js'
import axios from 'axios'
import Cookies from 'js-cookie'

import { useGeolocation } from '@vueuse/core'
import type { ActivityListType } from '@/composable/configurable'

// import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useURL } from '@/composable/useURL'
import { useLoadingStore } from '@/stores/loading'
const { VITE_MOCKAPI_URL } = import.meta.env

// import { useConvenienceStore } from '@/stores/convenience'
export function useFetchData() {
  const parser = new UAParser()
  const { proxy } = getCurrentInstance()
  const loadStore = useLoadingStore()
  // const { setCtStorage, deleteStorage } = useBrowserStorage()
  // const convenienceStore = useConvenienceStore()

  const getDevice = () => {
    const result = parser.getDevice()
    return result && result.type ? result.type : ''
  }

  // 驗證QR Code
  // ct=OP666000031818094ac904
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
  const { getQueryParam } = useURL()
  const { coords, error, resume } = useGeolocation()
  const verifyQRCode = ():Promise<boolean> => {
    const { latitude, longitude } = coords.value
    const lat = getQueryParam(window.location.href, 'lat')
    const lon = getQueryParam(window.location.href, 'lon')
    const ctStr = getQueryParam(window.location.href, 'ct')
    // const isMobile = getDevice()
    
    return new Promise((resolve, reject) => {
      if(error.value === null && !Number.isFinite(latitude) && !Number.isFinite(longitude)){
        // 初始化
        resolve(false)
  
      }else if(error.value){
        const GeolocationPositionError = ['沒有獲取地理位置信息的權限', '資訊回傳了錯誤', '取得地理資訊超過時限']
        const GeolocationErrorString = GeolocationPositionError[error.value.code - 1]
        proxy.$swal.fire({
          icon: "info",
          title: '打卡活動需要裝置位置資訊，請確認是否提供位置存取權',
          text: GeolocationErrorString || '',
          showCancelButton: true,
          confirmButtonText: "開啟存取權",
          cancelButtonText: "拒絕",
        }).then((result: { isConfirmed: boolean, isDenied: boolean, isDismissed: boolean, value: boolean }) => {
          if (result.isConfirmed) {
            resume()
          }
        })
        resolve(true)

      // }else if (!isMobile) {
      //   reject(Error('請使用移動裝置'))
      }else if (ctStr) {
        axios
          .post('/api/ScanEntry/IbonEntry', {
            data: {
              qrCode: ctStr,
              longitude: Number(lon) || longitude,
              latitude: Number(lat) || latitude
            }
          })
          .then((res) => {
            if (res && res.data) {
              if (res.data.result.token) {
                const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000)
                Cookies.set('SCAN_RESULT', JSON.stringify({
                  qr: ctStr,
                  token: res.data.result.token
                }), {
                  expires: inFiveMinutes
                })
                // console.log(Cookies.get("SCAN_RESULT"));
                // Cookies.getJSON("SCAN_RESULT")
                // Cookies.remove('SCAN_RESULT') 
                resolve(true)
              } else {
                reject(res.data.msg)
              }
            } else {
              reject('發生了例外錯誤')
            }
          })
      }else{
        resolve(false)
      }
    })
  }

  const commitStoreCheckIn = async (userId: string = '') => {
    return new Promise((resolve, reject) => {
      if (userId) {
        // axios.get(`${VITE_MOCKAPI_URL}/').then((rs) => {
        resolve(true)
        //   resolve(res.data.data)
        // }).catch(e=>{
        // 打卡失敗
        // return Error(e)
        // }).finally(()=>{
        // deleteStorage('ct')
        // })
      } else {
        reject('訪客無法進行打卡')
      }
    })
  }

  const fetchActivityData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios.get(`${VITE_MOCKAPI_URL}/activities`).then((res) => {
        resolve(res.data || [])
      })
    })
  }

  const confirmActivity = (acStr: number | null = null): Promise<ActivityListType | number> => {
    return new Promise((resolve, reject) => {
      if (!acStr) resolve(0)
      fetchActivityData()
        .then((res: ActivityListType[]) => {
          const ongoActivity = res.find((item) => Number(item.id) === Number(acStr))
          if (ongoActivity && ongoActivity.statu === 1) {
            resolve(ongoActivity)
          } else {
            const statusCode = ongoActivity ? Number(ongoActivity.statu) : 0
            resolve(statusCode)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // 讀取指定城市資料
  const fetchLayerData = async (selectCity: string = '') => {
    const targerCity = String(selectCity)

    const getAllStore = () => axios.get(`/stores/map_all_${targerCity}.geojson`)
    const getFeatureStore = () => axios.get(`/stores/map_feature_${targerCity}.geojson`)
    const getOpenStore = () => axios.get(`/stores/map_openstore_${targerCity}.geojson`)

    loadStore.toggle(true)
    return Promise.all([getAllStore(), getFeatureStore(), getOpenStore()])
      .then((results) => {
        if (!results) return false
        return results
      })
      .catch((err) => {
        loadStore.toggle(false)
      })
  }

  // onMounted(async () => {
  // })

  return {
    verifyQRCode,
    commitStoreCheckIn,
    fetchActivityData,
    confirmActivity,
    fetchLayerData,
    getDevice
  }
}
