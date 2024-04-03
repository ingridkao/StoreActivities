import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
// import { useRouter } from 'vue-router'
import type { ActivityListType } from '@/composable/configurable'

import { useLoadingStore } from '@/stores/loading'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useURL } from '@/composable/useURL'

// import { useConvenienceStore } from '@/stores/convenience'

export function useFetchData() {
  // const router = useRouter()
  const loadStore = useLoadingStore()
  const { setCtStorage, deleteStorage } = useBrowserStorage()
  // const convenienceStore = useConvenienceStore()

  // 驗證QR Code
  // ct=OP666000031818094ac904
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
  const { getQueryParam } = useURL()
  const verifyQRCode = () => {
    const ctStr = getQueryParam(window.location.href, 'ct')
    return new Promise((resolve, reject) => {
      if (ctStr) {
        // axios.get('http://localhost:8080/').then((res) => {
        //   resolve(res.data.data)
        // 通過驗證
        setCtStorage(ctStr)
        resolve(true)
        // })
        // 沒有通過驗證
        // deleteStorage('ct')
      } else {
        resolve(false)
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

  const confirmActivity = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      resolve(true)
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
    fetchActivityData,
    confirmActivity,
    fetchLayerData
  }
}
