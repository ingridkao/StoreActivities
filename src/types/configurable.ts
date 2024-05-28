export interface AlbumType {
  storeId?: string
  storeName?: string
  iconFilePath?: string //圖片路徑
  checkinTime?: string //最後打卡時間
  storeTimes?: number //打卡次數
}

export interface CollectedListType {
  store_id?: string
  store_name?: string
  checkInTime?: string
}

export interface CollectedType {
  event_id?: string
  event_name?: string
  limit?: number
  startDate?: string
  endDate?: string
  specialStampIndexList?: number[]
  collection?: CollectedListType[]
}

export interface ProfileType {
  userId?: string
  displayName?: string
  pictureUrl?: string
}
export interface ScanResultType {
  event_id?: string
  id?: string
  name?: string
  date?: string
}
