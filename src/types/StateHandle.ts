export type GenrateMockQRCodeState = {
  qrCode?: string
  lat?: number
  long?: number
  store?: string
};

export type VerifyCodeState = {
  ctStr?: string
  token?: string
};