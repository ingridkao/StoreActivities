export type ErrorLogDataType = {
  code?: number
  msg?: string
  result?: {}
}

export enum ResponseCodes {
  SUCCESS = 20000,
  QRCODE_TIMEOUT = 1010003,
  LINE_NOAUTH = 1010007
}
