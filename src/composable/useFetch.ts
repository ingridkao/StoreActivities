import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import type { checkInVerifyBodyType, checkInVerifyHeaderType } from '@/types/RequestHandle'
import { ResponseCodes } from '@/types/ResponseHandle'
import type {
  ApiResType,
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
import type { GenrateMockQRCodeState, ParseCtStringState } from '@/types/StateHandle'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useEventStorage } from '@/composable/useEventStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLayoutStore } from '@/stores/layout'
import apis from '@/api/apiRoutes'
import mockDatas from '@/api/mockData'
import EventContent from '@/assets/events'

const { VITE_API_URL, VITE_UI_MODE, VITE_OUTDIR } = import.meta.env

export function useFetchData() {
  const { scanEntry, checkIn, prize } = apis
  const layoutStore = useLayoutStore()
  const {
    getLocationStorage,
    setQRcodeString,
    parseCtT0ken,
    setCtT0kenCookies,
    getCtT0kenCookies,
    setLineT0kenCookies,
    setLoginT0kenCookies,
    getLoginT0kenCookies,
    removeCtT0kenCookies
  } = useBrowserStorage()
  const { getEventsStorage, setEventsStorage } = useEventStorage()

  /**
   * 從URL字串中取出ct參數
   * <URL>?ct=OP1134580513153032440f32024
   */
  const parseParamCT = (url: string): string => {
    const codeSplit = url.split('?ct=')
    return codeSplit.length === 2 && codeSplit[1] ? String(codeSplit[1]) : ''
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
   * Lobby and after scan
   * 取的CT驗證QRCode(CT字串)
   * ct=OP666000031818094ac904
   * 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
   */
  const verifyCtString = (ctStr: string = ''): Promise<ParseCtStringState | null> => {
    return new Promise((resolve, reject) => {
      if (ctStr === '') {
        reject('請選擇活動')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else {
        checkIn
        scanEntry
          .verifyQRString(ctStr)
          .then((res: ApiResType) => {
            if (res?.code === ResponseCodes.QRCODE_TIMEOUT) {
              reject('QRcode掃描失效，請點選門市 ibon 螢幕右上角的QRcode，即可以取得新的QRcode')
            } else {
              console.log(res)
              const { token } = res
              if (token) {
                setQRcodeString(ctStr)
                setCtT0kenCookies(token)
                if (!ctStr || !token) return resolve(null)
                const obj = parseCtT0ken(ctStr, token)
                resolve(obj)
              } else {
                reject(`verifyCtString:發生了例外錯誤`)
              }
            }
          })
          .catch((error: string) => {
            reject(error)
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

  // 打卡驗證
  const commitStoreCheckIn = async (
    eventId: string = '',
    t0kenObj: ParseCtStringState | null = null
  ): Promise<boolean | ScanResultType> => {
    const loginT0kenObj = getLoginT0kenCookies()
    const locationObj = getLocationStorage()
    return new Promise((resolve, reject) => {
      if (eventId === '') {
        reject('此活動不存在，請重新操作')
      } else if (!VITE_API_URL) {
        reject('服務中斷，請稍後再試')
      } else if (t0kenObj === null) {
        reject('請重新進行掃描打卡')
      } else if (loginT0kenObj === null) {
        reject('訪客無法進行打卡，請重新操作')
      } else {
        const { storeId, number, token } = t0kenObj
        const { loginT0ken } = loginT0kenObj
        const [latitude, longitude] = locationObj
        const data = {
          eventId: Number(eventId),
          longitude: Number(longitude),
          latitude: Number(latitude),
          storeId: storeId,
          key: number
        } as checkInVerifyBodyType
        const headerKey = loginT0ken ? loginT0ken.slice(4, 10) : ''
        const headers = {
          store: storeId,
          key: `${number}|||${headerKey}`,
          Auth1: token,
          Auth2: loginT0ken
        } as checkInVerifyHeaderType
        checkIn
          .checkInVerify(data, headers)
          .then((res: any) => {
            console.log(res)
            const { code, msg, checkInStoreInfo } = res
            if (code === ResponseCodes.NO_EVENT) {
              reject('此活動不存在，請重新操作')
            } else if (code === ResponseCodes.LOCATION_ERROR) {
              reject('你不在門市所在位置，請重新操作')
            } else if (code === ResponseCodes.LINE_NOAUTH) {
              reject('訪客無法進行打卡，請重新操作')
            } else if (checkInStoreInfo) {
              resolve({
                eventId: String(eventId),
                storeId: checkInStoreInfo.storeId,
                storeName: checkInStoreInfo.storeName,
                date: checkInStoreInfo.checkInTime
              })
            } else if (
              [
                ResponseCodes.SCAN_ONCE,
                ResponseCodes.CHECKIN_EXIST,
                ResponseCodes.CHECKIN_TODAY
              ].includes(code)
            ) {
              reject('此門市已經打卡過了')
            } else if ([ResponseCodes.VERIFY_FAIL, ResponseCodes.CHECKIN_FAIL].includes(code)) {
              reject('驗證錯誤，請重新操作')
            } else if (
              [
                ResponseCodes.QRCODE_STRING,
                ResponseCodes.QRCODE_FORMAT,
                ResponseCodes.QRCODE_TIMEOUT,
                ResponseCodes.QRCODE_NUMBER,
                ResponseCodes.STORE_ERROR
              ].includes(code)
            ) {
              reject('請重新進行掃描打卡')
            } else {
              reject(`服務異常，${msg}`)
            }
            removeCtT0kenCookies()
          })
          .catch((error: string) => {
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

  // 取得兌獎列表: 整理API Data >>> UI
  const fetchReceivePrize = async (eventId: string = ''): Promise<PrizeUiDisplayInfoType[]> => {
    const loginT0kenObj = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      // resolve(mockDatas.WinningData)
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
        const parseQrStringObj = getCtT0kenCookies()
        const storeId = parseQrStringObj ? parseQrStringObj.storeId || '' : ''
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
            eventName: target.eventName,
            eventNameBreak,
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
            console.log('未登入' + error)
            reject(error)
          })
      } else {
        reject('開發模式')
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
        reject('開發模式')
      }
    })
  }

  const originURL = window.location.origin
  const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''

  // 讀取指定城市資料
  const fetchLayerData = async (selectCity: string = '') => {
    const targerCity = String(selectCity)
    if (!targerCity) return false
    layoutStore.loadToggle(true)
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
        layoutStore.loadToggle(false)
      })
  }

  return {
    parseParamCT,
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
    fetchLayerData
  }
}
