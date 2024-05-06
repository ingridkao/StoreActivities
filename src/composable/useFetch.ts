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
  const loadStore = useLoadingStore()
  const {
    getCtCookies,
    setCtCookies,
    setTokenCookies,
    resetCtCookies,
    getAcStorage,
    getLocationStorage
  } = useBrowserStorage()

  // 驗證QRCode(ctString)
  const verifyQRCode = (ctStr: string = ''): Promise<boolean | VerifyCodeResultType> => {
    // ct=OP666000031818094ac904
    // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
    let ctString = ctStr
    if (ctStr !== '') {
      ctString = ctStr
    } else {
      ctString = getCtCookies()
    }
    // const [latitude, longitude] = getLocationStorage()
    return new Promise((resolve, reject) => {
      if (ctString) {
        axios
          .post('/api/ScanEntry/IbonEntry', {
            data: {
              qrCode: ctString,
              // longitude: longitude,
              // latitude: latitude
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
    return new Promise((resolve, reject) => {
      if (verifyRes) {
        if (!acStr) {
          reject('活動錯誤')
          // }else if(!userId){
          //   reject('訪客無法進行打卡')
        } else {
          // 驗證
          // axios
          // .post('/api/CheckIn/CheckInVerify', {
          //   data: {
          //     storeId: 4,
          // //     eventId: 4,
          // //     key: 'AAA',
          // //     longitude: longitude,
          // //     latitude: latitude,
          //     sourceType: 'A'
          //   }
          // },
          // {
          //   headers: {
          //     key: 'AAA|||AAA',
          //     store: '931356',
          //     FV: '1.0.0',
          //     Auth1: '123132',
          //     Auth2: '123132'
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
        .post('/api/ScanEntry/GetAdsData')
        .then((res) => {
          if(res.data && res.data.result){
            resolve(res.data.result.queryList || [])
          }
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

  const confirmActivity = (acStr: string | string[] = ''): Promise<ActivityListType | number> => {
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
        if (geoRes && geoRes.data) return geoRes.data
        return false
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loadStore.toggle(false)
      })
  }

  const checkLineLoginVerify = (accessToken:string) => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        axios
          .post('/api/ScanEntry/LineLoginVerify', {
            data: {
              key: accessToken,
              partnerId: 2
            }
          })
          .then((res) => {
            if (res && res.data) {
              console.log(res);
            //   if (res.data.result.token) {
            //     setCtCookies(ctString)
            //     setTokenCookies(res.data.result.token)
            //     resolve({
            //       c: ctString,
            //       t: res.data.result.token
            //     })
            //   } else {
            //     resetCtCookies()
            //     reject(res.data.msg)
            //   }
            } else {
              console.log(res);
            //   resetCtCookies()
            //   reject('發生了例外錯誤')
            }
          })
      } else {
        resolve(false)
      }
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
    checkLineLoginVerify
  }
}
