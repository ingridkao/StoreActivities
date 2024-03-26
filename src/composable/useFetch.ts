import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

import { useLoadingStore } from '@/stores/loading'
// import { useConvenienceStore } from '@/stores/convenience'

export function useFetchData() {
  const router = useRouter()
  const loadStore = useLoadingStore()
  // // const convenienceStore = useConvenienceStore()
  
  // 驗證QR Code
  // ct=OP666000031818094ac904
  // 場域代碼(2碼)+店號(6碼)+時間戳記MMddHHmm(8碼)+驗證碼(6碼)
  const verifyQRCode = (ct:string = '') => {
    console.log('verifyQRCode');
    // console.log(ct);
    return new Promise((resolve, reject) => {
      axios.get('http://localhost:8080/').then(res=>{
        resolve(res.data.data);
      })
    });
  }
  
  const fetchActivityData = () => {


  }

  // 讀取指定城市資料
  const fetchLayerData = async (selectCity:string = '') => {
    const targerCity = String(selectCity)
    
    const getAllStore = () => axios.get(`/stores/map_all_${targerCity}.geojson`)
    const getFeatureStore = () => axios.get(`/stores/map_feature_${targerCity}.geojson`)
    const getOpenStore = () => axios.get(`/stores/map_openstore_${targerCity}.geojson`)

    loadStore.toggle(true)
    return Promise.all([getAllStore(), getFeatureStore(), getOpenStore()])
    .then((results) => {
      if (!results) return false
      return results
    }).catch((err) => {
      loadStore.toggle(false)
    })
  }

  // onMounted(async () => {
  // })

  return {
    verifyQRCode,
    fetchLayerData
  }
}
