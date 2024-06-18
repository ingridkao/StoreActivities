import { useRouter } from 'vue-router'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useFetchData } from '@/composable/useFetch'
import content from '@/assets/content'

export function useLink() {
  const router = useRouter()
  const { activityErrorAlert, errorAlert } = useSweetAlert()
  const { confirmEvent } = useFetchData()

  const getQueryParam = (url: string, param: string) => {
    // eslint-disable-next-line no-useless-escape
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
    const results = regex.exec(url)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  const linkToPrepareScan = async (activityId: string | string[] = '') => {
    if (activityId === '') {
      router.push('/')
    } else {
      try {
        const confirmRes = await confirmEvent(activityId)
        if (confirmRes) {
          router.push({
            name: 'Activity',
            params: {
              id: activityId
            }
          })
        }
      } catch (error) {
        if (error === 1) {
          activityErrorAlert(content.activity.notFound)
        } else if (error === 2) {
          activityErrorAlert(content.activity.timeOver)
        } else {
          errorAlert(String(error), `/activity/${activityId}`)
        }
      }
    }
  }

  const linkToTargetActivityIdPage = (
    activityId: string | string[] = '',
    routerName: string = ''
  ) => {
    if (activityId === '') {
      errorAlert('回到活動大廳', '/', 'question', '找不到此活動')
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
    linkToPrepareScan,
    linkToTargetActivityIdPage
  }
}
