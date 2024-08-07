import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import type { checkInVerifyBodyType, checkInVerifyHeaderType } from '@/types/RequestHandle'
import { ResponseCodes } from '@/types/ResponseHandle'
import type {
  GenrateMockQRCodeResType,
  VerifyCodeResType,
  CampaignBaseInterface,
  CampaignInterface,
  EventSimpleInterface,
  AdsInterface,
  AdListResType,
  ScanResultType,
  AlbumListType,
  EventListType,
  ReceivePrizeListType,
  RedeemPrizeType,
  AwardType,
  PrizeType,
  PrizeUiDisplayInfoType
} from '@/types/ResponseHandle'
import type { GenrateMockQRCodeState } from '@/types/StateHandle'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useEventStorage } from '@/composable/useEventStorage'

import { useUserStore } from '@/stores/user'
import apis from '@/api/apiRoutes'
import mockDatas from '@/api/mockData'
import EventContent from '@/assets/events'

const { VITE_API_URL, VITE_UI_MODE, MODE } = import.meta.env
let loginT0ken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFYUxvZ2luUHJvdGVjdERhdGEiOiJBZGk5ZS9OZXF4Mi93bC9NU0tJSllJYWdreHJXeW9hc1hROWdLVCsySFBKdE5vKzRPSUhaWDViT2dqY21ZMEI3cjA1a0N5U0t1d2dLdDRUUDRNWXVuS2NvUHVuYmpjdGx1TkFSNktpVUN0YmpMYnhTMGZEWHNEQkgzNXIxSk1DajZBdkNDM2xlc1BEcHY1b3lDMWpMUmc3YkcyWFhoTFh6RFprWHdPYlJKaDlZMHVLZVVXYm1aMEQ3RW8wSU1jdkdhYms2V3BHK29pK3ZEMWJJWG8wYUVHeXNia2swS3N0dk1TWjhnUXNWT0tmdHR6NWNaaHYreENuVTJva0lLTE5hd2dYWXF5bDYvV1NDalVJMVlSMm5oUT09IiwiZWF1IjoiNCIsImNyeXB0byI6ImVhX2NyeXB0byIsIm5iZiI6MTcxOTQ2OTExNSwiZXhwIjoxNzE5NDc2MzE1LCJpYXQiOjE3MTk0NjkxMTUsImlzcyI6IkV4dHJhQWN0aXZpdHlBcGkiLCJhdWQiOiJFeHRyYUFjdGl2aXR5QXBpIn0.vEEe3f0XIuAxeYWqgYh_AG-03JEpVpamO_cl0s2ryFU'

