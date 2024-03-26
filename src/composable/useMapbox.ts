// import { useRouter } from 'vue-router'
declare let mapboxgl: any

import { ref, reactive, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

import { point, polygon } from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { useConvenienceStore } from '@/stores/convenience'

export function useMapbox() {
  const convenienceStore = useConvenienceStore()

  // minZoom: 最大區域新北
  // zoom: 初始 ZOOM LEVEL; [0-20, 0 為最小 (遠), 20 ;最大 (近)]
  // center: 初始中心座標，格式為 [lng, lat]
  // maxBounds: 台灣地圖區域
  const mapConfig = reactive({
    minZoom: 9,
    zoom: 16.5,
    maxZoom: 18.99,
    taipeiCenter: [121.54885, 25.03625],
    taipeiBound: [[24.396308, 121.2827], [25.585285, 122.0522]],
    maxBounds: [[105, 15], [138.45858, 33.4]],
  })

  const map = ref(null)
  const geolocate = ref(null)
  const popup = ref(null)

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof mapboxgl != 'undefined') resolve(true)
      const scr = document.createElement('script')
      scr.type = 'text/javascript'
      scr.src = `https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js`
      scr.async = true
      scr.defer = true
      scr.onload = () => resolve(true)
      scr.onerror = (err) => reject(err)
      document.body.appendChild(scr)
    })
  }

  const loadStyle = () => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css`
      link.onload = () => resolve(true)
      link.onerror = (err) => reject(err)
      document.head.appendChild(link)
    })
  }

  const storeFilterKeys = ref(['all', 'feature', 'open'])
  const storeFilterOptions = reactive()
  const selectCityValue = ref<String>('')
  const radioSelectType = ref<String>('all')
  const updateCityLayer = async () => {
    if(popup.value) popup.value.remove()
    // const CitySelectValue = selectCityValue.value
    // const TypeSelectValue = radioSelectType.value
    convenienceStore.updateChecked(radioSelectType.value)
    // storeFilterKeys.value.forEach((layerItem, layerIndex) => {
        // storeFilterOptions[layerIndex]['checked'] = (radioSelectType.value == layerItem)
    // })
    // if(cityStoreData[`${CitySelectValue}_all`] && cityStoreData[`${CitySelectValue}_feature`] && cityStoreData[`${CitySelectValue}_open`]){
    //     // 決定顯示|隱藏圖層或是
    //     return showHideCityLayer()
    // }else{
    //     // 新增圖層到地圖中
    //     return await fetchLayerData()
    // }
  }

  onMounted(async () => {
    loadStyle()
    loadScript().catch(error => {
      console.log(error);
    }).then(async (_res) => {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY

      // Initialize the GeolocateControl.
      geolocate.value = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        //地圖上將在使用者所在位置顯示一個點
        trackUserLocation: true,
        // 使用者位置點旁邊繪製一個箭頭，trackUserLocation要為true
        showUserHeading: true,
        // 使用者位置周圍繪製一個透明圓圈
        showAccuracyCircle: true
      })

      // Initialize the Popup.
      popup.value = new mapboxgl.Popup({
        anchor: 'bottom',
        closeButton: true,
        closeOnClick: false,
        offset: [0, -30]
      })

      map.value = new mapboxgl.Map({
        container: 'mapboxBasic', // 地圖容器 ID
        maxBounds: mapConfig.maxBounds,
        center: mapConfig.taipeiCenter,
        zoom: mapConfig.zoom, 
        minZoom: mapConfig.minZoom, // 限制地圖可縮放之最小等級, 可省略, [0-19.99]
        maxZoom: mapConfig.maxZoom, // 限制地圖可縮放之最大等級, 可省略 [0-19.99]
        // pitch: 50, // 攝影機仰角, 可省略, [0-60]
        // bearing: 0, // 地圖角度, 可省略, [-180 ~ 180; 0 為正北朝上, 180 為正南朝上]
        scrollZoom: false, // 關閉始scroll,始配合始map.scrollZoom.enable({around: 'center'});始可以改根據地圖中心縮放,始預設為根據鼠標位置縮放
        attributionControl: false
      })

      // Add the control to the map.
      map.value.addControl(new mapboxgl.NavigationControl())
      map.value.addControl(new mapboxgl.AttributionControl({
        compact: false
      }))
      map.value.addControl(geolocate.value)

      // mapbox不支援GIF僅靜態圖片和canvas
      map.value.on('load', async () => {
        console.log('load');
        map.value.scrollZoom.enable({ around: 'center' }); // 改為根據地圖中心縮放
        map.value.scrollZoom.setZoomRate(1 / 1600); // 觸控板縮放, 分母越大級距越小
        map.value.scrollZoom.setWheelZoomRate(1 / 100); // 滑鼠滾輪縮放, 分母越大級距越小

        // // 安全限制之後要把這個拿掉

        // 移動地圖事件
        // map.value.on('moveend', () => {
        //   if (isMobile.value) return
        //   const features = map.value.queryRenderedFeatures({ layers: mapboxLayers })
        //   if (features) {
        //     const uniqueIds = new Set()
        //     const uniqueFeatures = []
        //     for (const feature of features) {
        //       const id = feature.properties["store_id"]
        //       if (!uniqueIds.has(id)) {
        //         uniqueIds.add(id)
        //         uniqueFeatures.push(feature)
        //       }
        //     }
        //     storeMapFilter.cacheList = uniqueFeatures
        //     storeMapFilter.showList = uniqueFeatures
        //   }
        // })

        // emits('fetchLoading', false)
      })
      // After the last frame rendered before the map enters an "idle" state.
      // map.value.on('idle', () => {
      //     console.log('idle');
      // })

      // map.value.on('zoomend', (event: Event) => {
        // console.log(map.value.getZoom());
        // console.log(map.value.getBounds());
      // })

      geolocate.value.on('geolocate', async (position: any) => {
        // 點擊按鈕取client位置
        console.log('2. A geolocate event has occurred.');
      })
    })
  })

  return {
    mapConfig,
    map,
    geolocate,
    popup
  }
}
