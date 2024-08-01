import { parseHeaderAuth } from './common'

const StoreMapApi = (axios: any, event: any) => ({
  getGeoData(long: number, lat: number, activityId: string = '', loginT0ken: string = '') {
    return axios.post(
      `${event}/GetStoreMapGeoJson`,
      {
        data: {
          longitude: long,
          latitude: lat,
          eventId: activityId ? Number(activityId) : '',
          range: activityId ? '' : 'center'
        }
      },
      { headers: parseHeaderAuth(loginT0ken) }
    )
  },
  getIconData(activityId: number, loginT0ken: string = '') {
    return axios.post(
      `${event}/GetEaEventIconTypeByEvent`,
      {
        data: {
          id: activityId
        }
      },
      { headers: parseHeaderAuth(loginT0ken) }
    )
  },
  setMap8UseLog(loginT0ken: string = '') {
    return axios.post(
      `${event}/AddEaMap8UseLog`,
      {},
      { headers: parseHeaderAuth(loginT0ken) }
    )
  }
})

export default StoreMapApi
