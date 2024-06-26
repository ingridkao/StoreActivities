// import type { Point } from 'geojson'
export interface LatLngType {
  lat?: number
  lng?: number
}

export interface GeoJsonProperties {
  id?: string
  storeid?: string
  storename?: string
  storetype?: string
  iconid?: string
  address?: string
}

export interface ActiveIconType {
  id?: string
  iconFilePath?: string
}

export interface IconTypeListType {
  id: number
  url: string
}
