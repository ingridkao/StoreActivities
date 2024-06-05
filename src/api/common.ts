import type { VerifyHeaderType } from '@/types/RequestHandle'
const { VITE_VERSION } = import.meta.env

export const parseHeaderAuth = (loginT0ken: string) => {
  return {
    Authorization: loginT0ken || '',
    Key: loginT0ken.slice(4, 10) || '',
    FV: VITE_VERSION || ''
  } as VerifyHeaderType
}

export const parseBodyEventId = (activityId: string | number) => {
  return {
    eventId: Number(activityId)
  }
}
