import { parseHeaderAuth } from './common'

const StoreMapApi = (axios: any, event: any) => ({
  getGeoData(center: [number,number], loginT0ken: string) {
    return axios.post(
      `${event}/GetStoreMapGeoJson`, 
      { data: {
        longitude: center[0],
        latitude: center[1]
      }},
      { headers: parseHeaderAuth(loginT0ken) }
    )
  },
})

export default StoreMapApi
