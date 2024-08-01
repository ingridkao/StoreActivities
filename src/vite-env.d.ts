/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIFF_ID: string
  readonly VITE_MAPBOX_KEY: string
  readonly VITE_MAP8_KEY: string

  readonly VITE_UI_MODE: string
  readonly VITE_ASSETS_URL: string
  readonly VITE_API_URL: string
  readonly VITE_ORIGIN_URL: string

  readonly VITE_OUTDIR: string
  readonly VITE_BASE: string

  readonly VITE_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
