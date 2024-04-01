import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// https://developers.line.biz/en/docs/liff/pluggable-sdk/#activate-liff-api
import liff from '@line/liff/core'
import isInClient from '@line/liff/is-in-client'
import isLoggedIn from '@line/liff/is-logged-in'
import getOS from '@line/liff/get-os'
import getProfile from '@line/liff/get-profile'
import login from '@line/liff/login'
import logout from '@line/liff/logout'
// import isApiAvailable from '@line/liff/is-api-available'
import scanCodeV2 from '@line/liff/scan-code-v2'
// import getAccessToken from '@line/liff/get-access-token'

// The liff.use() method is executed before the liff.init() method
liff.use(new isInClient())
liff.use(new isLoggedIn())
liff.use(new getOS())
liff.use(new getProfile())
liff.use(new login())
liff.use(new logout())
// liff.use(new isApiAvailable())
liff.use(new scanCodeV2())

//liff.getOS(): 取得用戶端的作業系統，可能的值只有 ios, android 與 web
//liff.isInClient(): 判斷目前網頁是否跑在 LIFF Browser 底下，你可以藉此判斷是否要初始化 LIFF SDK 或透過 liff.closeWindow() 關閉視窗！
export function useLIFF() {
  const router = useRouter()

  const liffId = ref()
  const userOS = ref()
  const getUserOS = () => {
    userOS.value = liff.getOS()
    return userOS.value
  }

  const userLoggedIn = ref(false)
  const getUserLoggedIn = () => {
    userLoggedIn.value = liff.isLoggedIn()
    return userLoggedIn.value
  }

  const openInLIFF = ref(false)
  const getOpenInClient = () => {
    openInLIFF.value = liff.isInClient()
    return openInLIFF.value
  }

  // const scanCode = () => {
  //   if (openInLIFF.value && liffId.value) {
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

  const liffLogin = (redirectUri: string) => {
    const userLoggedIn = liff.isLoggedIn()
    if (userLoggedIn) return
    // 會導向login channel中LIFF設定的Endpoint URL
    liff.login({
      redirectUri
    })
  }

  const liffError = ref('')

  const externalBrowserLogin = async (ct: string, ac: string) => {
    // 無法在Line的內部瀏覽器使用login()
    if (openInLIFF.value) return

    // 讓URL有ct和ac
    const redirectUri: URL = new URL(import.meta.env.VITE_LIFF_ENDPOINT_URL)
    const params = {} as { ct?: string; ac?: string }
    if (ct) params['ct'] = String(ct)
    if (ac) params['ac'] = String(ac)
    const searchParams: URLSearchParams = new URLSearchParams(params)
    redirectUri.search = searchParams.toString()

    // 確認LIFF初始化
    if (liffId.value) {
      liffLogin(redirectUri.href)
    } else {
      liff
        .init({
          liffId: import.meta.env.VITE_LIFF_ID
        })
        .then(() => {
          liffId.value = liff.id
          liffLogin(redirectUri.href)
        })
        .catch((e: Error) => {
          liffError.value = `${e}`
        })
    }
  }

  const externalBrowserLogout = () => {
    const usetIsLoggedIn = getUserLoggedIn()
    if (!usetIsLoggedIn) return

    // 無法在Line的內部瀏覽器使用logout()
    if (openInLIFF.value) {
      // liff.closeWindow()
      // 開啟外部瀏覽器去大廳頁
    } else if (liffId.value) {
      liff.logout()
      router.push({ path: '/' })
    }
  }

  const userProfile = ref({})
  const getLineProfile = () => {
    liff
      .getProfile()
      .then((profile) => {
        userProfile.value = profile
      })
      .catch((err) => {
        console.log('error', err)
      })
  }
  const initLine = () => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        liffId.value = liff.id
        const usetIsLoggedIn = getUserLoggedIn()
        if (usetIsLoggedIn) {
          getLineProfile()
        }
      })
      .catch((e: Error) => {
        liffError.value = `${e}`
      })
  }

  onMounted(() => {
    console.log('onMounted')

    getOpenInClient()
    getUserOS()
  })

  return {
    liffError,
    userOS,
    userLoggedIn,
    openInLIFF,
    userProfile,
    getUserOS,
    getUserLoggedIn,
    getOpenInClient,
    externalBrowserLogin,
    externalBrowserLogout,
    initLine
  }
}
