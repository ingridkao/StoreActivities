import Swal, { type SweetAlertIcon } from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useDay } from '@/composable/useDay'
import { useLayoutStore } from '@/stores/layout'

import type { EventInterface, AwardType } from '@/types/ResponseHandle'
import content from '@/assets/content'
import closeIconImg from '@/assets/images/icon/close.svg'
import dialogCatImg from '@/assets/images/cat/dialog-cat.png'
import successCatImg from '@/assets/images/cat/check-success-cat.png'

export function useSweetAlert() {
  const router = useRouter()
  const { parseData } = useDay()
  const layoutStore = useLayoutStore()

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
        layoutStore.loadToggle(false)
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
				<div class="custom-dialog-container-content store-info-content">
					<div class="store-info-content-image">
						<img src="${imgURL}" alt="${storeName ?? 'store'}門市"/>
					</div>
				</div>
				<div class="custom-dialog-container-footer">
					<div class="store-info-footer-image">
						<img src="${dialogCatImg}" alt="掃描喵~" />
					</div>
					<div class="custom-dialog-container-footer-info">
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
        popup: 'custom-dialog-popup',
        closeButton: 'custom-dialog-closeicon',
        htmlContainer: 'custom-dialog-container'
      }
    })
  }

  const openPrizeInfo = (award: AwardType, remaining: number = 0) => {
    Swal.fire({
      html: `
        <div class="custom-dialog-container-content awards-info-content">
          <div class="awards-info-content-list">
            <h6>
              再打卡<b> ${remaining} 家</b>門市! <br>
              即可以兌換${award.awardName}!!
            </h6>
            <P>${award.operatingProcedures}</P>
          </div>
        </div>
        <div class="custom-dialog-container-footer">
          <div class="store-info-footer-image">
            <img src="${successCatImg}" alt="開心喵~" />
          </div>
          <div class="custom-dialog-container-footer-info awards-info-footer-info">
            <h6>${award.instructions}</h6>
            <div>
              <div>
                <p>${content.winning.deadline}</p>
                <p>${award.useInterval}</p>
              </div> 
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
        popup: 'custom-dialog-popup awards-info-popup',
        closeButton: 'custom-dialog-closeicon',
        htmlContainer: 'custom-dialog-container'
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

  const mapErrorAlert = (errorString: string, activityId: string | string[] = '') => {
    Swal.fire({
      icon: 'info',
      title: '地圖功能異常',
      text: errorString || ''
    }).then((result: { isConfirmed?: boolean; isDismissed?: boolean }) => {
      if (result.isConfirmed || result.isDismissed) {
        if (activityId) {
          router.push({ path: `/activity/${activityId}`, replace: true })
        } else {
          router.push({ path: '/', replace: true })
        }
        layoutStore.loadToggle(false)
      }
    })
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
    mapErrorAlert,
    openStoreInfo,
    openPrizeInfo,
    authAlert
  }
}
