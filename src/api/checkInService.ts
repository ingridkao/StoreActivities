import type {
  checkInVerifyBodyType,
  checkInVerifyHeaderType,
  VerifyHeaderType
} from '@/types/RequestHandle'
const { VITE_VERSION } = import.meta.env

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
          FV: VITE_VERSION,
          ...header
        }
      }
    )
  },
  fetchCollect(activityId: string, loginT0ken: string) {
    return axios.post(
      `${event}/GetUserEventHistory`,
      {
        data: {
          eventId: Number(activityId)
        }
      },
      {
        headers: {
          Authorization: loginT0ken,
          Key: loginT0ken.slice(4, 10),
          FV: VITE_VERSION
        } as VerifyHeaderType
      }
    )
  },
  fetchAlbum(loginT0ken: string) {
    return axios.post(
      `${event}/GetUserHistoryByStore`,
      {},
      {
        headers: {
          Authorization: loginT0ken,
          Key: loginT0ken.slice(4, 10),
          FV: VITE_VERSION
        } as VerifyHeaderType
      }
    )
  }
})

export default CheckInServiceApi
