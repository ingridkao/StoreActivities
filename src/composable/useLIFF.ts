import { useRouter } from 'vue-router'
import type { ProfileType } from '@/types/LineHandle'
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
const ORIGIN_URL = import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5173/'

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

  const { checkLineLoginVerify, parseParamCT } = useFetchData()

  // https://developers.line.biz/en/reference/liff/#get-access-token
  const getLineProfileAndAccess = async (
    activityId: string = ''
  ): Promise<ProfileType | undefined> => {
    try {
      await liff.init({ liffId: VITE_LIFF_ID })
      if (liff.isInClient()) {
        // liff.init()在執行時會自動執行liff.login()
      } else if (!liff.isLoggedIn()) {
        const redirectUri = `${ORIGIN_URL}/activity/${activityId}`
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

  // InLIFFClient: 開啟LINE SCAN，開啟相機掃描QRcode取得qrcode string
  // Out LIFF app: 導轉到掃描頁面
  const scanCode = async (): Promise<string | void> => {
    try {
      const isInClient = liff.isInClient()
      if (!isInClient) {
        router.push({ path: '/scan' })
      } else {
        await liff.init({ liffId: VITE_LIFF_ID })

        const scanresult = await liff.scanCodeV2()
        if (scanresult && scanresult.value) {
          // 掃瞄出網址取出ct
          const newPath = new URL(scanresult.value, ORIGIN_URL)
          return newPath && newPath.search ? parseParamCT(newPath.search) : ''
        } else {
          return ''
        }
      }
    } catch (err) {
      throw new Error('Failed: ' + err)
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
