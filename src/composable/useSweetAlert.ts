import Swal from 'sweetalert2'
import type { CollectedListType } from '@/composable/configurable'

export function useSweetAlert() {
  const errorAlert = (text: any = '') => {
    return Swal.fire({
      icon: 'error',
      title: '出了一點問題',
      text: String(text)
    })
  }

  const storeInfoAlert = (storeItem: CollectedListType, imgImportUrl:string='', storeIcon:string='') => {
    // if (storeItem.store_id) {
      let imgBox:string = ''
      if(imgImportUrl){
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
        imageUrl: storeIcon? storeIcon: null,
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
    // } else {
    //   errorAlert()
    // }
  }

  const geoLocationErrorAlert = (locationErrorString: string, resume: () => void) => {
    Swal
    .fire({
      icon: 'info',
      title: '打卡活動需要裝置位置資訊，請確認是否提供位置存取權',
      text: locationErrorString || '',
      showCancelButton: true,
      confirmButtonText: '開啟存取權',
      cancelButtonText: '拒絕'
    })
    .then(
      (result: {
        isConfirmed: boolean
        isDenied: boolean
        isDismissed: boolean
        value: boolean
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
    geoLocationErrorAlert
  }
}
