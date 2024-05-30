import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import type { checkInVerifyBodyType, checkInVerifyHeaderType } from '@/types/RequestHandle'
import { ResponseCodes } from '@/types/ResponseHandle'
import type {
  GenrateMockQRCodeResType,
  VerifyCodeResType,
  EventInterface,
  EventInfoInterface,
  AdsInterface,
  AdListResType
} from '@/types/ResponseHandle'
import type { GenrateMockQRCodeState, ParseCtStringState } from '@/types/StateHandle'
import type { AlbumType, CollectedType, ScanResultType } from '@/types/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useEventStorage } from '@/composable/useEventStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLayoutStore } from '@/stores/layout'
import apis from '@/api/apiRoutes'
import mockDatas from '@/api/mockData'
import EventContent from '@/assets/events'

const { VITE_API_URL, VITE_UI_MODE, VITE_OUTDIR } = import.meta.env

export function useFetchData() {
  const { scanEntry, checkIn } = apis
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
    setAcStringStorage,
    getAcStringStorage,
  } = useBrowserStorage()
  const { getEventStorage, setEventStorage } = useEventStorage()

  /**
   * 從URL字串中取出ct參數
   * <URL>?ct=OP1134580513153032440f32024
   */
  const parseParamCT = (url: string):string => {
    const codeSplit = url.split('?ct=')
    return codeSplit.length === 2 && codeSplit[1] ? String(codeSplit[1]) : ''
  }

  // MockQRCodeData
  const genrateMockQRCode = (): Promise<GenrateMockQRCodeState> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.genrateMockQRCode().then((res: GenrateMockQRCodeResType) => {
          if (res.qrCode) {
            resolve({
              ...res,
              store: res.qrCode.substring(2, 8)
            })
          } else {
            reject(`genrateMockQRCode:${res.error || '發生了例外錯誤'}`)
          }
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
  const verifyCtString = (ctStr: string = ''): Promise<ParseCtStringState|null> => {
    return new Promise((resolve, reject) => {
      if (ctStr === '') {        
        reject('請選擇活動')
      } else if (!VITE_API_URL) {
        reject('服務中斷')
      } else {
        checkIn
        scanEntry.verifyQRString(ctStr).then((res: VerifyCodeResType) => {
          if (res.token) {
            setQRcodeString(ctStr)
            setCtT0kenCookies(res.token)
            if (!ctStr || !res.token) return resolve(null)
            const obj = parseCtT0ken(ctStr, res.token)
            console.log(obj);
            resolve(obj)
          } else {
            reject(`verifyCtString:${res.error || '發生了例外錯誤'}`)
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
        setLineT0kenCookies(accessToken)
        scanEntry.checkLineLoginVerify(accessToken).then((res: VerifyCodeResType) => {
          if (res.result) {
            const serviceT0ken = res.token || ''
            setLoginT0kenCookies(serviceT0ken)
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

  // 打卡驗證
  const commitStoreCheckIn = async (activityId: string | string[] = '', t0kenObj: ParseCtStringState|null=null): Promise<boolean | ScanResultType> => {
    const loginT0kenObj = getLoginT0kenCookies()
    const locationObj = getLocationStorage()
    if (activityId === '') {
      activityId = getAcStringStorage()
    }
    return new Promise((resolve, reject) => {
      if (activityId === '') {
        reject(1)
      } else if (!VITE_API_URL) {
        reject(2)
      } else if (t0kenObj === null) {
        reject(3)
      } else if (loginT0kenObj === null) {
        reject(4)
      } else {
        const {storeId,number,token} = t0kenObj
        const {loginT0ken} = loginT0kenObj
        const [latitude, longitude] = locationObj

        const data = {
          eventId: String(activityId),
          longitude: Number(longitude),
          latitude: Number(latitude),
          storeId: storeId,
          key: number,
        } as checkInVerifyBodyType
        const headerKey = loginT0ken? loginT0ken.slice(4, 10):''
        const headers = {
          store: storeId,
          key: `${number}|||${headerKey}`,
          Auth1: token,
          Auth2: loginT0ken
        } as checkInVerifyHeaderType
        checkIn
          .checkInVerify(data, headers)
          .then((res: any) => {
            resolve(res)
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

  /**
   * 取得活動列表
   */
  // const fetchCampaign = (): Promise<EventInterface[]> => {
  //   return new Promise((resolve, reject) => {
  //     if (VITE_API_URL) {
  //       scanEntry.fetchCampaign().then((res: EventListResType) => {
  //         if (res.error) {
  //           reject(`fetchCampaign:${res.error}`)
  //         } else {
  //           resolve(res.queryList || [])
  //         }
  //       })
  //     } else {
  //       resolve(mockDatas.eventMockData)
  //     }
  //   })
  // }
  // const fetchSpecifyCampaign = (storeId: string = ''): Promise<EventInterface[]> => {
  //   return new Promise((resolve, reject) => {
  //     if (VITE_API_URL) {
  //       scanEntry.fetchSpecifyCampaign(storeId).then((res: EventListResType) => {
  //         if (res.error) {
  //           reject(`fetchSpecifyCampaign:${res.error}`)
  //         } else {
  //           resolve(res.queryList || [])
  //         }
  //       })
  //     } else {
  //       resolve(mockDatas.specifyEventMockData)
  //     }
  //   })
  // }
  const fetchAllCampaign = (storeId: string = ''): Promise<EventInterface[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
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
                  pageRouter: item.pageRouter
                }
              })
              // 存在localstorage供後續頁面使用
              setEventStorage(eventStorage)
              resolve(eventList || [])
            }
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        resolve([...mockDatas.eventMockData, ...mockDatas.specifyEventMockData])
      }
    })
  }

  const confirmCampaign = (parameter: string | string[] = ''): Promise<EventInfoInterface> => {
    return new Promise((resolve, reject) => {
      const activityId = String(parameter)

      // 取出localstorage活動的簡化資料
      let enevtList: EventInterface[] = getEventStorage()
      if (enevtList.length === 0) {
        const parseQrStringObj = getCtT0kenCookies()
        const storeId = parseQrStringObj ? parseQrStringObj.storeId || '' : ''
        fetchAllCampaign(storeId).then((res: EventInterface[]) => {
          enevtList = res
        })
      }

      const target = enevtList.find((item) => String(item.pageRouter) === activityId)
      if (!target) {
        // 找不到此活動
        reject(1)

      } else {
        const isEventActive = dayjs().isBetween(target.startTime, target.endTime, 'day', '[)')
        if (!target.isEnable || !isEventActive) {
          // 活動已關閉||活動時間未舉行
          reject(2)

        } else {
          setAcStringStorage(activityId)
          // mapping活動內頁資料(src/assets/events.ts)
          const eventInfo = EventContent[activityId]
            ? EventContent[activityId]
            : EventContent['default']

          // 活動名稱換行
          const eventName =
            target.eventName && eventInfo.nameBreak
              ? target.eventName.slice(0, eventInfo.nameBreak) + '\n' + target.eventName.slice(2)
              : ''
          const year = dayjs(target.startTime).year() || ''
          const startDate = dayjs(target.startTime).format('M.D') || ''
          const endDate = dayjs(target.endTime).format('M.D') || ''
          resolve({
            eventName,
            year,
            startDate,
            endDate,
            content: eventInfo.content || []
          })
        }
      }
    })
  }

  const fetchAdData = (): Promise<AdsInterface[]> => {
    return new Promise((resolve, reject) => {
      if (VITE_API_URL) {
        scanEntry.fetchAdData().then((res: AdListResType) => {
          if (res.error) {
            reject(`fetchAdData:${res.error}`)
          } else {
            resolve(res.queryList || [])
          }
        })
      } else {
        resolve(mockDatas.adsData)
      }
    })
  }

  const fetchAlbumData = (): Promise<AlbumType[]> => {
    const loginT0ken = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      if (loginT0ken && loginT0ken.loginT0ken) {
        checkIn.fetchAlbum(loginT0ken.loginT0ken).then((res: any) => {
          if (res.error) {
            reject(`fetchAlbumData:${res.error}`)
          } else {
            resolve(res.historyList || [])
          }
        })
      } else if (VITE_API_URL || VITE_UI_MODE) {
        resolve(mockDatas.albumData)
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
    const loginT0ken = getLoginT0kenCookies()
    return new Promise((resolve, reject) => {
      if (VITE_API_URL && loginT0ken && loginT0ken.loginT0ken) {
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
                Authorization: loginT0ken.loginT0ken,
                Key: loginT0ken.loginT0ken.slice(4, 10),
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
    checkLineLoginVerify,
    // fetchCampaign,
    // fetchSpecifyCampaign,
    fetchAllCampaign,
    confirmCampaign,
    fetchAdData,
    fetchAlbumData,
    fetchCollectData,
    fetchLayerData
  }
}
