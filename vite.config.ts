import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue(), VueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://print-api-uat.ibon.com.tw/cloudprint_api_dev/api/ExtraActivity',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: env.VITE_OUTDIR || 'dist',
    },
    base: env.VITE_BASEDIR || '/',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "./src/assets/scss/main.scss";
          `,
        }
      },
    },
  }
})
