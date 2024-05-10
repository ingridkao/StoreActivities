/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UI_MODE: boolean
  readonly VITE_LIFF_ID: string
  readonly VITE_LIFF_ENDPOINT_URL: string
  readonly VITE_MOCKAPI_URL: string
  readonly VITE_API_URL: string
  readonly VITE_BASE_URL: string
  readonly VITE_OUTDIR: string
  readonly VITE_BASE: string
  readonly VITE_ASSETS_URL: string
  readonly VITE_MAPBOX_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
