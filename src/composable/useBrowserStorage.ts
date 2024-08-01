import Cookies from 'js-cookie'
import type { ParseCtStringState, AccessT0kenState } from '@/types/StateHandle'

export function useBrowserStorage() {
  // 15分鐘後自動刪掉
  const inFiveMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
  // 12小時後自動刪掉
  const inTwelveMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)

  // 儲存ct字串
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+亂碼(1碼)+驗證碼(6碼)+時間戳記YYYY(4碼)
  const setQRcodeString = (ctStr: string = '') => {
    if (ctStr) {
      Cookies.set('STORE_CT', ctStr, {
        expires: inFiveMinutes
      })
    }
  }

  // 取出儲存的ct string
  const getQRcodeString = () => {
    const ctStr = Cookies.get('STORE_CT')
    return ctStr || ''
  }

  // 解析ct
  // 店號(6碼)
  // 驗證碼(6碼)
  const parseCtToStoreAndNumber = (ctStr: string) => {
    return {
      storeId: ctStr ? ctStr.substring(2, 8) : null,
      number: ctStr ? ctStr.substring(17, 23) : null
    } as ParseCtStringState
  }

  // 儲存驗證ct後的token
  const setCtT0kenCookies = (ctToken: string = '') => {
    if (ctToken) {
      Cookies.set('STORE_CT_T', ctToken, {
        expires: inFiveMinutes
      })
    }
  }

  // 取出儲存在cookies中驗證ct後的token
  const getT0kenCookies = () => {
    const t0ken = Cookies.get('STORE_CT_T')
    return t0ken || null
  }

  // 移除儲存的ct及驗證ct後的token
  const removeCtT0kenCookies = () => {
    Cookies.remove('STORE_CT')
    Cookies.remove('STORE_CT_T')
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

  return {
    setQRcodeString,
    getQRcodeString,

    parseCtToStoreAndNumber,
    getT0kenCookies,

    removeCtT0kenCookies,
    setCtT0kenCookies,
    setLineT0kenCookies,
    setLoginT0kenCookies,
    getLoginT0kenCookies
  }
}
