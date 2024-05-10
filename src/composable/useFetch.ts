import axios from 'axios'
import type {
  ActivityListType,
  CampaignListType,
  CollectedType,
  AlbumType,
  ScanResultType,
  VerifyCodeResultType
} from '@/composable/configurable'
import { ResponseCodes } from '@/composable/ResponseHandle'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLoadingStore } from '@/stores/loading'
const { VITE_MOCKAPI_URL, VITE_API_URL, VITE_UI_MODE } = import.meta.env

export function useFetchData() {
  const loadStore = useLoadingStore()
  const {
    getCtCookies,
    setCtCookies,
    setTokenCookies,
    resetCtCookies,
    getAcStorage,
    getLocationStorage,
    setLineTokenCookies,
    setServiceTokenCookies
  } = useBrowserStorage()

  // MockQRCodeData
  const genrateMockQRCode = (): Promise<{
    qrCode?: string
    lat?: number
    long?: number
    store?: string
  }> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${VITE_API_URL}/ScanEntry/MockQRCodeData`, {
          data: {
            id: 1
          }
        })
        .then((res) => {
          if (res?.data?.code === ResponseCodes.SUCCESS) {
            const qrCodeString = res.data.result.qrCode || ''
            if (qrCodeString) {
              const store = qrCodeString.substring(2, 8)
              resolve({
                ...res.data.result,
                store
              })
            } else {
              reject(`genrateMockQRCode:${res.data.msg}`)
            }
          } else {
            reject('genrateMockQRCode:發生了例外錯誤')
          }
        })
    })
  }

  // 驗證QRCode(ctString)
  const verifyQRCode = (ctStr: string = ''): Promise<boolean | VerifyCodeResultType> => {
    // ct=OP666000031818094ac904
    // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
    return new Promise((resolve, reject) => {
      if (ctStr) {
        axios
          .post(`${VITE_API_URL}/ScanEntry/IbonEntry`, {
            data: {
              qrCode: ctStr
            }
          })
          .then((res) => {
            if (res?.data?.code === ResponseCodes.SUCCESS) {
              setCtCookies(ctStr)
              setTokenCookies(res.data.result.token)
              resolve({
                c: ctStr,
                t: res.data.result.token
              })
            } else {
              resetCtCookies()
              reject(`verifyQRCode:${res.data.msg || '發生了例外錯誤'}`)
            }
          })
      } else {
        resolve(false)
      }
    })
  }

  const checkLineLoginVerify = (accessToken: string) => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        axios
          .post(`${VITE_API_URL}/ScanEntry/LineLoginVerify`, {
            data: {
              key: accessToken,
              partnerId: 2
            }
          })
          .then((res) => {
            if (res?.data?.code === ResponseCodes.SUCCESS) {
              const serviceT0ken = res.data.result.token || ''
              setLineTokenCookies(accessToken)
              setServiceTokenCookies(serviceT0ken)
              resolve(serviceT0ken)
            } else {
              reject(`checkLineLoginVerify:${res.data.msg || '發生了例外錯誤'}`)
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
          // .post(`${VITE_API_URL}/CheckIn/CheckInVerify`, {
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
          //   if (res?.data?.code === ResponseCodes.SUCCESS) {
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

  // const fetchActivityData = (): Promise<ActivityListType[]> => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${VITE_MOCKAPI_URL}/activities`)
  //       .then((res) => {
  //         resolve(res.data || [])
  //       })
  //       .catch((err) => {
  //         reject(`fetchAdData:${err}`)
  //       })
  //   })
  // }

  const fetchCampaign = (): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${VITE_API_URL}/ScanEntry/GetCampaignData`)
        .then((res) => {
          if (res?.data?.code === ResponseCodes.SUCCESS) {
            resolve(res.data.result.queryList || [])
          } else {
            reject(`fetchCampaign:${res.data.msg || '發生了例外錯誤'}`)
          }
        })
        .catch((err) => {
          reject(`fetchCampaign:${err}`)
        })
    })
  }

  const fetchSpecifyCampaign = (storeId: string = ''): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${VITE_API_URL}/ScanEntry/GetSpecifytheCampaignData`, {
          data: {
            key: storeId
          }
        })
        .then((res) => {
          if (res?.data?.code === ResponseCodes.SUCCESS) {
            resolve(res.data.result.queryList || [])
          } else {
            reject(`fetchSpecifyCampaign:${res.data.msg || '發生了例外錯誤'}`)
          }
        })
        .catch((err) => {
          reject(`fetchSpecifyCampaign:${err}`)
        })
    })
  }

  const fetchAdData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${VITE_API_URL}/ScanEntry/GetAdsData`)
        .then((res) => {
          if (res?.data?.code === ResponseCodes.SUCCESS) {
            resolve(res.data.result.queryList || [])
          } else {
            reject(`fetchAdData:${res.data.msg || '發生了例外錯誤'}`)
          }
        })
        .catch((err) => {
          reject(`fetchAdData:${err}`)
        })
    })
  }

  // ToDo:會更改key
  const fetchAlbumData = (): Promise<AlbumType[]> => {
    return new Promise((resolve, reject) => {
      if(VITE_UI_MODE){
        resolve([{
          "event_id": "1",
          "event_name": "歡樂一夏",
          "collection": 2,
          "limit": 8
        },
        {
          "event_id": "2",
          "event_name": "歡樂一夏夏",
          "collection": 1,
          "limit": 4
        },
        {
          "event_id": "3",
          "event_name": "道生",
          "collection": 1,
          "limit": 4
        }])
      }else{
        axios
        .get(`${VITE_MOCKAPI_URL}/album`)
        .then((res) => {
          resolve(res.data || [])
        })
        .catch((err) => {
          reject(err)
        })
      }
    })
  }

  const fetchCollectData = (activityId: string = ''): Promise<CollectedType> => {
    return new Promise((resolve, reject) => {
      if(VITE_UI_MODE){
        resolve({
          event_id: "2",
          event_name: "歡樂一夏",
          limit: 4,
          startDate: '2024.07.15',
          endDate: '08.31',
          specialStampIndexList: [5, 10, 15, 30],
          collection:[{
              "store_id": "870504",
              "store_name": "道生",
              "checkInTime": "2024/01/12 09:12"
          }]
        })
      }else{
        axios
        .post(`${VITE_MOCKAPI_URL}/collect`, {
          ac: activityId
        })
        .then((res) => {
          if(res.data.data){
            const newData = {
              ...res.data.data,
              startDate: '2024.07.15',
              endDate: '08.31',
              specialStampIndexList: [5, 10, 15, 30],
            }
            resolve(newData || {})
          }else{
            reject('沒有此活動')
          }
        })
        .catch((err) => {
          reject(err)
        })
      }
    })
  }

  const confirmActivity = (acStr: string | string[] = ''): Promise<ActivityListType | number> => {
    return new Promise((resolve, reject) => {
      if (acStr === '') resolve(0)
      // fetchActivityData()
      //   .then((res: ActivityListType[]) => {
      //     const ongoActivity = res.find((item) => String(item.id) === acStr)
      //     if (ongoActivity && ongoActivity.statu === 1) {
      //       resolve(ongoActivity)
      //     } else {
      //       const statusCode = ongoActivity ? Number(ongoActivity.statu) : 0
      //       resolve(statusCode)
      //     }
      //   })
      //   .catch((e) => {
      //     reject(e)
      //   })
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

  return {
    genrateMockQRCode,
    verifyQRCode,
    checkLineLoginVerify,
    commitStoreCheckIn,
    fetchCampaign,
    fetchSpecifyCampaign,
    fetchAdData,
    // fetchActivityData,
    fetchAlbumData,
    fetchCollectData,
    confirmActivity,
    fetchLayerData
  }
}
