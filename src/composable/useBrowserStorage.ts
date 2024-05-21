import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import type { GenrateMockQRCodeState } from '@/types/StateHandle'

export function useBrowserStorage() {
  // - 儲存網站抓取的經緯度
  // TODO: 如果位置會一直移動好像存在store會比較好
  const setLocationStorage = (latitude: null | number = null, longitude: null | number = null) => {
    const toString = `${latitude},${longitude}`
    localStorage.setItem('location', toString)
  }
  const getLocationStorage = () => {
    const locationStorage = localStorage.getItem('location')
    return locationStorage ? locationStorage.split(',') : []
  }

  // - 儲存QRcode
  const setQRcodeCookies = (value: string = '') => {
    if (!value) return
    // 15分鐘後自動刪掉
    const inFiveMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
    Cookies.set('ct1', value, {
      expires: inFiveMinutes
    })
  }
  const getQRcodeCookies = () : GenrateMockQRCodeState => {
    const ctStr = Cookies.get('ct1')
    if(ctStr){
      return {
        qrCode: ctStr,
        store: ctStr.substring(2, 8)
      }
    }else{
      return {}
    }
  }

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

  // For ct response
  const getCtTokenCookies = () => Cookies.get('ct2') || ''
  const setCtTokenCookies = (value: string = '') => {
    if (!value) return
    // 15分鐘後自動刪掉
    const inFiveMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
    Cookies.set('ct2', value, {
      expires: inFiveMinutes
    })
  }
  const resetQRcodeCookies = () => {
    Cookies.remove('ct1')
    Cookies.remove('ct2')
  }

  const deleteStorage = (item: string) => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item)
    }
    if (sessionStorage.getItem(item)) {
      sessionStorage.removeItem(item)
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
    // 需要12小時後自動刪掉
    const inTwelveMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
    Cookies.set('t1', value, {
      expires: inTwelveMinutes
    })
  }

  const getServiceTokenCookies = () => Cookies.get('t2') || ''
  const setServiceTokenCookies = (value: string = '') => {
    if (!value) return
    // 需要12小時後自動刪掉
    const inTwelveMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
    Cookies.set('t2', value, {
      expires: inTwelveMinutes
    })
  }

  return {
    setLocationStorage,
    getLocationStorage,

    getAcStringStorage,
    setAcStringStorage,
    setParamsIdStorage,
    getQRcodeCookies,
    setQRcodeCookies,
    getCtTokenCookies,
    setCtTokenCookies,
    resetQRcodeCookies,
    deleteStorage,
    deleteSessionStorage,
    getLineTokenCookies,
    setLineTokenCookies,
    getServiceTokenCookies,
    setServiceTokenCookies
  }
}
