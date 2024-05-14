import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'

export function useBrowserStorage() {
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

  // const getCtStringCookies = () => Cookies.get('ct1') || ''
  const setCtStringCookies = (value: string = '') => {
    if (!value) return
    // 需要五分鐘後自動刪掉
    const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000)
    Cookies.set('ct1', value, {
      expires: inFiveMinutes
    })
  }
  // For ct response
  const getCtTokenCookies = () => Cookies.get('ct2') || ''
  const setCtTokenCookies = (value: string = '') => {
    if (!value) return
    // 需要五分鐘後自動刪掉
    const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000)
    Cookies.set('ct2', value, {
      expires: inFiveMinutes
    })
  }
  const resetCtStringCookies = () => {
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

  const setLocationStorage = (latitude: null | number = null, longitude: null | number = null) => {
    const toString = `${latitude},${longitude}`
    localStorage.setItem('location', toString)
  }

  // const getLocationStorage = () => {
  //   const locationStorage = localStorage.getItem('location')
  //   return locationStorage ? locationStorage.split(',') : []
  // }

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
    getAcStringStorage,
    setAcStringStorage,
    setParamsIdStorage,
    // getCtStringCookies,
    setCtStringCookies,
    getCtTokenCookies,
    setCtTokenCookies,
    resetCtStringCookies,
    deleteStorage,
    deleteSessionStorage,
    setLocationStorage,
    // getLocationStorage,
    getLineTokenCookies,
    setLineTokenCookies,
    getServiceTokenCookies,
    setServiceTokenCookies
  }
}
