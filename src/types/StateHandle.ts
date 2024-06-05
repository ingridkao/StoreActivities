export type GenrateMockQRCodeState = {
  qrCode?: string
  lat?: number
  long?: number
  store?: string
}

export type ParseCtStringState = {
  ctStr?: string
  storeId?: string // 店號(6碼)
  number?: string // 驗證碼(6碼)
  token?: string // 驗證碼(6碼)
}

export type AccessT0kenState = {
  accessT0ken?: string
  loginT0ken?: string
}
