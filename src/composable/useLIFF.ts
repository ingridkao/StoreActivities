import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import type { ProfileType } from '@/composable/configurable'

// https://developers.line.biz/en/docs/liff/pluggable-sdk/#activate-liff-api
import liff from '@line/liff/core'
// Functions that can be executed even before the LIFF app is initialized
import getOS from '@line/liff/get-os'
import isInClient from '@line/liff/is-in-client'

// Functions that need liff init
// The liff.use() method is executed before the liff.init() method
import login from '@line/liff/login'
import logout from '@line/liff/logout'
import isLoggedIn from '@line/liff/is-logged-in'
import getProfile from '@line/liff/get-profile'
import getFriendship from '@line/liff/get-friendship'
// import getIDToken from '@line/liff/get-id-token'
import closeWindow from '@line/liff/close-window'
import scanCodeV2 from '@line/liff/scan-code-v2'
// import isApiAvailable from '@line/liff/is-api-available'
// import getAccessToken from '@line/liff/get-access-token'

liff.use(new getOS())
liff.use(new isInClient())

liff.use(new login())
liff.use(new logout())
liff.use(new isLoggedIn())
liff.use(new getProfile())
liff.use(new getFriendship())
// liff.use(new getIDToken())
liff.use(new closeWindow())
liff.use(new scanCodeV2())
// liff.use(new isApiAvailable())
// liff.use(new getAccessToken())

export function useLIFF() {
  // ios || android || web
  const getUserOS = () => {
    return liff.getOS()
  }

  // 判斷目前網頁是否跑在 LIFF Browser 底下
  // - 是否要初始化 LIFF SDK
  // - 是否要透過 liff.closeWindow() 關閉視窗！
  const getOpenInClient = (): boolean => {
    return liff.isInClient()
  }

  // ============================
  const friendFlag = ref(false)

  // then  初始成功未登入 = false
  // then  初始成功已登入 = true
  // catch 初始失敗
  const useLineInit = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      liff
        .init({
          liffId: import.meta.env.VITE_LIFF_ID
        })
        .then(() => {
          liff.getFriendship().then((data) => {
            friendFlag.value = data && data.friendFlag ? data.friendFlag : false
          })
          const userLoggedIn = liff.isLoggedIn()
          resolve(userLoggedIn || true)
        })
        .catch((e: Error) => {
          reject(Error(`初始失敗${e}`))
        })
    })
  }

  const useLineLogin = (): Promise<boolean> => {
    const redirectUri: URL = new URL(import.meta.env.VITE_LIFF_ENDPOINT_URL)
    return new Promise((resolve) => {
      if (liff.isLoggedIn()) {
        // 已登入
        resolve(true)
      } else if (liff.isInClient()) {
        // 不能在LIFF瀏覽器中使用
        // liff.init()在執行時會自動執行
        resolve(true)
      } else {
        const { getAcString, getCtString } = useBrowserStorage()
        const acStr = getAcString()
        const ctStr = getCtString()
        const params = {} as { ct?: string; ac?: string }
        if (acStr) params['ac'] = String(acStr)
        if (ctStr) params['ct'] = String(ctStr)
        const searchParams: URLSearchParams = new URLSearchParams(params)
        redirectUri.search = searchParams.toString()
        liff.login({
          redirectUri: redirectUri.href
        })
        resolve(true)
      }
    })
  }

  const useLineProfile = (isLoggedIn: boolean = false): Promise<ProfileType> => {
    return new Promise((resolve, reject) => {
      if (isLoggedIn) {
        liff
          .getProfile()
          .then((profile) => resolve(profile))
          .catch((e: Error) => reject(Error(`取得失敗${e}`)))
      } else {
        reject(Error(`未登入`))
      }
    })
  }

  const router = useRouter()
  const useLineLogout = () => {
    const isLogging = liff.isLoggedIn()
    if (!isLogging) return
    const isInLiff = liff.isInClient()
    if (isInLiff) {
      // liff.closeWindow();
      // 開啟外部瀏覽器去大廳頁
    } else {
      liff.logout()
      router.push({ path: '/' })
    }
  }

  const scanCodeByLine = (init: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (init) {
        liff
          .scanCodeV2()
          .then((result) => resolve(result))
          .catch((error) => reject(error))
      } else {
        reject('line init fall')
      }
    })
  }

  const isLogin = ref(false)
  const getLineProfile = async () => {
    try {
      isLogin.value = await useLineInit()
      isLogin.value = await useLineLogin()
      const profile: ProfileType = await useLineProfile(isLogin.value)
      return profile || {}
    } catch (error) {
      console.error(error)
    }
  }

  const scanCode = async () => {
    try {
      const isLoggedIn = await useLineInit()
      const scanRes = await scanCodeByLine(isLoggedIn)
      console.log(scanRes)
    } catch (error) {
      //換頁去scan
      console.error(error)
    }
  }
  return {
    isLogin,
    getUserOS,
    getOpenInClient,
    useLineInit,
    useLineLogout,
    getLineProfile,
    scanCode
  }
}
