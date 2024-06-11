import { useRouter } from 'vue-router'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useEventStorage } from '@/composable/useEventStorage'

export function useLink() {
  const router = useRouter()
  const { errorAlert } = useSweetAlert()
  const { getTargetEventStorage } = useEventStorage()

  const getQueryParam = (url: string, param: string) => {
    // eslint-disable-next-line no-useless-escape
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
    const results = regex.exec(url)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  const linkToTargetActivityIdPage = (
    activityId: string | string[] = '',
    routerName: string = ''
  ) => {
    if (activityId === '') {
      const TargetEvent = getTargetEventStorage()
      activityId = String(TargetEvent?.id)
    }
    if (activityId === '') {
      errorAlert('找不到此活動，回到活動大廳')
    } else {
      router.push({
        name: routerName,
        params: {
          id: activityId
        }
      })
    }
  }

  return {
    getQueryParam,
    linkToTargetActivityIdPage
  }
}
