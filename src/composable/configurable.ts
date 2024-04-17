export interface ActivityListType {
  id?: number
  title?: string
  statu?: number
  img?: string
  link?: string
}

export interface AlbumType {
  event_id?: string
  event_name?: string
  collection?: number
  limit ?: number
}

export interface CollectedListType {
  store_id?: string
  store_name?: string
  checkInTime?: string
}

export interface CollectedType {
  event_id?: string
  event_name?: string
  limit ?: number
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

export interface VerifyCodeResultType {
  c?: string
  t?: string
}

