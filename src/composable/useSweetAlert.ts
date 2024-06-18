import Swal, { type SweetAlertIcon } from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useDay } from '@/composable/useDay'

import type { EventInterface } from '@/types/ResponseHandle'
import content from '@/assets/content'
import closeIconImg from '@/assets/images/icon/close.svg'
import dialogCatImg from '@/assets/images/cat/dialog-cat.png'

export function useSweetAlert() {
  const router = useRouter()
  const { parseData } = useDay()

  const { VITE_ASSETS_URL, VITE_OUTDIR } = import.meta.env
  const originURL = window.location.origin
  const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
  const baseImgURL = `${fileOrigin}/images/example-store.png`

  const errorAlert = (
    text: any = '', 
    routerPath: string = '/', 
    iconName: SweetAlertIcon = 'error',
    title: string = content.swal.default
  ) => {
    return Swal.fire({
      icon: iconName,
      title: title,
      text: String(text)
    }).then((result: { isConfirmed?: boolean; isDismissed?: boolean }) => {
      if (result.isConfirmed || result.isDismissed) {
        router.push({ path: routerPath, replace: true })
      }
    })
  }

  const activityErrorAlert = (title: string, text: string = '') => {
    Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: content.storeInfoDialog.album,
      confirmButtonColor: '#ffce00',
      cancelButtonText: content.storeInfoDialog.lobby,
      cancelButtonColor: '#ffce00'
    }).then(
      (result: {
        isConfirmed?: boolean
        isDenied?: boolean
        isDismissed?: boolean
        value?: boolean
        dismiss?: any
      }) => {
        console.log(result)
        // click過去活動打卡紀錄isConfirmed: true | value: true
        if (result.isConfirmed) router.push({ path: '/album', replace: true })
        // click活動大廳isDismissed: true | dismiss: 'cancel'
        if (result.isDismissed && result.dismiss === 'cancel')
          router.push({ path: '/', replace: true })
        // click背景 isDismissed: true | dismiss:'backdrop'
      }
    )
  }

  const openStoreInfo = ({
    countShow,
    imageUrl,
    storeName,
    lastCheckInTime,
    count
  }: {
    countShow?: boolean
    imageUrl?: string
    storeName?: string
    lastCheckInTime?: string
    count?: number
  }) => {
    const countHTML = countShow
      ? `
      <div >
        <p>${content.storeInfoDialog.checkInCount}</p>
        <p>${count ?? count}</p>
      </div> 
    `
      : ''
    const imgURL = imageUrl ? `${VITE_ASSETS_URL}${imageUrl}` : baseImgURL

    Swal.fire({
      html: `
				<div class="store-info-dialog__dialog-container--content">
					<div class="store-info-dialog__dialog-container--content-image">
						<img src="${imgURL}" alt="${storeName ?? 'store'}門市"/>
					</div>
				</div>
				<div class="store-info-dialog__dialog-container--footer">
					<div class="store-info-dialog__dialog-container--footer-image">
						<img src="${dialogCatImg}" alt="掃描喵~" />
					</div>
					<div class="store-info-dialog__dialog-container--footer-info">
						<h6>${storeName ?? '7-11門市'}</h6>
            <div>
              <div>
                <p>${content.storeInfoDialog.lastCheckInTime}</p>
                <p>${parseData(lastCheckInTime)}</p>
              </div> 
              ${countHTML}
            </div> 
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
    storeItem: EventInterface,
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
						<h6>${storeItem.storeName || '7-11'}門市</h6>
						<p>${content.storeInfoDialog.lastCheckInTime}</p><p>${storeItem.createTime || 'YYYY-MM-DD HH:mm:ss'}</p>
					</div>
				`,
      imageUrl: storeIcon ? storeIcon : null,
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: `${storeItem.storeName || '7-11'}門市`,
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

  const authAlert = (error: string = '', goToLogin: () => void, isDismiss: () => void) => {
    return Swal.fire({
      icon: 'info',
      title: '進行LINE登入驗證',
      text: error
    }).then((result: { isConfirmed?: boolean; isDismissed?: boolean }) => {
      // 進行Line登入
      if (result.isConfirmed) goToLogin()
      // 拒絕登入返回至首頁
      if (result.isDismissed) isDismiss()
    })
  }
  return {
    errorAlert,
    activityErrorAlert,
    storeInfoAlert,
    geoLocationErrorAlert,
    openStoreInfo,
    authAlert
  }
}
