// import { ref, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
// import { useBrowserStorage } from '@/composable/useBrowserStorage'

// import axios from 'axios'

export function useURL() {
  // const route = useRoute()

  const getQueryParam = (url: string, param: string) => {
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
    const results = regex.exec(url)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  // onMounted(() => {})

  return {
    getQueryParam
  }
}
