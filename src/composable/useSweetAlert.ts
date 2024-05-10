import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import type { CollectedListType } from '@/composable/configurable'
import data from '@/assets/data'
import closeIconImg from '@/assets/images/close-icon.svg'
import dialogCatImg from '@/assets/images/dialog-cat.png'

export function useSweetAlert() {
	const router = useRouter()

	const errorAlert = (text: any = '', routerPath: string = '/') => {
		return Swal.fire({
			icon: 'error',
			title: '出了一點問題',
			text: String(text)
		}).then(
			(result: {
				isConfirmed?: boolean
				isDismissed?: boolean
			}) => {
				console.log(result);
				if (result.isConfirmed || result.isDismissed) {
					router.push({ path: routerPath })
				}
			}
		)
	}

	const openStoreInfo = ({
		imageUrl,
		storeName,
		lastCheckInTime
	}: {
		imageUrl?: string
		storeName?: string
		lastCheckInTime?: string
	}) => {
		Swal.fire({
			html: `
				<div class="store-info-dialog__dialog-container--content">
					<div class="store-info-dialog__dialog-container--content-image">
						<img src="${imageUrl ?? '/images/example-store.png'}" alt="store"/>
					</div>
				</div>
				<div class="store-info-dialog__dialog-container--footer">
					<div class="store-info-dialog__dialog-container--footer-image">
						<img src="${dialogCatImg}" alt="cat"/>
					</div>
					<div class="store-info-dialog__dialog-container--footer-info">
						<h6>${storeName ?? '7-11門市'}</h6>
						<p>${data.storeInfoDialog.lastCheckInTime}</p>
						<p>${lastCheckInTime ?? 'YYYY-MM-DD HH:mm:ss'}</p>
					</div>
				</div>
			`,
			width: '313px',
			padding: 0,
			closeButtonHtml: `<img src="${closeIconImg}" alt="close"/>`,
			showCloseButton: true,
			showConfirmButton: false,
			customClass: {
				popup: 'store-info-dialog__dialog-popup',
				closeButton: 'store-info-dialog__close-icon',
				htmlContainer: 'store-info-dialog__dialog-container'
			}
		})
	}

	const storeInfoAlert = (
		storeItem: CollectedListType,
		imgImportUrl: string = '',
		storeIcon: string = ''
	) => {
		let imgBox: string = ''
		if (imgImportUrl) {
			imgBox = `
					<div class="imgBox">
						<img src="${imgImportUrl}" alt="喵喵人"/>
					</div>
				`
		}
		Swal.fire({
			html: `
					${imgBox}
					<div class="textBox">
						<h6>${storeItem.store_name || '7-11'}門市</h6>
						<p>最後打卡時間</p><p>${storeItem.checkInTime || 'YYYY-MM-DD HH:mm:ss'}</p>
					</div>
				`,
			imageUrl: storeIcon ? storeIcon : null,
			imageWidth: 300,
			imageHeight: 300,
			imageAlt: `${storeItem.store_name || '7-11'}門市`,
			showCloseButton: true,
			showConfirmButton: false,
			customClass: {
				//https://sweetalert2.github.io/#customClass
				htmlContainer: 'cat'
			}
		})
	}

	const geoLocationErrorAlert = (locationErrorString: string, resume: () => void) => {
		Swal.fire({
			icon: 'info',
			title: '打卡活動需要裝置位置資訊，請確認是否提供位置存取權',
			text: locationErrorString || '',
			showCancelButton: true,
			confirmButtonText: '開啟存取權',
			cancelButtonText: '拒絕'
		}).then(
			(result: {
				isConfirmed?: boolean
				isDenied?: boolean
				isDismissed?: boolean
				value?: boolean
			}) => {
				if (result.isConfirmed) {
					resume()
				}
			}
		)
	}

	return {
		errorAlert,
		storeInfoAlert,
		geoLocationErrorAlert,
		openStoreInfo
	}
}
