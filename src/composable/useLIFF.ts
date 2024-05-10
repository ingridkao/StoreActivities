// import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import type { ProfileType } from '@/composable/configurable'
import { useFetchData } from '@/composable/useFetch'
import { useUserStore } from '@/stores/user'
const { VITE_LIFF_ID, VITE_BASE_URL, VITE_LIFF_ENDPOINT_URL } = import.meta.env

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
// import getFriendship from '@line/liff/get-friendship'
// import getIDToken from '@line/liff/get-id-token'
import closeWindow from '@line/liff/close-window'
import scanCodeV2 from '@line/liff/scan-code-v2'
// import isApiAvailable from '@line/liff/is-api-available'

liff.use(new getOS())
liff.use(new isInClient())

liff.use(new login())
liff.use(new logout())
liff.use(new isLoggedIn())
liff.use(new getProfile())
liff.use(new getAccessToken())
// liff.use(new getFriendship())
// liff.use(new getIDToken())
liff.use(new closeWindow())
liff.use(new scanCodeV2())
// liff.use(new isApiAvailable())

export function useLIFF() {
	// ios || android || web
	const getUserOS = () => liff.getOS()

	// 判斷目前網頁是否跑在 LIFF Browser 底下
	// - 是否要初始化 LIFF SDK
	// - 是否要透過 liff.closeWindow() 關閉視窗！
	const getOpenInClient = (): boolean => liff.isInClient()

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

	const { 
		verifyQRCode, 
		commitStoreCheckIn, 
		checkLineLoginVerify
	} = useFetchData()
	const userStore = useUserStore()

	// https://developers.line.biz/en/reference/liff/#get-access-token
	const getLineProfileAndAccess = async (): Promise<ProfileType | undefined> => {
		try {
			const isInClient = liff.isInClient()
			await liff.init({ liffId: VITE_LIFF_ID })
			if(isInClient){
				// liff.init()在執行時會自動執行liff.login()
			}else if(!liff.isLoggedIn()){
				const { getAcStorage } = useBrowserStorage()
				const acString = getAcStorage()
				const redirectUri: URL = new URL(`${VITE_LIFF_ENDPOINT_URL}/${acString}`)
				console.log(redirectUri);
				
				liff.login({
					redirectUri: redirectUri.href
				})
			}  
			const lineAccessT0ken = liff.getAccessToken()
			const serviceT0ken = await checkLineLoginVerify(lineAccessT0ken || '')
			// TODO
			console.log(serviceT0ken);
			const profile = await liff.getProfile()
			userStore.updateProfile(profile)
			return profile
		} catch (err) {
			console.log(err)
		}
	}

	const scanCode = async () => {
		try {
			const isInClient = liff.isInClient()
			if(isInClient){
				await liff.init({ liffId: VITE_LIFF_ID })
				const scanresult = await liff.scanCodeV2()
				if(scanresult && scanresult.value){
					const codeSplit = scanresult.value.split(`${VITE_BASE_URL}/?ct=`)
					console.log(codeSplit);
					const ctCode = (codeSplit.length === 2 && codeSplit[1])?codeSplit[1]: ''
					const verifyRes = await verifyQRCode(ctCode)
					console.log(verifyRes);
					// const commitRes = await commitStoreCheckIn(verifyRes) 
					const qrcodeOk = (codeSplit.length === 2 && codeSplit[1])?true: false
					const commitRes = await commitStoreCheckIn(qrcodeOk)
					console.log(commitRes);
				}
				console.log(scanresult)
			}else{
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
		scanCode
	}
}
