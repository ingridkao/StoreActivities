export interface ActivityListType {
  id?: number
  title?: string
  statu?: number
  img?: string
  link?: string
}

export interface CampaignListType {
  id?: number
  eventName?: string
  partnerId?: number
  startTime?: string
  endTime?: string
  isEnable?: boolean
  toLinkUrl?: string
  imageFilePath?: string
  pageRouter?: string
}

export interface AdListType {
  id?: number
  adType?: string
  title?: string
  content?: string
  link?: string
  isEnable?: boolean
  imageFilePath?: string
}

export interface AlbumType {
  event_id?: string
  event_name?: string
  collection?: number
  limit?: number
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
  collection?: CollectedListType[]
}

export interface ProfileType {
  userId?: string
  displayName?: string
  pictureUrl?: string
}
export interface ProfileAccessType {
  accessToken?: string | null,
  profile : ProfileType | undefined
}

export interface ScanResultType {
  event_id?: string
  id?: string
  name?: string
  date?: string
}

export interface VerifyCodeResultType {
  c?: string
  t?: string
}

export interface CityStoreDataValue {
  city?: string
  type?: string
  storeData?: any
  disabled?: boolean
}

export interface CityStoreDataType {
  [key: string]: CityStoreDataValue
}
