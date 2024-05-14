export type ErrorLogDataType = {
  code?: number
  msg?: string
  result?: {}
}

export enum ResponseCodes {
  SUCCESS = 20000,
  LINE_NOAUTH = 1010007
}
