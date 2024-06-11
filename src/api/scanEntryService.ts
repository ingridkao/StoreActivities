const ScanEntryApi = (axios: any, event: any) => ({
  genrateMockQRCode(id: any) {
    return axios.post(`${event}/MockQRCodeData`, {
      data: {
        id: Number(id)
      }
    })
  },
  verifyQRString(ctStr: string) {
    return axios.post(`${event}/IbonEntry`, {
      data: {
        qrCode: ctStr
      }
    })
  },
  checkLineLoginVerify(accessToken: string) {
    return axios.post(`${event}/LineLoginVerify`, {
      data: {
        key: accessToken,
        partnerId: 2
      }
    })
  },
  fetchAdData() {
    return axios.post(`${event}/GetAdsData`)
  },
  fetchCampaign() {
    return axios.post(`${event}/GetCampaignData`)
  },
  fetchSpecifyCampaign(id: string) {
    return axios.post(`${event}/GetSpecifytheCampaignData`, {
      data: {
        key: id
      }
    })
  }
})

export default ScanEntryApi
