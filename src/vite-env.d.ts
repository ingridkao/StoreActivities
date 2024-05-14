/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIFF_ID: string
  readonly VITE_MAPBOX_KEY: string

  readonly VITE_UI_MODE: boolean
  readonly VITE_ASSETS_URL: string
  readonly VITE_API_URL: string

  readonly VITE_OUTDIR: string
  readonly VITE_BASE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
