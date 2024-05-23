import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
// import type { GenrateMockQRCodeState } from '@/types/StateHandle'

export function useBrowserStorage() {
  // 15分鐘後自動刪掉
  const inFiveMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
  // 12小時後自動刪掉
  const inTwelveMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)

  // - 儲存網站抓取的經緯度
  // TODO: 如果位置會一直移動好像存在store會比較好
  const setLocationStorage = (latitude: null | number = null, longitude: null | number = null) => {
    const toString = `${latitude},${longitude}`
    localStorage.setItem('STORE_LOCATION', toString)
  }
  const getLocationStorage = () => {
    const locationStorage = localStorage.getItem('STORE_LOCATION')
    return locationStorage ? locationStorage.split(',') : []
  }

  // 處理ct參數
  const setQRcodeString = (value: string = '') => {
    if (!value) return
    Cookies.set('STORE_CT', value, {
      expires: inFiveMinutes
    })
  }
  const getQRcodeString = (value: string = '') => {
    if (!value) return null
    const obj = Cookies.get('STORE_CT')
    if (!obj) return null
    return {
      storeId: obj.substring(2, 8)
    }
  }

  // 驗證QRCode後取得token
  // const getCtTokenCookies = () => Cookies.get('STORE_CT_T') || ''
  const setCtTokenCookies = (value: string = '') => {
    if (!value) return
    Cookies.set('STORE_CT_T', value, {
      expires: inFiveMinutes
    })
  }

  // 
  const getAcStringStorage = (): string => {
    return localStorage.getItem('ac') || ''
  }
  const setAcStringStorage = (activityId: string | string[]) => {
    if (activityId) {
      localStorage.setItem('ac', String(activityId))
    } else {
      localStorage.removeItem('ac')
    }
  }

  const setParamsIdStorage = () => {
    const route = useRoute()
    if (route.params && route.params.id) {
      localStorage.setItem('ac', String(route.params.id))
    } else {
      localStorage.removeItem('ac')
    }
  }

  const deleteSessionStorage = (item: string) => {
    if (sessionStorage.getItem(item)) {
      sessionStorage.removeItem(item)
    }
  }

  const getLineTokenCookies = () => Cookies.get('t1') || ''
  const setLineTokenCookies = (value: string = '') => {
    if (!value) return
    Cookies.set('t1', value, {
      expires: inTwelveMinutes
    })
  }

  const getServiceTokenCookies = () => Cookies.get('t2') || ''
  const setServiceTokenCookies = (value: string = '') => {
    if (!value) return
    // 需要12小時後自動刪掉
    Cookies.set('t2', value, {
      expires: inTwelveMinutes
    })
  }

  return {
    setLocationStorage,
    getLocationStorage,
    setQRcodeString,
    getQRcodeString,
    // getCtTokenCookies,
    setCtTokenCookies,

    getAcStringStorage,
    setAcStringStorage,
    setParamsIdStorage,

    deleteSessionStorage,
    getLineTokenCookies,
    setLineTokenCookies,
    getServiceTokenCookies,
    setServiceTokenCookies
  }
}
