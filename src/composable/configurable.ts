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

export interface ProfileType {
  userId?: string
  displayName?: string
  pictureUrl?: string
}
