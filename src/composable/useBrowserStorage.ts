import { onMounted } from 'vue'
import { useURL } from '@/composable/useURL'

export function useBrowserStorage() {
  const { getQueryParam } = useURL()

  const getAcString = () => {
    const acStr = getQueryParam(window.location.href, 'ac')
    if (acStr) {
      setAcStorage(acStr)
      return acStr
    } else {
      const sessionStorageAc = sessionStorage.getItem('ac')
      return sessionStorageAc || ''
    }
  }

  const setAcStorage = (value: string) => {
    sessionStorage.setItem('ac', value)
  }

  const getCtString = () => {
    const acStr = getQueryParam(window.location.href, 'ct')
    if (acStr) {
      setAcStorage(acStr)
      return acStr
    } else {
      const sessionStorageAc = sessionStorage.getItem('ct')
      return sessionStorageAc || ''
    }
  }

  const setCtStorage = (value: string) => {
    sessionStorage.setItem('ct', value)
  }
  const deleteStorage = (item: string) => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item)
    }
    if (sessionStorage.getItem(item)) {
      sessionStorage.removeItem(item)
    }
  }

  onMounted(async () => {
    if (sessionStorage.getItem('ct')) {
      sessionStorage.getItem('ct')
    }
  })

  return {
    getAcString,
    setAcStorage,
    getCtString,
    setCtStorage,
    deleteStorage
  }
}
