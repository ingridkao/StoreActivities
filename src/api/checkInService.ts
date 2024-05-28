const CheckInServiceApi = (axios: any, event: any) => ({
  checkInVerify(activityId: number, longitude: number, latitude: number) {
    return axios.post(
      `${event}/CheckInVerify`,
      {
        data: {
          sourceType: 'A',
          eventId: activityId,
          longitude: longitude,
          latitude: latitude
          // storeId: 1,
          //     key: 'AAA',
        }
      },
      {
        headers: {
          //     key: 'AAA|||AAA',
          //     store: '931356',
          //     FV: '1.0.0',
          //     Auth1: '123132',
          //     Auth2: serviceT0ken
        }
      }
    )
  },
  /**
   * --header 'Authorization;' \ service accesstoken
   * --header 'Key;' \           service accesstoken第5取6
   * --header 'FV;'              version
   */
  fetchAlbum(serviceT0ken: string) {
    return axios.post(
      `${event}/GetUserHistoryByStore`,
      {},
      {
        headers: {
          Authorization: serviceT0ken,
          Key: serviceT0ken.slice(4, 10),
          FV: '1.0.0'
        }
      }
    )
  }
})

export default CheckInServiceApi
