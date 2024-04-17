// import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import type { ProfileType } from '@/composable/configurable'
// import { useFetchData } from '@/composable/useFetch'

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
// import getFriendship from '@line/liff/get-friendship'
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
// liff.use(new getFriendship())
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
  // const friendFlag = ref(false)
  // then  初始成功
  // catch 初始失敗
  const useLineInit = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      liff
        .init({
          liffId: import.meta.env.VITE_LIFF_ID
        })
        .then(() => {
          // liff.getFriendship().then((data) => {
          //   friendFlag.value = data && data.friendFlag ? data.friendFlag : false
          // })
          resolve(true)
        })
        .catch((e: Error) => {
          reject(Error(`初始失敗${e}`))
        })
    })
  }

  const useLineLogin = (): Promise<boolean|ProfileType> => {
    const redirectUri: URL = new URL(import.meta.env.VITE_LIFF_ENDPOINT_URL)
    return new Promise((resolve, reject) => {
      if (liff.isLoggedIn()) {
        liff
        .getProfile()
        .then((profile) => resolve(profile))
        .catch((e: Error) => reject(Error(`取得失敗${e}`)))

      } else {
        const { getAcStorage, getCtCookies } = useBrowserStorage()
        const ctStr = getCtCookies()
        const acStr = getAcStorage()
        const params = {} as { ct?: string; ac?: string }
        if (ctStr) params['ct'] = String(ctStr)
        if (acStr) params['ac'] = String(acStr)
        const searchParams: URLSearchParams = new URLSearchParams(params)
        redirectUri.search = searchParams.toString()
        liff.login({
          redirectUri: redirectUri.href
        })
      }
    })
  }

  const useLineProfile = (): Promise<ProfileType> => {
    return new Promise((resolve, reject) => {
      if (liff.isLoggedIn()) {
        liff
          .getProfile()
          .then((profile) => resolve(profile))
          .catch((e: Error) => reject(Error(`取得失敗${e}`)))
      } else {
        reject(Error(`未登入`))
      }
    })
  }

  const useLineScan = () => {
    return new Promise((resolve, reject) => {
      liff
        .scanCodeV2()
        .then((result) => resolve(result))
        .catch((error) => reject(`LineScan: ${error}`))
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

  const getLineProfile = async () => {
    try {
      await useLineInit()
      await useLineLogin()
      const profile = await useLineProfile()
      return profile || null
    } catch (error) {
      console.error(error)
    }
  }

  //const { verifyQRCode, commitStoreCheckIn } = useFetchData()
  const scanCode = async () => {
    const isInClient = getOpenInClient()
    try {
      if(isInClient){
        await useLineInit()
        await useLineLogin()
        const scanResult = await useLineScan()
        // 掃描出來的code
        alert(scanResult)
        // const verifyRes = await verifyQRCode(scanResult)
        // const commitRes = await commitStoreCheckIn(verifyRes)
        // console.log(commitRes);
        // 打卡成功或失敗->sweat alert
      }else{
        router.push({ path: '/scan' })
      }
    } catch (error) {
      alert(error)
      router.push({ path: '/scan' })
    }
  }
  return {
    getUserOS,
    getOpenInClient,
    useLineInit,
    useLineLogout,
    getLineProfile,
    scanCode
  }
}
