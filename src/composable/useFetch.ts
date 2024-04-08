// import { ref, onMounted, onUnmounted } from 'vue'
// import { useRouter } from 'vue-router'
import { UAParser } from 'ua-parser-js'
import axios from 'axios'

import type { ActivityListType } from '@/composable/configurable'

import { useLoadingStore } from '@/stores/loading'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useURL } from '@/composable/useURL'

// import { useConvenienceStore } from '@/stores/convenience'

const parser = new UAParser()
export function useFetchData() {
  // const router = useRouter()
  const loadStore = useLoadingStore()
  const { setCtStorage, deleteStorage } = useBrowserStorage()
  // const convenienceStore = useConvenienceStore()

  const getDevice = () => {
    const result = parser.getDevice()
    return result && result.type ? result.type : ''
  }
  // 驗證QR Code
  // ct=OP666000031818094ac904
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
  const { getQueryParam } = useURL()
  const verifyQRCode = () => {
    const isMobile = getDevice()
    const ctStr = getQueryParam(window.location.href, 'ct')
    return new Promise((resolve, reject) => {
      if (!isMobile) {
        reject(Error('請使用移動裝置'))
      } else if (!ctStr) {
        reject(Error('沒有ct'))
      } else {
        // axios.get('http://localhost:8080/').then((res) => {
        //   // 通過驗證
        //   resolve(res.data.data)
        // }).catch(e=>{
        // 沒有通過驗證
        // deleteStorage('ct')
        // })
        setCtStorage(ctStr)
        resolve(true)
        // deleteStorage('ct')
        // reject(Error('意外錯誤' + error))
      }
    })
  }

  const commitStoreCheckIn = async (userId: string = '') => {
    return new Promise((resolve, reject) => {
      if (userId) {
        // axios.get('http://localhost:8080/').then((res) => {
        resolve(true)
        //   resolve(res.data.data)
        // }).catch(e=>{
        // 打卡失敗
        // return Error(e)
        // }).finally(()=>{
        // deleteStorage('ct')
        // })
      } else {
        reject('訪客無法進行打卡')
      }
    })
  }

  const fetchActivityData = (): Promise<ActivityListType[]> => {
    return new Promise((resolve, reject) => {
      // axios.get()
      resolve([
        {
          id: 1,
          title: '測試LINE登入1',
          msg: '測試LINE Login點這個~測試LINE Login點這個~測試LINE Login點這個~',
          statu: 1,
          link: '/activity'
        },
        {
          id: 2,
          title: '測試LINE登入2',
          msg: '測試LINE Login點這個~測試LINE Login點這個~測試LINE Login點這個~',
          statu: 1,
          link: '/activity'
        },
        {
          id: 3,
          title: '預告活動',
          msg: '測試LINE Login點這個~測試LINE Login點這個~測試LINE Login點這個~',
          statu: 2,
          link: '/activity'
        },
        {
          id: 4,
          title: '門市打卡活動',
          msg: '全台7-11門市',
          statu: 1,
          link: '/mapStore '
        },
        {
          id: 5,
          title: '使徒來襲(已結束)',
          msg: '給地圖滿滿的初號機',
          statu: 0,
          link: '/mapEva'
        }
      ])
    })
  }

  const confirmActivity = (acStr: number | null = null): Promise<ActivityListType | number> => {
    return new Promise((resolve, reject) => {
      if (!acStr) resolve(0)
      fetchActivityData()
        .then((res: ActivityListType[]) => {
          const ongoActivity = res.find((item) => Number(item.id) === Number(acStr))
          if (ongoActivity && ongoActivity.statu === 1) {
            resolve(ongoActivity)
          } else {
            const statusCode = ongoActivity ? Number(ongoActivity.statu) : 0
            resolve(statusCode)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // 讀取指定城市資料
  const fetchLayerData = async (selectCity: string = '') => {
    const targerCity = String(selectCity)

    const getAllStore = () => axios.get(`/stores/map_all_${targerCity}.geojson`)
    const getFeatureStore = () => axios.get(`/stores/map_feature_${targerCity}.geojson`)
    const getOpenStore = () => axios.get(`/stores/map_openstore_${targerCity}.geojson`)

    loadStore.toggle(true)
    return Promise.all([getAllStore(), getFeatureStore(), getOpenStore()])
      .then((results) => {
        if (!results) return false
        return results
      })
      .catch((err) => {
        loadStore.toggle(false)
      })
  }

  // onMounted(async () => {
  // })

  return {
    verifyQRCode,
    commitStoreCheckIn,
    fetchActivityData,
    confirmActivity,
    fetchLayerData,
    getDevice
  }
}
