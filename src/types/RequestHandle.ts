// export interface IconInterface {
//   id?: number
//   eventId?: number
//   storeId?: number
//   iconId?: string
//   iconFilePath?: string
// }

/**
 * 'storeId'    店號六碼
 * 'eventId'    活動ID
 * 'key'        ct number ||| service accesstoken從第5碼取六碼
 * 'longitude'  Number(longitude)
 * 'latitude'   Number(latitude)
 * 'sourceType'
 */
export type checkInVerifyBodyType = {
  storeId?: string
  eventId?: number
  key?: string
  longitude?: number
  latitude?: number
  sourceType?: string
}

/**
 * --header 'store'  店號六碼
 * --header 'Key'    ct number ||| service accesstoken從第5碼取六碼
 * --header 'FV'     version
 * --header 'Auth1'  ct token
 * --header 'Auth2'  service accesstoken
 */
export type checkInVerifyHeaderType = {
  store?: string
  key?: string
  FV?: string
  Auth1?: string
  Auth2?: string
}

/**
 * --header 'Authorization' service accesstoken
 * --header 'Key'           service accesstoken從第5碼取六碼
 * --header 'FV'            version
 */
export type VerifyHeaderType = {
  Authorization?: string
  key?: string
  FV?: string
}
