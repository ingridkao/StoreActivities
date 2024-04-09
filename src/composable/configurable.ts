export interface ActivityListType {
  id?: number
  title?: string
  statu?: number
  img?: string
  link?: string
}

export interface CollectedListType {
  store_id?: string
  store_name?: string
  checkInTime?: string
}

export interface ProfileType {
  userId?: string
  displayName?: string
  pictureUrl?: string
}
