import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import { ResponseCodes } from '@/types/ResponseHandle'
import type {
  GenrateMockQRCodeResType,
  VerifyCodeApiResType,
  EventInterface,
  EventInfoInterface,
  AdsInterface,
  AdListResType
} from '@/types/ResponseHandle'
import type { GenrateMockQRCodeState, VerifyCodeState } from '@/types/StateHandle'
import type { AlbumType, CollectedType, ScanResultType } from '@/types/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useEventStorage } from '@/composable/useEventStorage'
// import { useLIFF } from '@/composable/useLIFF'

import { useLoadingStore } from '@/stores/loading'
import apis from '@/api/apiRoutes'
import mockDatas from '@/api/mockData'
import EventContent from '@/assets/events'

const { VITE_API_URL, VITE_UI_MODE, VITE_OUTDIR } = import.meta.env

export function useFetchData() {
  const { scanEntry, checkIn } = apis
  const loadStore = useLoadingStore()
  const {
    getLocationStorage,
    setQRcodeString,
    setCtTokenCookies,
    getAcStringStorage,
    setLineTokenCookies,
    setServiceTokenCookies,
    getServiceTokenCookies,
    getQRcodeString
  } = useBrowserStorage()
  const { getEventStorage, setEventStorage } = useEventStorage()

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
   * 驗證QRCode
   * ct=OP666000031818094ac904
   * 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
   */
  const verifyQRCode = (ctStr: string = ''): Promise<VerifyCodeState> => {
    return new Promise((resolve, reject) => {
      if (ctStr === '') {
        reject('請選擇活動')
      } else if (!VITE_API_URL) {
        reject('服務中斷')
      } else {
        checkIn
        scanEntry.verifyQRCode(ctStr).then((res: VerifyCodeApiResType) => {
          if (res.token) {
            setQRcodeString(ctStr)
            setCtTokenCookies(res.token)
            resolve({
              ctStr: ctStr,
              // store: ctStr.substring(2, 8),
              token: res.token
            })
          } else {
            reject(`verifyQRCode:${res.error || '發生了例外錯誤'}`)
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
        scanEntry.checkLineLoginVerify(accessToken).then((res: VerifyCodeApiResType) => {
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
  const commitStoreCheckIn = async (activityId: string = ''): Promise<boolean | ScanResultType> => {
    const serviceT0ken = getServiceTokenCookies()
    const [latitude, longitude] = getLocationStorage()
    if (activityId === '') {
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
        checkIn
          .checkInVerify(Number(activityId), Number(longitude), Number(latitude))
          .then((res: any) => {
            console.log(res)

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
        const parseQrStringObj = getQRcodeString()
        const storeId = parseQrStringObj ? parseQrStringObj.storeId || '' : ''
        debugger
        fetchAllCampaign(storeId).then((res: EventInterface[]) => {
          enevtList = res
        })
      }

      const target = enevtList.find((item) => String(item.pageRouter) === activityId)
      if (!target) {
        // 找不到此活動
        reject(2)
      } else {
        const isEventActive = dayjs().isBetween(target.startTime, target.endTime, 'day', '[)')
        console.log(isEventActive)
        if (!target.isEnable || !isEventActive) {
          // 活動已關閉||活動時間未舉行
          reject(1)
        } else {
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
    const serviceT0ken = getServiceTokenCookies()
    return new Promise((resolve, reject) => {
      if (serviceT0ken) {
        checkIn.fetchAlbum(serviceT0ken).then((res: any) => {
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
