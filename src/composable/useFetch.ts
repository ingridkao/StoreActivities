import axios from 'axios'
import { ResponseCodes } from '@/types/ResponseHandle'
import type { GenrateMockQRCodeResponse, VerifyCodeApiResponse, CheckLoginVerifyResponse, CampaignListResponse } from '@/types/ResponseHandle'
import type { GenrateMockQRCodeState, VerifyCodeState } from '@/types/StateHandle'

import type {
  ActivityListType,
  CampaignListType,
  CollectedType,
  AdListType,
  ScanResultType,
} from '@/composable/configurable'
import type {
  AlbumType,
} from '@/types/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLoadingStore } from '@/stores/loading'
import apis from "@/api/apiRoutes";
import mockDatas from "@/api/mockData";

const { VITE_API_URL, VITE_UI_MODE, VITE_OUTDIR } = import.meta.env

export function useFetchData() {
  const { scanEntry, checkIn } = apis;
  const loadStore = useLoadingStore()
  const {
    getLocationStorage,
    setQRcodeCookies,
    setCtTokenCookies,
    getAcStringStorage,
    setLineTokenCookies,
    setServiceTokenCookies,
    getServiceTokenCookies
  } = useBrowserStorage()

  // MockQRCodeData
  const genrateMockQRCode = (): Promise<GenrateMockQRCodeState> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.genrateMockQRCode()
        .then((res:GenrateMockQRCodeResponse) => {
          if (res.qrCode){
            resolve({
              ...res,
              store: res.qrCode.substring(2, 8)
            })
          }else{
            reject(`genrateMockQRCode:${res.error ||'發生了例外錯誤'}`)
          }
        })
      } else {
        resolve(mockDatas.genrateMockQRCode)
      }
    })
  }

  /**
   * 驗證QRCode
   * ct=OP666000031818094ac904
   * 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
   */
  const verifyQRCode = (ctStr: string = ''): Promise<VerifyCodeState> => {
    return new Promise((resolve, reject) => {
      if (ctStr === ''){
        reject('請選擇活動')

      }else if (!VITE_API_URL){
        reject('服務中斷')

      }else{
        checkIn
        scanEntry.verifyQRCode(ctStr)
        .then((res:VerifyCodeApiResponse) => {
          if (res.token){
            setQRcodeCookies(ctStr)
            setCtTokenCookies(res.token)
            resolve({
              ctStr: ctStr,
              // store: ctStr.substring(2, 8),
              token: res.token
            })
          } else {
            reject(`verifyQRCode:${res.error ||'發生了例外錯誤'}`)
          }
        })
      }
    })
  }

  /**
   * Line login換access token
   */
  const checkLineLoginVerify = (accessToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (accessToken) {
        setLineTokenCookies(accessToken)
        scanEntry.checkLineLoginVerify(accessToken)
        .then((res:CheckLoginVerifyResponse) => {
          if (res.result) {
            const serviceT0ken = res.token || ''
            setServiceTokenCookies(serviceT0ken)
            resolve(serviceT0ken)
          } else {
            reject(`checkLineLoginVerify:${res.error || '發生了例外錯誤'}`)
          }
        })
      } else {
        resolve('')
      }
    })
  }

  /**
   * 打卡驗證
   */
  const commitStoreCheckIn = async (activityId:string = ''): Promise<boolean | ScanResultType> => {
    const serviceT0ken = getServiceTokenCookies()
    const [latitude, longitude] = getLocationStorage()
    if(activityId === ''){
      activityId = getAcStringStorage()
    }
    return new Promise((resolve, reject) => {
      if (activityId === '') {
        reject('未選擇活動')

      } else if (serviceT0ken === '') {
        reject('訪客無法進行打卡')

      } else if (!VITE_API_URL) {
        reject('服務中斷')

      } else {
        checkIn.checkInVerify(Number(activityId), Number(longitude),Number(latitude))
        .then((res:any) => {
          console.log(res);
          
        //   if (res?.data?.code === ResponseCodes.SUCCESS) {
        //     if (res.data.data) {
        //       resolve(res.data.data)
        //     } else {
        //       resolve(false)
        //     }
        //   } else {
        //     reject('後端發生了例外錯誤')
        //   }
        // resolve({
        //   event_id: String(activityId)
        // })
        })
      }
    })
  }

  const fetchCampaign = (): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.fetchCampaign()
        .then((res:CampaignListResponse) => {
          if(res.error){
            reject(`fetchCampaign:${res.error}`)
          } else {
            resolve(res.queryList || [])
          }
        })
      } else {
        resolve(mockDatas.fetchCampaign)
      }
    })
  }

  const fetchSpecifyCampaign = (storeId: string = ''): Promise<CampaignListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.fetchSpecifyCampaign(storeId)
          .then((res:CampaignListResponse) => {
            if(res.error){
              reject(`fetchSpecifyCampaign:${res.error}`)
            } else {
              resolve(res.queryList || [])
            }
          })
          .catch((err:string) => {
            reject(`fetchSpecifyCampaign:${err}`)
          })
      } else {
        resolve(mockDatas.fetchSpecifyCampaign)
      }
    })
  }

  const fetchAdData = (): Promise<AdListType[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.fetchAdData()
        .then((res:CampaignListResponse) => {
          if(res.error){
            reject(`fetchAdData:${res.error}`)
          } else {
            resolve(res.queryList || [])
          }
        })
      } else {
        resolve(mockDatas.fetchAdData)
      }
    })
  }

  const fetchAlbumData = (): Promise<AlbumType[]> => {
    const serviceT0ken = getServiceTokenCookies()
    return new Promise((resolve, reject) => {
      if (serviceT0ken) {
        checkIn.fetchAlbum(serviceT0ken)
        .then((res:any) => {
          if(res.error){
            reject(`fetchAlbumData:${res.error}`)
          } else {
            resolve(res.historyList || [])
          }
        })
      } else if (VITE_API_URL || VITE_UI_MODE) {
        resolve(mockDatas.fetchAlbumData)
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
              if (res.data.result.historyList) {
                // res.data.result.storeIconList
                //   const newData = {
                //     ...res.data.data,
                //     startDate: '2024.07.15',
                //     endDate: '08.31',
                //     specialStampIndexList: [5, 10, 15, 30],
                //   }
                resolve(res.data.result.historyList || [])
              } else {
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
