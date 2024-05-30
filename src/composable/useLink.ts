import { useRouter } from 'vue-router'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useBrowserStorage } from '@/composable/useBrowserStorage'

export function useLink() {
  const router = useRouter()
  const { errorAlert } = useSweetAlert()
  const { getAcStringStorage } = useBrowserStorage()
  const getQueryParam = (url: string, param: string) => {
    // eslint-disable-next-line no-useless-escape
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
    const results = regex.exec(url)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  const linkToAlbum = () => {
    router.push({ name: 'Album' })
  }

  const linkToCatchDirection = () => {
    // TODO: 提示離開此頁面
    const activityId = getAcStringStorage()
    if (activityId === '') {
      errorAlert('找不到此活動，回到活動大廳')
    } else {
      router.push({
        name: 'Activity',
        params: {
          id: String(activityId)
        }
      })
    }
  }

  const linkToTargetActivityIdPage = (
    activityId: string | string[] = '',
    routerName: string = ''
  ) => {
    const catchActivityId = getAcStringStorage()
    if (activityId === '' && catchActivityId === '') {
      errorAlert('找不到此活動，回到活動大廳')
    } else {
      router.push({
        name: routerName,
        params: {
          id: String(activityId || catchActivityId)
        }
      })
    }
  }

  return {
    getQueryParam,
    linkToAlbum,
    linkToCatchDirection,
    linkToTargetActivityIdPage
  }
}
