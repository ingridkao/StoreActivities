import Cookies from 'js-cookie'
import type { EventBaseInterface } from '@/types/ResponseHandle'

export function useEventStorage() {
  // 5分鐘後自動刪掉
  // const inFiveMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
  // 12小時後自動刪掉
  const inTwelveMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)

  const setEventStorage = (eventStorage: EventBaseInterface[]) => {
    if (eventStorage && eventStorage.length >= 0) {
      Cookies.set('STORE_EVENTS', JSON.stringify(eventStorage), {
        expires: inTwelveMinutes
      })
    } else {
      Cookies.remove('STORE_EVENTS')
    }
  }
  const getEventStorage = (): EventBaseInterface[] => {
    const enevts = Cookies.get('STORE_EVENTS')
    if (enevts) {
      return JSON.parse(enevts)
    } else {
      return []
    }
  }

  return {
    setEventStorage,
    getEventStorage
  }
}
