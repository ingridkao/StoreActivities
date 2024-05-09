// export interface ActivityListType {
//   id?: number
//   title?: string
//   statu?: number
//   img?: string
//   link?: string
// }
export type ErrorLogDataType = {
  code?: number
  msg?: string
  result?: {}
}

export enum ResponseCodes {
  SUCCESS = 20000,
  LINE_NOAUTH = 1010007,
  // KEY_NOT_MATCH = 20201,
  // NOAUTH = 50002,
  // REQUEST_FAST  = 50007,
  // NOT_ENTRY = 50009,
  // EXPIRED_TOKEN = 50012,
  // EXPIRED_VERSION = 50017,
  // DELETE_SUCCESS = 60001,
}
