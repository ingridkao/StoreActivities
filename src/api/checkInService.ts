import type { checkInVerifyBodyType, checkInVerifyHeaderType } from '@/types/RequestHandle'
import { parseHeaderAuth, parseBodyEventId } from './common'

const CheckInServiceApi = (axios: any, event: any) => ({
  checkInVerify(data: checkInVerifyBodyType, header: checkInVerifyHeaderType) {
    return axios.post(
      `${event}/CheckInVerify`,
      {
        data: {
          sourceType: 'A',
          ...data
        }
      },
      {
        headers: {
          FV: import.meta.env.VITE_VERSION || '',
          ...header
        }
      }
    )
  },
  fetchCollect(activityId: any, loginT0ken: string) {
    return axios.post(
      `${event}/GetUserEventHistory`,
      { data: parseBodyEventId(activityId) },
      { headers: parseHeaderAuth(loginT0ken) }
    )
  },
  fetchAlbum(loginT0ken: string) {
    return axios.post(
      `${event}/GetUserHistoryByStore`,
      {},
      { headers: parseHeaderAuth(loginT0ken) }
    )
  }
})

export default CheckInServiceApi
