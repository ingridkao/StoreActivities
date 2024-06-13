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
  },
  CollectData: {
    historyList: [
      {
        id: 17,
        storeId: 1,
        storeName: '一勝',
        createTime: '2024-06-11T11:17:35.96'
      }
    ],
    storeIconList: [
      {
        id: 185,
        eventId: 5,
        storeId: 1,
        iconId: 'A08',
        iconFilePath: '/EaStoreIcon/Event_5/20240506_142136_82302_A08.png'
      }
    ]
  },
  WinningData: [{
    "id": 10,
    "awardName": "虛寶",
    "instructions": "龍之寶玉",
    "operatingProcedures": "請進入遊戲大廳後，點選右上角的齒輪進入【系統設置>>基礎】，拉到畫面最下面點選【虛寶兌換】，輸入完整的序號後點選確認兌換。當提示【序號兌換成功】後，獎勵會派送到【系統郵件】，請稍待3~5分鐘檢查收件匣的狀況即可。",
    "useInterval": "2024/08/01-2024/08/31",
    "grade": 1,
    "count": 3,
    "total": 2,
    "serialNumber": "asdsadsadsad",
    "getSNTime": "2024-06-11T11:21:53.787"
  },
  {
    "id": 11,
    "awardName": "虛寶",
    "instructions": "龍之寶玉2",
    "operatingProcedures": "請進入遊戲大廳後，點選右上角的齒輪進入【系統設置>>基礎】，拉到畫面最下面點選【虛寶兌換】，輸入完整的序號後點選確認兌換。當提示【序號兌換成功】後，獎勵會派送到【系統郵件】，請稍待3~5分鐘檢查收件匣的狀況即可。",
    "useInterval": "2024/08/01-2024/08/31",
    "grade": 2,
    "count": 3,
    "total": 2,
    "serialNumber": "029FD46C3BED4B41B927EF2FC14F66C7",
    "getSNTime": "2024-06-11T11:21:53.787"
  }]
}
export default data
