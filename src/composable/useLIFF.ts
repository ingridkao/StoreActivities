import { ref } from 'vue'
import { useRouter } from 'vue-router'

// https://developers.line.biz/en/docs/liff/pluggable-sdk/#activate-liff-api
import liff from '@line/liff/core'

// Functions that can be executed even before the LIFF app is initialized
import getOS from '@line/liff/get-os'
import isInClient from '@line/liff/is-in-client'

// Functions that need liff init
import isLoggedIn from '@line/liff/is-logged-in'
import getProfile from '@line/liff/get-profile'
import login from '@line/liff/login'
import logout from '@line/liff/logout'
import scanCodeV2 from '@line/liff/scan-code-v2'
// import isApiAvailable from '@line/liff/is-api-available'
// import getAccessToken from '@line/liff/get-access-token'

// The liff.use() method is executed before the liff.init() method
liff.use(new getOS())
liff.use(new isInClient())
liff.use(new isLoggedIn())
liff.use(new getProfile())
liff.use(new login())
liff.use(new logout())
liff.use(new scanCodeV2())
// liff.use(new isApiAvailable())

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
  const liffId = ref()
  const externalBrowserLogin = async (ct: string, ac: string) => {
    // 在Line的內部瀏覽器liff.init()在執行時會自動執行登入
    if (!liff.isInClient()) return

    // 讓URL有ct和ac
    const redirectUri: URL = new URL(import.meta.env.VITE_LIFF_ENDPOINT_URL)
    const params = {} as { ct?: string; ac?: string }
    if (ct) params['ct'] = String(ct)
    if (ac) params['ac'] = String(ac)
    const searchParams: URLSearchParams = new URLSearchParams(params)
    redirectUri.search = searchParams.toString()

    // 會導向login channel中LIFF設定的Endpoint URL
    const loginLine = (redirectUri: string) => {
      liff.login({
        redirectUri
      })
    }

    // 確認LIFF初始化以及沒有登入
    if (liffId.value && !liff.isLoggedIn()) {
      loginLine(redirectUri.href)
    } else {
      initLine().then((res) => {
        if (!res) {
          loginLine(redirectUri.href)
        }
      })
    }
  }

  const router = useRouter()
  const externalBrowserLogout = () => {
    // 無法在Line內部瀏覽器使用logout()
    if (liff.isInClient()) {
      // liff.closeWindow()
      // 開啟外部瀏覽器去大廳頁
    } else if (liffId.value && liff.isLoggedIn()) {
      liff.logout()
      router.push({ path: '/' })
    }
  }

  const getLineProfile = () => {
    const getUserProfile = () => {
      return new Promise((resolve, reject) => {
        liff
          .getProfile()
          .then((profile) => {
            resolve(profile || {})
          })
          .catch((e: Error) => {
            console.log('error', e)
            reject(e)
          })
      })
    }
    if (liffId.value && liff.isLoggedIn()) {
      return getUserProfile()
    } else {
      return initLine().then((res) => {
        if (res) {
          return getUserProfile()
        }
      })
    }
  }

  const liffError = ref('')
  const initLine = () => {
    return new Promise((resolve, reject) => {
      liff
        .init({
          liffId: import.meta.env.VITE_LIFF_ID
        })
        .then(() => {
          liffId.value = liff.id
          const userLoggedIn = liff.isLoggedIn()
          // console.log(import.meta.env.VITE_LIFF_ID)
          // console.log(liff.id)
          resolve(userLoggedIn)
        })
        .catch((e: Error) => {
          liffError.value = `${e}`
          reject(e)
        })
    })
  }

  // const scanCode = () => {
  //   if (liff.isInClient() && liffId.value) {
  //     // 使用scanCodeV2
  //     liff
  //       .scanCodeV2()
  //       .then((result) => {
  //         // result = { value: "" }
  //       })
  //       .catch((error) => {
  //         console.log('error', error)
  //       })
  //   } else {
  //     //換頁去scan
  //   }
  // }
  return {
    liffError,
    getUserOS,
    getOpenInClient,
    getLineProfile,
    externalBrowserLogin,
    externalBrowserLogout,
    initLine
  }
}
