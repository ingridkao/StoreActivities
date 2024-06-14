import { useRouter } from 'vue-router'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useEventStorage } from '@/composable/useEventStorage'
import { useFetchData } from '@/composable/useFetch'

export function useLink() {
  const router = useRouter()
  const { activityErrorAlert, errorAlert } = useSweetAlert()
  const { getTargetEventStorage } = useEventStorage()
  const { confirmCampaign } = useFetchData()

  const getQueryParam = (url: string, param: string) => {
    // eslint-disable-next-line no-useless-escape
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
    const results = regex.exec(url)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  const linkToPrepareScan = async(
    activityId: string | string[] = ''
  ) => {
    if (activityId === '') {
      router.push('/')
    } else {
      try {
        const confirmRes = await confirmCampaign(activityId)
        if(confirmRes){
          router.push({
            name: 'Activity',
            params: {
              id: activityId
            }
          })
        }
      } catch (error) {
        if (error === 1) {
          activityErrorAlert('沒有此活動')
        } else if (error === 2) {
          activityErrorAlert('活動已結束')
        } else {
          activityErrorAlert('異常', String(error))
        }
      }
    }
  }

  const linkToTargetActivityIdPage = (
    activityId: string | string[] = '',
    routerName: string = ''
  ) => {
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
    linkToPrepareScan,
    linkToTargetActivityIdPage
  }
}
