// import { useRouter } from 'vue-router'
declare let mapboxgl: any

import { ref, reactive, onMounted, onUnmounted } from 'vue'
// import axios from 'axios'

import { point, polygon } from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { useFetchData } from '@/composable/useFetch'
import { useMap } from '@/composable/useMap'
// import { useLoadingStore } from '@/stores/loading'

interface CityStoreDataValue {
  city?: string
  type?: string
  storeData?: any
  disabled?: boolean
}
interface CityStoreDataType {
  [key: string]: CityStoreDataValue
}

export function useMapbox() {
  const storeSelectd = ref<String>('all')
  const storeFilterOptions = reactive([
    {
      value: 'all',
      nameTw: '所有門市'
    },
    {
      value: 'feature',
      nameTw: '主題門市'
    },
    {
      value: 'open',
      nameTw: '聯名門市'
    }
  ])
  const updateChecked = (target: String) => {
    storeSelectd.value = target
  }

  const { fetchLayerData } = useFetchData()
  const { clientLocationCity } = useMap()

  // const loadStore = useLoadingStore()

  // minZoom: 最大區域新北
  // zoom: 初始 ZOOM LEVEL; [0-20, 0 為最小 (遠), 20 ;最大 (近)]
  // center: 初始中心座標，格式為 [lng, lat]
  // maxBounds: 台灣地圖區域
  const mapConfig = reactive({
    minZoom: 9,
    zoom: 16.5,
    maxZoom: 18.99,
    taipeiCenter: [121.54885, 25.03625],
    taipeiBound: [
      [24.396308, 121.2827],
      [25.585285, 122.0522]
    ],
    maxBounds: [
      [105, 15],
      [138.45858, 33.4]
    ]
  })

  const map = ref()
  const geolocate = ref()
  const popup = ref()

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
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = `https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css`
      link.onload = () => resolve(true)
      link.onerror = (err) => reject(err)
      document.head.appendChild(link)
    })
  }

  const selectCityValue = ref<String>('')
  const updateCityLayer = async () => {
    if (popup.value) popup.value.remove()
    // const CitySelectValue = selectCityValue.value
    // if(cityStoreData[`${CitySelectValue}_all`] && cityStoreData[`${CitySelectValue}_feature`] && cityStoreData[`${CitySelectValue}_open`]){
    //     // 決定顯示|隱藏圖層或是
    //     return showHideCityLayer()
    // }else{
    //     // 新增圖層到地圖中
    //     return await fetchLayerData()
    // }
  }

  const mapboxLayers = ref<any[]>([]) //已存在的地圖圖層

  const addDataToMap = (layerItem: CityStoreDataValue) => {
    const layerData = layerItem.storeData
    if (!layerData) return

    const targetKey = `${layerItem.city}-${layerItem.type}`
    const markerName = `${targetKey}-marker`
    const sourceName = `${targetKey}-source`
    const layerName = `${targetKey}-layer`
    const layerVisibility = storeSelectd.value === layerItem.type ? 'visible' : 'none'

    map.value.addSource(sourceName, {
      type: 'geojson',
      data: layerData
    })
    map.value.loadImage('/711_sl_36X36.gif', (error: any, iconImage: any) => {
      if (error) throw error
      map.value.addImage(markerName, iconImage)
      map.value.addLayer({
        id: layerName,
        type: 'symbol',
        source: sourceName,
        layout: {
          visibility: layerVisibility,
          // "text-font": ["Noto Sans Regular"], // 文字字體(必要資料, 不可省略)
          'text-field': '{store_name}門市', //資訊文字
          'text-offset': [0, 2.75], //文字位移位置第一個為x軸, 第二個為y軸
          'text-size': {
            stops: [
              [mapConfig.zoom - 1, 0],
              [mapConfig.zoom, 10]
            ]
          },
          'icon-allow-overlap': true,
          'icon-image': markerName,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            mapConfig.zoom,
            0.8,
            mapConfig.maxZoom,
            1.3
          ],
          'icon-offset': [0, -21]
        }
      })
      map.value.on('click', layerName, (e: any) => {
        map.value.getCanvas().style.cursor = 'pointer'

        // 訊息視窗
        if (popup.value) popup.value.remove()

        const coordinates = e.features[0].geometry.coordinates.slice()
        const properties = e.features[0].properties
        const description = `
          <p>店號: ${properties.store_id}</p>
          <p>店名: ${properties.store_name}</p>
          <p>地址: ${properties.address}</p>
        `
        // 確保訊息視窗不會被遮擋
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        // 設定訊息視窗內容並在地圖上顯示
        popup.value.setLngLat(coordinates).setHTML(description).addTo(map.value)

        // 將地圖中心點移動至店位置
        // mapMoveToCenter(coordinates)

        // 打開資訊
        // openStoreInfo(e, properties)
      })
      mapboxLayers.value.push(layerName)
    })
  }

  const cityStoreData = reactive<CityStoreDataType>({})
  const updateStoreResult = (results:any) => {
    results.forEach((layerData:any, layerIndex: number) => {
      const layerType = storeFilterOptions[layerIndex]['value']
      console.log(layerType);
      const layerKey = `${clientLocationCity.value}_${layerType}`
      const storeData = layerData['data']
      if (storeData && storeData.features) {
        const storeCount: number = storeData.features.length
        const layerDatas = {
          city: clientLocationCity.value,
          type: layerType,
          storeData: storeData,
          disabled: storeCount === 0
        } as CityStoreDataValue
        cityStoreData[layerKey] = layerDatas
        addDataToMap(layerDatas)
      }
    })
    // loadStore.toggle(false)
  }

  onMounted(async () => {
    loadStyle()
    loadScript()
      .catch((error) => {
        console.log(error)
      })
      .then(async (_res) => {
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
        map.value.addControl(
          new mapboxgl.AttributionControl({
            compact: false
          })
        )
        map.value.addControl(geolocate.value)

        // mapbox不支援GIF僅靜態圖片和canvas
        map.value.on('load', async () => {
          // console.log('load')
          map.value.scrollZoom.enable({ around: 'center' }) // 改為根據地圖中心縮放
          map.value.scrollZoom.setZoomRate(1 / 1600) // 觸控板縮放, 分母越大級距越小
          map.value.scrollZoom.setWheelZoomRate(1 / 100) // 滑鼠滾輪縮放, 分母越大級距越小

          try {
            const storeResults = await fetchLayerData(clientLocationCity.value)
            updateStoreResult(storeResults)
          } catch (error) {
            console.log(error);
            
            
          }
          
          // 安全限制之後要把這個拿掉

          // 移動地圖事件
          // map.value.on('moveend', () => {
          //   if (isMobile.value) return
          //   const features = map.value.queryRenderedFeatures({ layers: mapboxLayers.value })
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

        geolocate.value.on('geolocate', async () => {
          // 點擊按鈕取client位置
          console.log('2. A geolocate event has occurred.')
        })
      })
  })

  return {
    storeSelectd,
    storeFilterOptions,
    updateChecked,
    mapConfig,
    map,
    geolocate,
    popup,
    addDataToMap
  }
}