export function useFetchData() {
  const DEV = MODE === 'development'
  const { scanEntry, checkIn, prize, storeMap } = apis
  const userStore = useUserStore()
  const {
    setQRcodeString,
    setCtT0kenCookies,
    parseCtToStoreAndNumber,
    getQRcodeString,
    getT0kenCookies,
    setLineT0kenCookies,
    setLoginT0kenCookies,
    getLoginT0kenCookies,
    removeCtT0kenCookies
  } = useBrowserStorage()
  const { getEventsStorage, setEventsStorage } = useEventStorage()

  /**
   *  QRcode掃瞄出網址
   *  從URL字串中取出ct參數
   */
  const parseParamCT = (url: string): string => {
    const parsedUrl = new URL(url)
    const params = new URLSearchParams(parsedUrl.search)
    return params.get('ct') || ''
  }

  /**
   * 從URL字串中取出lat和lon參數 for dev
   */
  const parseParamLocation = (url: string): { lat: number | null; lon: number | null } => {
    const parsedUrl = new URL(url)
    const params = new URLSearchParams(parsedUrl.search)
    const latValue = params.get('lat')
    const lonValue = params.get('lon')
    return {
      lat: Number(latValue) || null,
      lon: Number(lonValue) || null
    }
  }

  /**
   * QRcode掃瞄出網址
   * 測試：從URL字串中取出lat和lon經緯度參數
   * 正式：
   */
  const parseClientLocation = (url: string): { lat: number | null; lon: number | null } => {
    // TODO dev取的URL
    const Location = parseParamLocation(url)
    return {
      ...Location
    }
  }

  // MockQRCodeData
  const genrateMockQRCode = (id: any, store: string): Promise<GenrateMockQRCodeState> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry
          .genrateMockQRCode(id, store)
          .then((res: GenrateMockQRCodeResType) => {
            if (res.qrCode) {
              resolve({
                ...res,
                store: res.qrCode.substring(2, 8)
              })
            } else {
              reject(`genrateMockQRCode:${res.error || '發生了例外錯誤'}`)
            }
          })
          .catch((error: string) => {
            reject(error)
          })
      } else {
        resolve(mockDatas.genrateMockQRCode)
      }
    })
  }

  /**
   * 驗證ct
   * 使用情境：
   *   1. Lobby URL中具有ct
   *   2. 活動頁面點選進入活動，如沒有經過驗證會開啟掃描取的ct
   *   2. QRCode掃描後得到ct
   * 參數：
   *  ct=OP666000031818094ac904=場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
   *  lat=存入pinia
   *  lon=存入pinia
   */
  const verifyCtString = (
    ctStr: string = '',
    lat: number | null = null,
    lon: number | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      userStore.updateLocation(lat, lon)

      if (ctStr === '') {
        reject('請選擇活動')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else {
        scanEntry
          .verifyQRString(ctStr)
          .then((res: any) => {
            if (res?.code === ResponseCodes.QRCODE_TIMEOUT) {
              reject('QRcode逾時，請點選門市 ibon 螢幕右上角的QRcode，即可以取得新的QRcode')
            } else if (res && res.token) {
              setQRcodeString(ctStr)
              setCtT0kenCookies(res.token)
              resolve(true)
            } else {
              reject(`verifyCtString:發生了例外錯誤`)
            }
          })
          .catch((error: string) => {
            reject(`verifyCtString:${error}`)
          })
      }
    })
  }

  /**
   * 已驗證ct，進行打卡驗證
   * 參數：
   *  eventId=活動ID
   *  ctCookies=需要ct中的storeId和number
   */
  const commitStoreCheckIn = async (
    eventId: string = '',
    ctStr: string = ''
  ): Promise<boolean | ScanResultType> => {
    const ctToken = getT0kenCookies()
    const loginT0kenObj = getLoginT0kenCookies()

    return new Promise((resolve, reject) => {
      if (eventId === '') {
        reject('此活動不存在，請重新操作')
      } else if (ctStr === null) {
        reject('請重新進行掃描打卡')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else if (ctToken === null) {
        reject('驗證錯誤，請重新操作')
      } else if (loginT0kenObj === null) {
        reject('訪客無法進行打卡，請重新操作')
      } else if (userStore.userLatitude === null || userStore.userLongitude === null) {
        reject('無法取得手機定位，請重新操作')
      } else {
        const { storeId, number } = parseCtToStoreAndNumber(ctStr)
        const { loginT0ken } = loginT0kenObj
        const headerKey = loginT0ken ? loginT0ken.slice(4, 10) : ''
        const data = {
          storeId: String(storeId),
          eventId: Number(eventId),
          key: String(number),
          latitude: userStore.userLatitude,
          longitude: userStore.userLongitude
        } as checkInVerifyBodyType
        const headers = {
          key: `${number}|||${headerKey}`,
          store: String(storeId),
          Auth1: ctToken,
          Auth2: loginT0ken
        } as checkInVerifyHeaderType
        checkIn
          .checkInVerify(data, headers)
          .then((res: any) => {
            const { code, msg, checkInStoreInfo } = res
            removeCtT0kenCookies()
            if (code === ResponseCodes.NO_EVENT) {
              reject('此活動不存在，請重新操作')
            } else if (code === ResponseCodes.STORE_AREA_ERROR) {
              reject('你不在門市所在位置，請重新操作')
            } else if (code === ResponseCodes.LINE_NOAUTH) {
              reject('訪客無法進行打卡，請重新操作')
            } else if ([ResponseCodes.VERIFY_FAIL, ResponseCodes.CHECKIN_FAIL].includes(code)) {
              reject('驗證錯誤，請重新操作')
            } else if (
              [
                ResponseCodes.SCAN_ONCE,
                ResponseCodes.CHECKIN_EXIST,
                ResponseCodes.CHECKIN_TODAY
              ].includes(code)
            ) {
              reject('此門市已經打卡過了')
            } else if (
              [
                ResponseCodes.QRCODE_STRING,
                ResponseCodes.QRCODE_FORMAT,
                ResponseCodes.QRCODE_TIMEOUT,
                ResponseCodes.QRCODE_NUMBER,
                ResponseCodes.STORE_ERROR,
                ResponseCodes.LOCATION_ERROR
              ].includes(code)
            ) {
              // reject(`${msg} 請重新進行掃描打卡`)
              reject(
                `${code}${msg}storeId: ${storeId}|eventId:${eventId}|longitude:${userStore.userLongitude}|latitude:${userStore.userLatitude}`
              )
            } else if (checkInStoreInfo) {
              // 成功蓋版，顯示打卡成功門市資訊
              resolve({
                eventId: String(eventId),
                storeId: checkInStoreInfo.storeId,
                storeName: checkInStoreInfo.storeName,
                date: checkInStoreInfo.checkInTime
              })
            } else {
              reject(`服務異常，${msg}`)
            }
          })
          .catch((error: string) => {
            removeCtT0kenCookies()
            reject(error)
          })
      }
    })
  }

  // 觸發兌獎
  const commitReceivePrize = async (eventId: string = ''): Promise<boolean | ScanResultType> => {
    const loginT0kenObj = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      if (eventId === '') {
        reject('此活動不存在，請重新操作')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else if (loginT0kenObj === null) {
        reject('訪客無法進行操作，請重新操作')
      } else {
        prize
          .commitReceivePrize(eventId, String(loginT0kenObj.loginT0ken))
          .then((res: any) => {
            if (res) {
              resolve(true)
            } else {
              reject(`服務異常，${res.result}`)
            }
          })
          .catch((error: any) => {
            reject(`服務異常，${error.msg}`)
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
        setLineT0kenCookies(accessToken)
        if (!VITE_API_URL) {
          resolve('template')
        } else {
          scanEntry
            .checkLineLoginVerify(accessToken)
            .then((res: VerifyCodeResType) => {
              if (res.result) {
                const serviceT0ken = res.token || ''
                setLoginT0kenCookies(serviceT0ken)
                resolve(serviceT0ken)
              } else {
                reject(`checkLineLoginVerify:${res.error || '發生了例外錯誤'}`)
              }
            })
            .catch((error: string) => {
              reject(error)
            })
        }
      } else {
        resolve('')
      }
    })
  }

  // 取得兌獎列表: 整理API Data >>> UI
  const fetchReceivePrize = async (eventId: string = ''): Promise<PrizeUiDisplayInfoType[]> => {
    const loginT0kenObj = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      resolve(mockDatas.WinningData)
      if (eventId === '') {
        reject('此活動不存在，請重新操作')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else if (loginT0kenObj === null) {
        reject('訪客無法進行操作，請重新操作')
      } else {
        prize
          .fetchReceivePrizeResult(eventId, String(loginT0kenObj.loginT0ken))
          .then((res: any) => {
            const newPrizeResultList: PrizeUiDisplayInfoType[] = []
            if (res && res.claimPrizeResultList) {
              res.claimPrizeResultList.forEach((prizeItem: ReceivePrizeListType) => {
                if (prizeItem.awardList) {
                  const awardList: AwardType[] = prizeItem.awardList ? prizeItem.awardList : []
                  const prizeList: PrizeType[] = prizeItem.claimPrizeList
                    ? prizeItem.claimPrizeList
                    : []
                  awardList.forEach((award: AwardType, index: number) => {
                    const matchPrize = prizeList[index] ? prizeList[index] : null
                    if (matchPrize) {
                      const obj = {
                        ...award,
                        grade: prizeItem.grade,
                        count: index + 1,
                        total: awardList.length,
                        serialNumber: matchPrize.serialNumber,
                        getSNTime: matchPrize.getSNTime
                      } as PrizeUiDisplayInfoType
                      newPrizeResultList.push(obj)
                    }
                  })
                }
              })
            }
            resolve(newPrizeResultList)
          })
          .catch((error: string) => {
            reject(error)
          })
      }
    })
  }

  const fetchAllCampaign = (storeId: string = ''): Promise<CampaignInterface[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_UI_MODE) {
        resolve([...mockDatas.eventMockData, ...mockDatas.specifyEventMockData])
      } else {
        Promise.all([scanEntry.fetchCampaign(), scanEntry.fetchSpecifyCampaign(storeId)])
          .then(([res1, res2]) => {
            if (res1.error) {
              reject(`fetchCampaign:${res1.error}`)
            } else if (res2.error) {
              reject(`fetchSpecifyCampaign:${res1.error}`)
            } else {
              const eventList = [...res1.queryList, ...res2.queryList]
              // 轉換數據
              const eventStorage = eventList.map((item) => {
                return {
                  id: item.id,
                  eventName: item.eventName,
                  startTime: item.startTime,
                  endTime: item.endTime,
                  isEnable: item.isEnable,
                  pageRouter: item.pageRouter,
                  redeemPrizeList: item.redeemPrizeList || []
                }
              })
              // 存在localstorage供後續頁面使用
              setEventsStorage(eventStorage)
              resolve(eventList || [])
            }
          })
          .catch((error: any) => {
            reject(error)
          })
      }
    })
  }

  const confirmEvent = (parameter: string | string[] = ''): Promise<EventSimpleInterface> => {
    return new Promise((resolve, reject) => {
      const activityId = String(parameter)

      // 取出localstorage活動的簡化資料
      let enevtList: CampaignBaseInterface[] = getEventsStorage()
      if (enevtList.length === 0) {
        const ctString = getQRcodeString()
        const { storeId } = parseCtToStoreAndNumber(ctString)
        fetchAllCampaign(storeId)
          .then((res: CampaignInterface[]) => {
            enevtList = res
          })
          .catch((error: string) => {
            console.error(error)
          })
      }

      const target = enevtList.find((item) => String(item.id) === activityId)
      if (!target) {
        // 找不到此活動
        reject(1)
      } else {
        const isEventActive = dayjs().isBetween(target.startTime, target.endTime, 'day', '[)')
        if (!target.isEnable || !isEventActive) {
          // 活動已關閉||活動時間未舉行
          reject(2)
        } else {
          // mapping活動內頁資料(src/assets/events.ts)
          const eventInfo = EventContent[activityId]
            ? EventContent[activityId]
            : EventContent['default']

          // 活動名稱換行
          const eventNameBreak =
            target.eventName && eventInfo.nameBreak
              ? target.eventName.slice(0, eventInfo.nameBreak) + '\n' + target.eventName.slice(2)
              : ''
          // 級距
          const obj = {
            id: target.id,
            start: target.startTime,
            end: target.endTime,
            eventName: target.eventName || '',
            eventNameBreak,
            headerImg: eventInfo.headerImg || '',
            content: eventInfo.content || [],
            redeemPrize: target.redeemPrizeList.map((item: RedeemPrizeType) => item.reachTarget)
          }
          resolve(obj)
        }
      }
    })
  }

  const fetchAdData = (): Promise<AdsInterface[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_UI_MODE) {
        resolve(mockDatas.adsData)
      } else {
        scanEntry
          .fetchAdData()
          .then((res: AdListResType) => {
            if (res.error) {
              reject(`fetchAdData:${res.error}`)
            } else {
              resolve(res.queryList || [])
            }
          })
          .catch((error: string) => {
            reject(error)
          })
      }
    })
  }

  const fetchAlbumData = (): Promise<AlbumListType> => {
    const loginT0ken = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      if (VITE_UI_MODE) {
        resolve(mockDatas.albumData)
      } else if (loginT0ken && loginT0ken.loginT0ken) {
        checkIn
          .fetchAlbum(loginT0ken.loginT0ken)
          .then((res: any) => {
            if (res.error) {
              reject(`fetchAlbumData:${res.error}`)
            } else {
              resolve(res)
            }
          })
          .catch((error: string) => {
            reject(error)
          })
      } else {
        reject('此服務需要登入')
      }
    })
  }

  const fetchCollectData = (activityId: string = ''): Promise<EventListType> => {
    const loginT0ken = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      if (VITE_UI_MODE) {
        resolve(mockDatas.CollectData)
      } else if (loginT0ken && loginT0ken.loginT0ken) {
        checkIn
          .fetchCollect(activityId, loginT0ken.loginT0ken)
          .then((res: any) => {
            if (res.error) {
              reject(`fetchCollectData:${res.error}`)
            } else {
              resolve({
                ...res
              })
            }
          })
          .catch((error: string) => {
            reject(`fetchCollectData:${error}`)
          })
      } else {
        reject('此服務需要登入')
      }
    })
  }

  // 讀取指定城市資料mockup
  // const originURL = window.location.origin
  // const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
  // const fetchLayerData = async (selectCity: string = '') => {
  //   const targerCity = String(selectCity)
  //   if (!targerCity) return false
  //   try {
  //     const geoRes = await axios.get(`${fileOrigin}/stores/map_${targerCity}.geojson`)
  //     if (geoRes && geoRes.data) return geoRes.data
  //     return false
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const fetchDefaultLayerData = async (long: number, lat: number) => {
    const loginCookies = getLoginT0kenCookies()
    if (!DEV) {
      if (loginCookies && loginCookies.loginT0ken) {
        loginT0ken = loginCookies.loginT0ken
      } else {
        throw '此服務需要登入'
      }
    }
    try {
      const geoRes = await storeMap.getGeoData(long, lat, '', loginT0ken)
      if (geoRes && geoRes.geojsonStr) {
        return JSON.parse(geoRes.geojsonStr)
      } else {
        // {storeCount: 0, storeList: null, geojsonStr: null}
        return null
      }
    } catch (error) {
      throw String(error)
    }
  }

  const fetchActiveLayerData = async (long: number, lat: number, activityId: string | string[]) => {
    const loginCookies = getLoginT0kenCookies()
    if (!DEV) {
      if (loginCookies && loginCookies.loginT0ken) {
        loginT0ken = loginCookies.loginT0ken
      } else {
        throw '此服務需要登入'
      }
    }
    try {
      const geoRes = await storeMap.getGeoData(long, lat, String(activityId), loginT0ken)
      if (geoRes && geoRes.geojsonStr) {
        return JSON.parse(geoRes.geojsonStr)
      } else {
        return null
      }
    } catch (error) {
      throw String(error)
    }
  }

  const fetchActiveIconData = async (activityId: string | string[]) => {
    if (!activityId) throw '需要指定活動'
    const loginCookies = getLoginT0kenCookies()
    if (!DEV) {
      if (loginCookies && loginCookies.loginT0ken) {
        loginT0ken = loginCookies.loginT0ken
      } else {
        throw '此服務需要登入'
      }
    }
    try {
      const iconRes = await storeMap.getIconData(Number(activityId), loginT0ken)
      return iconRes && iconRes.iconTypeList ? iconRes.iconTypeList: []
    } catch (error) {
      throw String(error)
    }
  }


  const addMap8UseCount = async () => {
    const loginCookies = getLoginT0kenCookies()
    if (!DEV) {
      if (loginCookies && loginCookies.loginT0ken) {
        loginT0ken = loginCookies.loginT0ken
      } else {
        throw '此服務需要登入'
      }
    }
    try {
      const logRes = await storeMap.setMap8UseLog(loginT0ken)
      return logRes 
    } catch (error) {
      throw String(error)
    }
  }
  return {
    parseParamCT,
    parseClientLocation,

    genrateMockQRCode,
    verifyCtString,
    commitStoreCheckIn,

    commitReceivePrize,
    fetchReceivePrize,

    checkLineLoginVerify,

    fetchAllCampaign,
    confirmEvent,
    fetchAdData,
    fetchAlbumData,
    fetchCollectData,

    // fetchLayerData,
    fetchDefaultLayerData,
    fetchActiveLayerData,
    fetchActiveIconData,

    addMap8UseCount
  }
}
