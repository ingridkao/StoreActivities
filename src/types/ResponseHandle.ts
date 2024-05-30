export enum ResponseCodes {
  SUCCESS = 20000,
  QRCODE_TIMEOUT = 1010003,
  LOCATION_ERROR = 1010006,   // 你不在門市所在位置
  LINE_NOAUTH = 1010007,
  NO_EVENT = 1010008,
  EXPIRED_ACCESS_TOKEN = 50012,
  ERROR = 50000,

}

export type ApiResType = {
  code: number
  msg?: string
  result?: {}
}

// 
export type GenrateMockQRCodeResType = {
  lat?: number
  long?: number
  qrCode?: string
  error?: string
}

export type VerifyCodeResType = {
  result: boolean
  token?: string | null
  error?: string
}

// 活動
export interface EventBaseInterface {
  id?: number
  eventName?: string
  startTime?: string
  endTime?: string
  isEnable?: boolean
  pageRouter?: string
}

export interface EventInterface extends EventBaseInterface {
  partnerId?: number
  imageFilePath?: string
  // toLinkUrl?: string
  designatedStoreList?: []
}

export type EventListResType = {
  queryList?: EventInterface[]
  error?: string
}

// For活動詳情
export interface EventContentType {
  title: string
  text?: string
}

// 存在localstorage的簡化資料
export type EventInfoInterface = {
  nameBreak?: number // 供UI幾個字換行判斷
  eventName?: string
  year?: string | number //轉換後的年份
  startDate?: string //轉換後的開始時間
  endDate?: string //轉換後的結束時間
  content: EventContentType[] // 下方內容，文字來源src/assets/events.ts
}

// 廣告
export interface AdsInterface {
  id?: number
  title?: string
  link?: string
  isEnable?: boolean
  imageFilePath?: string
}

export type AdListResType = {
  queryList?: AdsInterface[]
  error?: string
}

//
export interface EventInterface {
  id?: number
  storeId?: number
  storeName?: string
  createTime?: string
}

export interface IconInterface {
  id?: number
  eventId?: number
  storeId?: number
  iconId?: string
  iconFilePath?: string
}

// 活動打卡紀錄 via GetUserEventHistory
export type EventListType = {
  historyList?: EventInterface[]
  storeIconList: IconInterface[] | null
  error?: string
}

export interface ScanResultType {
  eventId?: string
  storeId?: string
  storeName?: string
  date?: string
}

// 門市打卡紀錄 via GetUserHistoryByStore
export interface AlbumType {
  storeId?: string
  storeName?: string
  checkinTime?: string //最後打卡時間
  storeTimes?: number //打卡次數
  iconFilePath?: string //圖片路徑
}

export type AlbumListType = {
  historyList?: AlbumType[]
  storeIconList: IconInterface[] | null
  error?: string
}