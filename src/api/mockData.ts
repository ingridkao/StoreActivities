const data = {
  genrateMockQRCode: {
    lat: 24.2953944,
    long: 120.72697555,
    qrCode: 'OP113252051016433ee780c2024',
    store: '113252'
  },
  eventMockData: [
    {
      id: 3,
      eventName: '歡樂一夏夏',
      partnerId: 2,
      startTime: '2024-04-01T00:00:00',
      endTime: '2025-07-31T23:59:59',
      isEnable: true,
      pageRouter: '2',
      redeemPrizeList: [
        {
          id: 17,
          grade: 1,
          reachTarget: 1
        },
        {
          id: 47,
          grade: 2,
          reachTarget: 5
        },
        {
          id: 48,
          grade: 3,
          reachTarget: 10
        }
      ]
    },
    {
      id: 4,
      eventName: '歡樂一夏',
      partnerId: 2,
      startTime: '2024-04-01T00:00:00',
      endTime: '2025-05-01T23:59:59',
      isEnable: true,
      pageRouter: '3',
      redeemPrizeList: [
        {
          id: 17,
          grade: 1,
          reachTarget: 1
        },
        {
          id: 47,
          grade: 2,
          reachTarget: 3
        },
        {
          id: 48,
          grade: 3,
          reachTarget: 5
        }
      ]
    }
  ],
  specifyEventMockData: [
    {
      id: 4,
      eventName: '秋耶',
      partnerId: 2,
      startTime: '2024-06-01T00:00:00',
      endTime: '2025-09-31T23:59:59',
      isEnable: true,
      pageRouter: '4',
      redeemPrizeList: [
        {
          id: 17,
          grade: 1,
          reachTarget: 1
        },
        {
          id: 47,
          grade: 2,
          reachTarget: 6
        },
        {
          id: 48,
          grade: 3,
          reachTarget: 12
        }
      ]
    }
  ],
  adsData: [
    {
      id: 6,
      link: 'www.google.com',
      isEnable: true
    },
    {
      id: 5,
      link: 'www.google.com',
      isEnable: true
    }
  ],
  albumData: {
    historyList: [
      {
        storeId: '1',
        storeName: '歡樂一夏',
        iconFilePath: '',
        createTime: '',
        storeTimes: 2
      },
      {
        storeId: '2',
        storeName: '歡樂一夏夏',
        iconFilePath: '',
        createTime: '',
        storeTimes: 1
      },
      {
        storeId: '3',
        storeName: '道生',
        iconFilePath: '',
        createTime: '',
        storeTimes: 1
      }
    ],
    storeIconList: []
  }
}
export default data
