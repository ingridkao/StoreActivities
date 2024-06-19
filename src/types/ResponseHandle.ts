export enum ResponseCodes {
  SUCCESS = 20000,
  FAIL = 20001,
  QRCODE_STRING = 1010001, // QRCODE 長度不對
  QRCODE_FORMAT = 1010002, // QRCODE 格式不對
  QRCODE_TIMEOUT = 1010003, // QRCODE 逾時
  QRCODE_NUMBER = 1010004, // 檢查碼錯誤

  STORE_ERROR = 1010005, // 無法取得門市資訊
  STORE_AREA_ERROR = 1010006, // 你不在門市所在位置

  LINE_NOAUTH = 1010007, // Line Login 驗證失敗
  NO_EVENT = 1010008, // 活動不存在

  SCAN_ONCE = 1010009, // QRCode 只能掃描使用一次
  VERIFY_FAIL = 1010010, // 混合型檢查有誤
  CHECKIN_EXIST = 1010011, // 此門市已經打卡過了
  CHECKIN_TODAY = 1010012, // 此門市今天已經打卡過了
  CHECKIN_FAIL = 1010013, // 打卡Token及Input驗證不對

  AWARD_FAIL = 1010014, // 領取獎項未成功
  LOCATION_ERROR = 1010015, // 無法取得手機定位

  EXPIRED_ACCESS_TOKEN = 50012,
  EXCEPTION = 50000
}

export type ApiResType = {
  code: number
  msg?: string
  result?: {}
}

// 模擬
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

export type RedeemPrizeType = {
  id: number
  grade: number // 級距
  reachTarget: number // 累積reachTarget家門市
}

// 活動
export interface CampaignBaseInterface {
  id?: number
  eventName?: string
  startTime?: string
  endTime?: string
  isEnable?: boolean
  pageRouter?: string
  redeemPrizeList: RedeemPrizeType[]
}

export interface CampaignInterface extends CampaignBaseInterface {
  partnerId?: number
  imageFilePath?: string
  // toLinkUrl?: string
  designatedStoreList?: []
}

export type EventListResType = {
  queryList?: CampaignInterface[]
  error?: string
}

// For活動詳情

// 文字來源src/assets/events.ts
export interface EventContentType {
  title: string
  text?: string
}

export type EventInfoInterface = {
  headerImg: string
  nameBreak?: number // 供UI幾個字換行判斷
  content: EventContentType[]
}

// 簡化後的活動列表for ActivityView.vue, confirmEvent()
export type EventSimpleInterface = {
  id?: number | string
  start?: string //開始時間
  end?: string //結束時間
  eventName?: string
  eventNameBreak?: string
  headerImg?: string
  content: EventContentType[]
  redeemPrize: number[]
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
  storeTimes: number //打卡次數
  iconFilePath?: string //圖片路徑
}

export type AlbumListType = {
  historyList?: AlbumType[]
  storeIconList: IconInterface[] | null
  error?: string
}

// 獎項
export type AwardType = {
  id: number
  awardName: string //獎項名稱
  instructions?: string //獎項說明
  operatingProcedures?: string //使用方法
  useInterval?: string //使用期限
}

// 序號
export type PrizeType = {
  id: number
  awardName: string //獎項名稱
  serialNumber?: string //序號
  getSNTime?: string //取得序號時間
}

export interface ReceivePrizeListType extends RedeemPrizeType {
  eventId: number // 活動ID
  isAchieve: boolean // 是否達標
  isClaimPrize: boolean // 是否領獎
  awardList?: AwardType[]
  claimPrizeList?: PrizeType[] // 序號
}

export interface PrizeUiDisplayInfoType extends AwardType, PrizeType {
  grade: number // 級距
  count: number // 此級距獎項序號index
  total: number // 此級距獎項總量
}
