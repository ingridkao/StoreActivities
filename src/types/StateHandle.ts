export type GenrateMockQRCodeState = {
  qrCode?: string
  lat?: number
  long?: number
  store?: string
}

export type ParseCtStringState = {
  ctStr?: string
  storeId?: string // 店號6碼：ctStr.substring(2, 8)
  number?: string // 驗證碼6碼：ctStr.substring(17, 23)
  ctToken?: string // ct驗證後的token
}

export type AccessT0kenState = {
  accessT0ken?: string
  loginT0ken?: string
}
