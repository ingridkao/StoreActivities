import axios from 'axios'
import type {
  ActivityListType,
  CampaignListType,
  CollectedType,
  AlbumType,
  AdListType,
  ScanResultType,
  VerifyCodeResultType
} from '@/composable/configurable'
import { ResponseCodes } from '@/composable/ResponseHandle'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLoadingStore } from '@/stores/loading'
const { VITE_API_URL, VITE_UI_MODE, VITE_OUTDIR } = import.meta.env

export function useFetchData() {
  const loadStore = useLoadingStore()
  const {
    // getCtStringCookies,
    setCtStringCookies,
    setCtTokenCookies,
    resetCtStringCookies,
    getAcStringStorage,
    // getLocationStorage,
    setLineTokenCookies,
    setServiceTokenCookies,
    getServiceTokenCookies
  } = useBrowserStorage()

  // MockQRCodeData
  const genrateMockQRCode = (): Promise<{
    qrCode?: string
    lat?: number
    long?: number
    store?: string
  }> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
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
      } else {
        resolve({
          lat: 24.2953944,
          long: 120.72697555,
          qrCode: 'OP113252051016433ee780c2024',
          store: '113252'
        })
      }
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
              setCtStringCookies(ctStr)
              setCtTokenCookies(res.data.result.token)
              resolve({
                c: ctStr,
                t: res.data.result.token
              })
            } else {
              resetCtStringCookies()
              reject(`verifyQRCode:${res.data.msg || '發生了例外錯誤'}`)
            }
          })
      } else {
        resolve(false)
      }
    })
  }

  const checkLineLoginVerify = (accessToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        setLineTokenCookies(accessToken)
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
              setServiceTokenCookies(serviceT0ken)
              resolve(serviceT0ken)
            } else {
              reject(`checkLineLoginVerify:${res.data.msg || '發生了例外錯誤'}`)
            }
          })
      } else {
        resolve('')
      }
    })
  }

  /**
   *
   */
  const commitStoreCheckIn = async (
    verifyRes: boolean | VerifyCodeResultType
  ): Promise<boolean | ScanResultType> => {
    const acStr = getAcStringStorage()
    console.log(acStr)

    const serviceT0ken = getServiceTokenCookies()
    return new Promise((resolve, reject) => {
      if (verifyRes) {
        console.log(verifyRes)
        if (acStr === '') {
          reject('活動錯誤')
        } else if (!serviceT0ken) {
          reject('訪客無法進行打卡')
        } else {
          // axios
          // .post(`${VITE_API_URL}/CheckIn/CheckInVerify`, {
          //   data: {
          //     sourceType: 'A',
          //     eventId: Number(acStr),
          //     storeId: 4,
          //     key: 'AAA',
          //     longitude: longitude,
          //     latitude: latitude,
          //   }
          // },
          // {
          //   headers: {
          //     key: 'AAA|||AAA',
          //     store: '931356',
          //     FV: '1.0.0',
          //     Auth1: '123132',
          //     Auth2: serviceT0ken
          //   }
          // })
          // .then((res) => {
          //   if (res?.data?.code === ResponseCodes.SUCCESS) {
          //     if (res.data.data) {
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

  const fetchCampaign = (): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
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
      } else {
        resolve([
          {
            id: 3,
            eventName: '歡樂一夏夏',
            partnerId: 2,
            startTime: '2024-04-01T00:00:00',
            endTime: '2025-07-31T23:59:59',
            isEnable: true,
            pageRouter: '2'
          },
          {
            id: 4,
            eventName: '歡樂一夏',
            partnerId: 2,
            startTime: '2024-04-01T00:00:00',
            endTime: '2025-05-01T23:59:59',
            isEnable: true,
            pageRouter: '3'
          }
        ])
      }
    })
  }

  const fetchSpecifyCampaign = (storeId: string = ''): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
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
      } else {
        resolve([
          {
            id: 4,
            eventName: '秋耶',
            partnerId: 2,
            startTime: '2024-06-01T00:00:00',
            endTime: '2025-09-31T23:59:59',
            isEnable: true,
            pageRouter: '4'
          }
        ])
      }
    })
  }

  const fetchAdData = (): Promise<AdListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
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
      } else {
        resolve([
          {
            id: 6,
            link: 'www.google.com',
            isEnable: true
          },
          {
            id: 5,
            link: 'www.google.com',
            isEnable: true
          }
        ])
      }
    })
  }

  /**
   * --header 'Authorization;' \ service accesstoken
   * --header 'Key;' \           service accesstoken第5取6
   * --header 'FV;'              version
   */
  const fetchAlbumData = (): Promise<AlbumType[]> => {
    const serviceT0ken = getServiceTokenCookies()
    return new Promise((resolve, reject) => {
      if (VITE_API_URL && serviceT0ken) {
        axios
          .post(
            `${VITE_API_URL}/CheckIn/GetUserHistoryByStore`,
            {},
            {
              headers: {
                Authorization: serviceT0ken,
                Key: serviceT0ken.slice(4, 10),
                FV: '1.0.0'
              }
            }
          )
          .then((res) => {
            if (res?.data?.code === ResponseCodes.SUCCESS) {
              if(res.data.result.historyList){
                resolve(res.data.result.historyList || [])
              }else{
                // TODO: remove this
                resolve([
                  {
                    event_id: '1',
                    event_name: '歡樂一夏',
                    collection: 2,
                    limit: 8
                  },
                  {
                    event_id: '2',
                    event_name: '歡樂一夏夏',
                    collection: 1,
                    limit: 4
                  },
                  {
                    event_id: '3',
                    event_name: '道生',
                    collection: 1,
                    limit: 4
                  }
                ])
              }
            } else {
              reject(`fetchAlbumData:${res.data.msg || '發生了例外錯誤'}`)
            }
          })
          .catch((err) => {
            reject(err)
          })
      } else if (VITE_API_URL || VITE_UI_MODE) {
        resolve([
          {
            event_id: '1',
            event_name: '歡樂一夏',
            collection: 2,
            limit: 8
          },
          {
            event_id: '2',
            event_name: '歡樂一夏夏',
            collection: 1,
            limit: 4
          },
          {
            event_id: '3',
            event_name: '道生',
            collection: 1,
            limit: 4
          }
        ])
      } else {
        reject('沒有登入')
      }
    })
  }

  /**
   * --header 'Authorization;' \ service accesstoken
   * --header 'Key;' \           service accesstoken第5取6
   * --header 'FV;'              version
   */
  const fetchCollectData = (activityId: string = ''): Promise<CollectedType> => {
    const serviceT0ken = getServiceTokenCookies()
    return new Promise((resolve, reject) => {
      if (VITE_API_URL && serviceT0ken) {
        // 
        axios
          .post(
            `${VITE_API_URL}/CheckIn/GetUserEventHistory`,
            {
              data: {
                eventId: Number(activityId)
              }
            },
            {
              headers: {
                Authorization: serviceT0ken,
                Key: serviceT0ken.slice(4, 10),
                FV: '1.0.0'
              }
            }
          )
          .then((res) => {
            if (res?.data?.code === ResponseCodes.SUCCESS) {
              if(res.data.result.historyList){
                // res.data.result.storeIconList
                //   const newData = {
                  //     ...res.data.data,
                  //     startDate: '2024.07.15',
                  //     endDate: '08.31',
                  //     specialStampIndexList: [5, 10, 15, 30],
                  //   }
                resolve(res.data.result.historyList || [])
              }else{
                // TODO: remove this
                resolve({
                  event_id: activityId,
                  event_name: '歡樂一夏',
                  limit: 4,
                  startDate: '2024.07.15',
                  endDate: '08.31',
                  specialStampIndexList: [5, 10, 15, 30],
                  collection: [
                    {
                      store_id: '870504',
                      store_name: '道生',
                      checkInTime: '2024/01/12 09:12'
                    }
                  ]
                })
              }
            } else {
              reject(`fetchCollectData:${res.data.msg || '發生了例外錯誤'}`)
            }
          })
          .catch((err) => {
            reject(err)
          })
      } else if (VITE_API_URL || VITE_UI_MODE) {
        resolve({
          event_id: activityId,
          event_name: '歡樂一夏',
          limit: 4,
          startDate: '2024.07.15',
          endDate: '08.31',
          specialStampIndexList: [5, 10, 15, 30],
          collection: [
            {
              store_id: '870504',
              store_name: '道生',
              checkInTime: '2024/01/12 09:12'
            }
          ]
        })
      } else {
        reject('沒有登入')
      }
    })
  }

  const confirmActivity = (acStr: string | string[] = ''): Promise<ActivityListType | number> => {
    return new Promise((resolve, reject) => {
      if (acStr === '') resolve(0)
    })
  }

  const originURL = window.location.origin
  const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''

  // 讀取指定城市資料
  const fetchLayerData = async (selectCity: string = '') => {
    const targerCity = String(selectCity)
    if (!targerCity) return false
    loadStore.toggle(true)
    return await axios
      .get(`${fileOrigin}/stores/map_${targerCity}.geojson`)
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
    fetchAlbumData,
    fetchCollectData,
    confirmActivity,
    fetchLayerData
  }
}
