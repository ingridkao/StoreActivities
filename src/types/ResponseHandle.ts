export enum ResponseCodes {
  SUCCESS = 20000,
  QRCODE_TIMEOUT = 1010003,
  LINE_NOAUTH = 1010007
}

export type ApiResponse = {
  code: number;
  msg?: string;
  result?: {};
};


export type GenrateMockQRCodeResponse = {
  lat?: number;
  long?: number;
  qrCode?: string;
  error?: string;
};

export type VerifyCodeApiResponse = {
  result: boolean;
  token?: string | null;
  error?: string;
};

export type CheckLoginVerifyResponse = {
  result: boolean;
  token?: string | null;
  error?: string;
};

export type CampaignListResponse = {
  queryList?: [];
  error?: string;
};
