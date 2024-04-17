import { UAParser } from 'ua-parser-js'
import axios from 'axios'
import type { ActivityListType, CollectedListType, CollectedType, AlbumType, ScanResultType } from '@/composable/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useLink } from '@/composable/useLink'
import { useLoadingStore } from '@/stores/loading'
const { VITE_MOCKAPI_URL, VITE_BASE_URL } = import.meta.env

export function useFetchData() {
  const parser = new UAParser()
  const loadStore = useLoadingStore()
  const { 
    getCtCookies, setCtCookies, 
    getTokenCookies, setTokenCookies, resetCtCookies,
    getAcStorage,
    deleteStorage, getLocationStorage } = useBrowserStorage()

  const getDevice = () => {
    const result = parser.getDevice()
    return result && result.type ? result.type : ''
  }

  // 驗證QR Code
  const { getQueryParam } = useLink()
  const verifyQRCode = (ctStr:string='') => {
    // ct=OP666000031818094ac904
    // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
    let ctString = ctStr 
    if(ctString === ''){
      ctString = getQueryParam(window.location.href, 'ct')
    }
    const lat = getQueryParam(window.location.href, 'lat')
    const lon = getQueryParam(window.location.href, 'lon')
    const [latitude, longitude] = getLocationStorage()
    return new Promise((resolve, reject) => {
      if (ctString) {
        axios
        .post('/api/ScanEntry/IbonEntry', {
          data: {
            qrCode: ctString,
            longitude: Number(lon) || longitude,
            latitude: Number(lat) || latitude
          }
        })
        .then((res) => {
          if (res && res.data) {
            if (res.data.result.token) {
              setCtCookies(ctString)
              setTokenCookies(res.data.result.token)
              resolve(true)
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

  const verifyScanResult = (code:string):Promise<boolean|ScanResultType> => {
    // const isMobile = getDevice()
    const [lat, lon] = getLocationStorage()
    const ctToken = getTokenCookies()
    const activityId = getAcStorage()
    const codeSplit = code.split(`${VITE_BASE_URL}/?ct=`)
    let ctStr = ''
    if(codeSplit && codeSplit.length > 0){
      ctStr = codeSplit[1]
    }else{
      ctStr = getCtCookies()
    }

    return new Promise((resolve, reject) => {
      if(!lat || !lon){
        reject('裝置未提供經緯度')
      }else if(ctStr === '' || ctToken === ''){
        reject('QRCode掃描失敗')
      }else if(activityId){
        axios
        .post(`${VITE_MOCKAPI_URL}/scan`, {
          data: {
            token: ctToken,
            ct: ctStr,
            ac: activityId,
            lon: lon,
            lat: lat
          }
        })
        .then((res) => {
          if (res && res.data) {
            if (res.data.data) {
              resolve(res.data.data)
              resetCtCookies()
            } else {
              resolve(false)
            }
          } else {
            reject('後端發生了例外錯誤')
          }
        })
      }else{
        reject('輸入參數異常')
      }
    })
  }

  const commitStoreCheckIn = async (userId: string = '', acStr: string = '') => {

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
        axios
        .post(`${VITE_MOCKAPI_URL}/checkIn`, {
          data: {
            uid: userId,
            aid: acStr,
            token: '123',
            qrcode: ct
            // lon: lon,
            // lat: lat
          }
        })
        .then((res) => {
          if (res && res.data) {
            if (res.data.data) {
              deleteStorage('ct')
              resolve(res.data.data)
            } else {
              resolve(false)
            }
          } else {
            reject('後端發生了例外錯誤')
          }
        })
      } else {
        reject('訪客無法進行打卡')
      }
    })
  }

  const fetchActivityData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios.get(`${VITE_MOCKAPI_URL}/activities`).then((res) => {
        resolve(res.data || [])
      }).catch((err) => {
        reject(err)
      })
    })
  }

  const fetchAdData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios.post('/api/ScanEntry/GetAdsData', {}).then((res) => {
      // axios.get(`${VITE_MOCKAPI_URL}/GetAdsData`).then((res) => {
        resolve(res.data || [])
      }).catch((err) => {
        reject(err)
      })
    })
  }

  const fetchAlbumData = (): Promise<AlbumType[]> => {
    return new Promise((resolve, reject) => {
      axios.get(`${VITE_MOCKAPI_URL}/album`).then((res) => {
        resolve(res.data || [])
      }).catch((err) => {
        reject(err)
      })
    })
  }

  // const fetchCollectsData = (): Promise<CollectedListType[]> => {
  //   return new Promise((resolve, reject) => {
  //     axios.get(`${VITE_MOCKAPI_URL}/collect`).then((res) => {
  //       resolve(res.data || [])
  //     }).catch((err) => {
  //       reject(err)
  //     })
  //   })
  // }

  const fetchCollectData = (activityId:string=''): Promise<CollectedType> => {
    return new Promise((resolve, reject) => {
      axios.post(`${VITE_MOCKAPI_URL}/collect`, {
        ac: activityId,
      }).then((res) => {
        resolve(res.data.data || {})
      }).catch((err) => {
        reject(err)
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
            // 活動中
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

  return {
    verifyQRCode,
    commitStoreCheckIn,
    fetchActivityData,
    fetchAdData,
    fetchAlbumData,
    fetchCollectData,
    confirmActivity,
    fetchLayerData,
    getDevice,
    verifyScanResult
  }
}
