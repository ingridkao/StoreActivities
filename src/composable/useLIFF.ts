import { useRouter } from 'vue-router'
import type { ProfileType } from '@/types/configurable'
import { useFetchData } from '@/composable/useFetch'
import { useUserStore } from '@/stores/user'

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
import getAccessToken from '@line/liff/get-access-token'
import closeWindow from '@line/liff/close-window'
import scanCodeV2 from '@line/liff/scan-code-v2'

liff.use(new getOS())
liff.use(new isInClient())

liff.use(new login())
liff.use(new logout())
liff.use(new isLoggedIn())
liff.use(new getProfile())
liff.use(new getAccessToken())
liff.use(new closeWindow())
liff.use(new scanCodeV2())

const { VITE_LIFF_ID } = import.meta.env
export function useLIFF() {
  // ios || android || web
  const getUserOS = () => liff.getOS()

  // 判斷目前網頁是否跑在 LIFF Browser 底下
  // - 是否要初始化 LIFF SDK
  // - 是否要透過 liff.closeWindow() 關閉視窗！
  const getOpenInClient = (): boolean => liff.isInClient()
  const userStore = useUserStore()
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
      userStore.updateProfile()
      router.push({ path: '/' })
    }
  }

  const { verifyQRCode, commitStoreCheckIn, checkLineLoginVerify } = useFetchData()

  // https://developers.line.biz/en/reference/liff/#get-access-token
  const getLineProfileAndAccess = async (
    activityId: string = ''
  ): Promise<ProfileType | undefined> => {
    try {
      await liff.init({ liffId: VITE_LIFF_ID })
      if (liff.isInClient()) {
        // liff.init()在執行時會自動執行liff.login()
      } else if (!liff.isLoggedIn()) {
        const redirectUri = `${window.location.origin}/activity/${activityId}`
        liff.login({
          redirectUri: redirectUri
        })
      }
      const lineAccessT0ken = liff.getAccessToken()
      await checkLineLoginVerify(lineAccessT0ken || '')
      if (Object.keys(userStore.userProfile).length > 0) {
        return userStore.userProfile
      } else {
        const profile = await liff.getProfile()
        userStore.updateProfile(profile)
        return profile
      }
    } catch (err) {
      console.error(err)
    }
  }

  // https://developers.line.biz/en/reference/liff/#get-access-token
  const getLineAccess = async (routerPath: string = ''): Promise<string | undefined> => {
    try {
      await liff.init({ liffId: VITE_LIFF_ID })
      if (liff.isInClient()) {
        // liff.init()在執行時會自動執行liff.login()
      } else if (!liff.isLoggedIn()) {
        const redirectUri = `${window.location.origin}${routerPath}`
        liff.login({
          redirectUri: redirectUri
        })
      }
      const lineAccessT0ken = liff.getAccessToken()
      const serviceT0ken = await checkLineLoginVerify(lineAccessT0ken || '')

      if (Object.keys(userStore.userProfile).length === 0) {
        const profile = await liff.getProfile()
        userStore.updateProfile(profile)
      }
      return serviceT0ken
    } catch (err) {
      console.error(err)
    }
  }

  const scanCode = async () => {
    try {
      const isInClient = liff.isInClient()
      if (isInClient) {
        await liff.init({ liffId: VITE_LIFF_ID })
        const scanresult = await liff.scanCodeV2()
        if (scanresult && scanresult.value) {
          const newPath = new URL(scanresult.value, window.location.origin)
          console.log(newPath)
          let ctCode = ''
          let qrcodeOk = false
          if (newPath.origin !== window.location.origin) {
            qrcodeOk = false
          } else if (newPath && newPath.search) {
            const codeSplit = newPath.search.split('?ct=')
            ctCode = codeSplit.length === 2 && codeSplit[1] ? codeSplit[1] : ''
            qrcodeOk = codeSplit.length === 2 && codeSplit[1] ? true : false
          }
          const verifyRes = await verifyQRCode(ctCode)
          console.log(verifyRes)
          // const commitRes = await commitStoreCheckIn(qrcodeOk)
          // console.log(commitRes)
        }
        console.log(scanresult)
      } else {
        router.push({ path: '/scan' })
      }
    } catch (err) {
      console.log(err)
      router.push({ path: '/scan' })
    }
  }

  return {
    getUserOS,
    getOpenInClient,
    useLineLogout,
    getLineProfileAndAccess,
    getLineAccess,
    scanCode
  }
}
