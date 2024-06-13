import dayjs from 'dayjs'

export function useDay() {
  const parseData = (date: string = '') => {
    const newdate = date ? dayjs(date) : dayjs()
    return newdate.format('YYYY/MM/DD HH:mm')
  }

  const parseYear = (date: string = '') => {
    return date? dayjs(date).year(): ''
  }

  const parseYMD = (date: string = '') => {
    return date? dayjs(date).format('YYYY.MM.DD'): ''
  }

  const parseMD = (date: string = '') => {
    return date? dayjs(date).format('MM.DD'): ''
  }

  const parseYYYYMMDD = (date: string = '') => {
    return date? dayjs(date).format('YYYY/MM/DD'): ''
  }
  return {
    parseData,
    parseYear,
    parseYMD,
    parseMD,
    parseYYYYMMDD
  }
}
