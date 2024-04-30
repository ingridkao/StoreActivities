import { UAParser } from 'ua-parser-js'
import axios from 'axios'
import type {
  ActivityListType,
  CollectedType,
  AlbumType,
  ScanResultType,
  VerifyCodeResultType
} from '@/composable/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLoadingStore } from '@/stores/loading'
const { VITE_MOCKAPI_URL } = import.meta.env

export function useFetchData() {
  const parser = new UAParser()
  const loadStore = useLoadingStore()
  const {
    getCtCookies,
    setCtCookies,
    setTokenCookies,
    resetCtCookies,
    getAcStorage,
    getLocationStorage
  } = useBrowserStorage()

  const getDevice = () => {
    const result = parser.getDevice()
    return result && result.type ? result.type : ''
  }

  // 驗證QR Code
  const verifyQRCode = (ctStr: string = ''): Promise<boolean | VerifyCodeResultType> => {
    // ct=OP666000031818094ac904
    // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
    let ctString = ctStr
    if (ctStr !== '') {
      ctString = ctStr
    } else {
      ctString = getCtCookies()
    }
    const [latitude, longitude] = getLocationStorage()
    return new Promise((resolve, reject) => {
      if (ctString) {
        axios
          .post('/api/ScanEntry/IbonEntry', {
            data: {
              qrCode: ctString,
              longitude: longitude,
              latitude: latitude
            }
          })
          .then((res) => {
            if (res && res.data) {
              if (res.data.result.token) {
                setCtCookies(ctString)
                setTokenCookies(res.data.result.token)
                resolve({
                  c: ctString,
                  t: res.data.result.token
                })
              } else {
                resetCtCookies()
                reject(res.data.msg)
              }
            } else {
              resetCtCookies()
              reject('發生了例外錯誤')
            }
          })
      } else {
        resolve(false)
      }
    })
  }

  const commitStoreCheckIn = async (
    verifyRes: boolean | VerifyCodeResultType
  ): Promise<boolean | ScanResultType> => {
    const acStr = getAcStorage()
    // const { getLineProfile } = useLIFF()
    // const profile = getLineProfile()
    // console.log(profile);
    // if(profile) userProfile.value = profile
    return new Promise((resolve, reject) => {
      if (verifyRes) {
        if (!acStr) {
          reject('活動錯誤')
          // }else if(!userId){
          //   reject('訪客無法進行打卡')
        } else {
          // 驗證成功
          // axios
          // .post(`${VITE_MOCKAPI_URL}/checkIn`, {
          //   data: {
          //     uid: userId,
          //     aid: acStr,
          //     token: '123',
          //     qrcode: ct
          //     // lon: lon,
          //     // lat: lat
          //   }
          // })
          // .then((res) => {
          //   if (res && res.data) {
          //     if (res.data.data) {
          //       deleteStorage('ct')
          //       resolve(res.data.data)
          //     } else {
          //       resolve(false)
          //     }
          //   } else {
          //     reject('後端發生了例外錯誤')
          //   }
          // })
          resolve({
            event_id: String(acStr)
          })
        }
      } else {
        reject('參數錯誤')
      }
    })
  }

  const fetchActivityData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${VITE_MOCKAPI_URL}/activities`)
        .then((res) => {
          resolve(res.data || [])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchAdData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/ScanEntry/GetAdsData', {})
        .then((res) => {
          // axios.get(`${VITE_MOCKAPI_URL}/GetAdsData`).then((res) => {
          resolve(res.data || [])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchAlbumData = (): Promise<AlbumType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${VITE_MOCKAPI_URL}/album`)
        .then((res) => {
          resolve(res.data || [])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchCollectData = (activityId: string = ''): Promise<CollectedType> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${VITE_MOCKAPI_URL}/collect`, {
          ac: activityId
        })
        .then((res) => {
          resolve(res.data.data || {})
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const confirmActivity = (acStr: String = ''): Promise<ActivityListType | number> => {
    return new Promise((resolve, reject) => {
      if (acStr === '') resolve(0)
      fetchActivityData()
        .then((res: ActivityListType[]) => {
          const ongoActivity = res.find((item) => String(item.id) === acStr)
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
    if (!targerCity) return false
    loadStore.toggle(true)
    return await axios
      .get(`/stores/map_${targerCity}.geojson`)
      .then((geoRes) => {
        if (!geoRes) return false
        return geoRes
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
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
    getDevice
  }
}
