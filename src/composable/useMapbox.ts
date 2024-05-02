declare let mapboxgl: any
import { UAParser } from 'ua-parser-js'

import { ref, reactive, onMounted } from 'vue'
import { useFetchData } from '@/composable/useFetch'
import { useMap } from '@/composable/useMap'
// import { useLoadingStore } from '@/stores/loading'

export function useMapbox() {
  const { fetchLayerData } = useFetchData()
  const { clientLocationCity } = useMap()
  // const loadStore = useLoadingStore()

  const map = ref()
  const geolocate = ref()
  const popup = ref()

  const storeFilterSelectd = ref<String>('all')
  // 從後端取回
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

  // 新增圖層到地圖中
  const addLayerData = async () => {
    try {
      const storeResults = await fetchLayerData(clientLocationCity.value)
      if (storeResults && storeResults.data) {
        addDataToMap(storeResults.data)
      } else {
        console.error('不合法的geojson');
      }
    } catch (error) {
      // alert
      console.error(error);
    }
  }

  const sourceName = 'store-source'
  const layerName = 'all-layer'
  const markerName = 'common-marker'

  const updateChecked = (target: String) => {
    storeFilterSelectd.value = target
    if (popup.value) popup.value.remove()
    const sourceObject = map.value.getSource(sourceName)
    if (sourceObject) {
      if (!map.value.getLayer(layerName)) return
      if (target === 'all') {
        map.value.setFilter(layerName, null)
      } else {
        map.value.setFilter(layerName, ['in', 'store_type', target])
      }
    } else {
      console.log('check updateChecked addLayerData');
      addLayerData()
    }
  }

  const targetBoxData = reactive({
    toggle: false as boolean,
    location: {} as { lng?: number; lat?: number },
    info: {} as any
  })

  const closeStoreInfo = () => {
    targetBoxData.toggle = false
    targetBoxData.location = {}
    targetBoxData.info =  {}
  }

  let cacheStore_id = ''
  const toggleStoreInfo = (classList:string) => {
    if(Object.keys(targetBoxData.location).length > 0){
      if(!targetBoxData.toggle){
        targetBoxData.toggle = true
        cacheStore_id = targetBoxData.info.store_id
      }else if(targetBoxData.toggle && cacheStore_id === targetBoxData.info.store_id){
        const trigger = ['infoBox'].some(className => classList.includes(className))
        if(!trigger){
          closeStoreInfo()
        }
      }
    }
  }

  const addDataToMap = (storeResults: any) => {
    console.log('2 addDataToMap')

    map.value.addSource(sourceName, {
      type: 'geojson',
      data: storeResults
    })
    map.value.loadImage('/711_sl_36X36.gif', (error: any, iconImage: any) => {
      if (error) throw error
      map.value.addImage(markerName, iconImage)
      map.value.addLayer({
        id: layerName,
        type: 'symbol',
        source: sourceName,
        layout: {
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
          // 'icon-image': ['get', 'icon'],
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
    })
  }

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

  // 將地圖中心點移動至店位置
  const mapMoveToCenter = (coordinates: any) => {
    map.value.easeTo({
      center: coordinates,
      zoom: mapConfig.zoom,
      duration: 600,
      easing: (easeEvent: any) => easeEvent
    })
  }

  // https://docs.uaparser.js.org/v2/api/ua-parser-js/get-device.html
  // 開啟googlemap導航
  const mapNavigation = () => {
    const parser = new UAParser()
    const result = parser.getDevice()
    // 前往目的地的經緯度
    const latitude = targetBoxData.location.lat
    const longitude = targetBoxData.location.lng
    const destination = `${latitude},${longitude}`
    const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    if (result.type) {
      // 創建<a>標籤
      const link = document.createElement('a')
      link.href = googleMapUrl
      link.target = '_blank'
      // 模擬單擊操作
      link.click()
      link.remove()
    } else {
      window.open(googleMapUrl, '_blank', 'noopener noreferrer')
    }
  }

  onMounted(() => {
    loadStyle()
    loadScript()
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
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
          style: 'mapbox://styles/mapbox/outdoors-v12',
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

        // 另一個加marker的方法
        // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
        // mapbox不支援GIF僅靜態圖片和canvas
        map.value.on('load', async() => {
          console.log('mapbox loaded');
          map.value.scrollZoom.enable({ around: 'center' }) // 改為根據地圖中心縮放
          map.value.scrollZoom.setZoomRate(1 / 1600) // 觸控板縮放, 分母越大級距越小
          map.value.scrollZoom.setWheelZoomRate(1 / 100) // 滑鼠滾輪縮放, 分母越大級距越小

          console.log('init addLayerData');

          await addLayerData()

          map.value.on('click', (e:any) => {
            if (e.defaultPrevented) return
            const bbox = [
              [e.point.x - 5, e.point.y - 5],
              [e.point.x + 5, e.point.y + 5]
            ]
            try {
              const selectedFeatures = map.value.queryRenderedFeatures(bbox, { layers: [layerName] })
              if(selectedFeatures.length === 0){
                closeStoreInfo()
              }
            } catch (error) {
              console.error(error);
            }
          })
        })

        // After the last frame rendered before the map enters an "idle" state.
        map.value.on('idle', () => {
          // If these two layers were not added to the map, abort
          // if (!map.value.getLayer(sourceName)) return
        })

        map.value.on('click', layerName, (e: any) => {
          map.value.getCanvas().style.cursor = 'pointer'
          if (popup.value) popup.value.remove()
          const { features, lngLat } = e
          const coordinates = features[0].geometry.coordinates.slice()
          const properties = features[0].properties
          if(properties) {
            targetBoxData.info = properties
            if(lngLat) targetBoxData.location = lngLat
            if(coordinates) mapMoveToCenter(coordinates)
          }
          // const description = `
          //   <p>店號: ${properties.store_id}</p>
          //   <p>店名: ${properties.store_name}</p>
          //   <p>地址: ${properties.address}</p>
          // `
          // // 確保訊息視窗不會被遮擋
          // while (Math.abs(lngLat.lng - coordinates[0]) > 180) {
          //   coordinates[0] += lngLat.lng > coordinates[0] ? 360 : -360
          // }
          // // 設定訊息視窗內容並在地圖上顯示
          // popup.value.setLngLat(coordinates).setHTML(description).addTo(map.value)
        })

        // map.value.on('zoomend', (event: Event) => {
        // console.log(map.value.getZoom());
        // console.log(map.value.getBounds());
        // })

        // 點擊按鈕取client位置
        geolocate.value.on('geolocate', async () => {
          console.log('2. A geolocate event has occurred.')
        })
      })
  })

  return {
    storeFilterSelectd,
    storeFilterOptions,
    mapConfig,
    map,
    geolocate,
    popup,
    addDataToMap,
    updateChecked,
    targetBoxData,
    toggleStoreInfo,
    mapNavigation
  }
}
