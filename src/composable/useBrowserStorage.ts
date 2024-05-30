import Cookies from 'js-cookie'
import type { ParseCtStringState, AccessT0kenState } from '@/types/StateHandle'

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

  // 儲存ct參數
  const setQRcodeString = (ctStr: string = '') => {
    if (ctStr){
      Cookies.set('STORE_CT', ctStr, {
        expires: inFiveMinutes
      })
    }
  }

  // 儲存驗證ct後的token
  const setCtT0kenCookies = (t0ken: string = '') => {
    if (t0ken){
      Cookies.set('STORE_CT_T', t0ken, {
        expires: inFiveMinutes
      })
    }
  }
  
  // 解析
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+亂碼(1碼)+驗證碼(6碼)+時間戳記YYYY(4碼)
  const parseCtT0ken = (ctStr:string, t0ken:string) => {
    return {
      ctStr: ctStr,
      storeId: ctStr.substring(2, 8),
      number: ctStr.substring(17, 23),
      token: t0ken
    } as ParseCtStringState
  }

  // 取出儲存的ct及驗證ct後的token
  const getCtT0kenCookies = () => {
    const ctStr = Cookies.get('STORE_CT')
    const t0ken = Cookies.get('STORE_CT_T')
    if (!ctStr || !t0ken) return null
    return parseCtT0ken(ctStr, t0ken) || null
  }

  // 儲存line login的accessToken
  const setLineT0kenCookies = (accessToken: string = '') => {
    if (!accessToken) return
    Cookies.set('t1', accessToken, {
      expires: inTwelveMinutes
    })
  }

  // 儲存後台透過accessToken交換的token
  const setLoginT0kenCookies = (t0ken: string = '') => {
    if (!t0ken) return
    // 需要12小時後自動刪掉
    Cookies.set('t2', t0ken, {
      expires: inTwelveMinutes
    })
  }

  // 取出儲存的line login的accessToken
  // 取出儲存的後台登入token
  const getLoginT0kenCookies = () => {
    const accessT0ken = Cookies.get('t1')
    const loginT0ken = Cookies.get('t2')
    if (!accessT0ken || !loginT0ken) return null
    return {
      accessT0ken,
      loginT0ken
    } as AccessT0kenState
  }

  const getAcStringStorage = (): string => {
    return localStorage.getItem('ac') || ''
  }
  const setAcStringStorage = (activityId: string | string[]) => {
    if (activityId) localStorage.setItem('ac', String(activityId))
  }

  return {
    setLocationStorage,
    getLocationStorage,
    setQRcodeString,
    parseCtT0ken,
    getCtT0kenCookies,
    setCtT0kenCookies,
    setLineT0kenCookies,
    setLoginT0kenCookies,
    getLoginT0kenCookies,
    getAcStringStorage,
    setAcStringStorage,
  }
}
