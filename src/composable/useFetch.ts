// import { ref, onMounted, onUnmounted } from 'vue'
// import { useRouter } from 'vue-router'
import { UAParser } from 'ua-parser-js'
import axios from 'axios'

import type { ActivityListType } from '@/composable/configurable'

import { useLoadingStore } from '@/stores/loading'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useURL } from '@/composable/useURL'
const { VITE_MOCKAPI_URL } = import.meta.env

// import { useConvenienceStore } from '@/stores/convenience'
const parser = new UAParser()
export function useFetchData() {
  // const router = useRouter()
  const loadStore = useLoadingStore()
  const { setCtStorage, deleteStorage } = useBrowserStorage()
  // const convenienceStore = useConvenienceStore()

  const getDevice = () => {
    const result = parser.getDevice()
    return result && result.type ? result.type : ''
  }
  // 驗證QR Code
  // ct=OP666000031818094ac904
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
  const { getQueryParam } = useURL()
  const verifyQRCode = (latitude: null | number = null, longitude: null | number = null) => {
    console.log(latitude)
    console.log(longitude)

    // const lat = Number(latitude)
    // const lon = Number(longitude)
    // const isMobile = getDevice()
    const ctStr = getQueryParam(window.location.href, 'ct')
    const lat = getQueryParam(window.location.href, 'lat')
    const lon = getQueryParam(window.location.href, 'lon')
    return new Promise((resolve, reject) => {
      // if (!isMobile) {
      //   reject(Error('請使用移動裝置'))
      if (ctStr) {
        axios
          .post('/api/ScanEntry/IbonEntry', {
            data: {
              qrCode: ctStr,
              longitude: Number(lon),
              latitude: Number(lat)
            }
          })
          .then((res) => {
            if (res && res.data) {
              if (res.data.result.token) {
                // 通過驗證set cookies
                // setCtStorage(ctStr)
                // deleteStorage('ct')
                console.log(res.data.result.token)
                resolve(res.data.result)
              } else {
                reject(res.data.msg)
              }
            } else {
              reject('發生了例外錯誤')
            }
          })
      } else {
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
