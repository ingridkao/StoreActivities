import { parseHeaderAuth, parseBodyEventId } from './common'

const PrizeServiceApi = (axios: any, event: any) => ({
  commitReceivePrize(id: any, loginT0ken: string) {
    return axios.post(
      `${event}/RunEaUserClaimPrize`,
      { data: parseBodyEventId(id) },
      { headers: parseHeaderAuth(loginT0ken) }
    )
  },
  fetchReceivePrizeResult(id: any, loginT0ken: string) {
    return axios.post(
      `${event}/GetEaUserClaimPrizeResult`,
      { data: parseBodyEventId(id) },
      { headers: parseHeaderAuth(loginT0ken) }
    )
  }
})

export default PrizeServiceApi
