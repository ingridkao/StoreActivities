declare let mapboxgl: any
import { UAParser } from 'ua-parser-js'
import { point } from '@turf/helpers'
import buffer from '@turf/buffer'

import { ref, reactive, onMounted } from 'vue'
import { useFetchData } from '@/composable/useFetch'
import { useMap } from '@/composable/useMap'

export function useMapbox() {
  const { fetchLayerData } = useFetchData()
  const { clientLocationCity } = useMap()
  const { VITE_OUTDIR, VITE_MAPBOX_KEY } = import.meta.env

  const sourceName = 'store-source'
  const radiusRangeName = 'radius-range'
  const layerName = 'all-layer'
  const markerId = 'common-marker'
  let mapboxEl = null as any
  let geolocateEl = null as any
  // let popup = null as any
  // zoom: 初始 ZOOM LEVEL; [0-20, 0 為最小 (遠), 20 ;最大 (近)]
  // minZoom: 最大區域新北
  // center: 初始中心座標，格式為 [lng, lat]
  // maxBounds: 台灣地圖區域
  const mapConfig = {
    minZoom: 14,
    zoom: 16,
    maxZoom: 16.5,
    taipeiCenter: [121.54885, 25.03625],
    taipeiBound: [
      [24.396308, 121.2827],
      [25.585285, 122.0522]
    ],
    maxBounds: [
      [105, 15],
      [138.45858, 33.4]
    ]
  }

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

  const originURL = window.location.origin
  const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
  const loadMultIconImage = async () => {
    const iconImages = [
      { url: `${fileOrigin}/711_sl_36X36.gif`, id: 'common-marker' },
      { url: `${fileOrigin}/images/map/1.png`, id: 'songshan' },
      { url: `${fileOrigin}/images/map/2.png`, id: 'nangang' },
      { url: `${fileOrigin}/images/map/3.png`, id: 'daan' },
      { url: `${fileOrigin}/images/map/4.png`, id: 'shilin' },
      { url: `${fileOrigin}/images/map/5.png`, id: 'neihu' },
      { url: `${fileOrigin}/images/map/6.png`, id: 'wenshan' },
      { url: `${fileOrigin}/images/map/7.png`, id: 'xinyi' },
      { url: `${fileOrigin}/images/map/8.png`, id: 'beitou' },
      { url: `${fileOrigin}/images/map/9.png`, id: 'zhongshan' },
      { url: `${fileOrigin}/images/map/10.png`, id: 'zhongzheng' }
    ]
    return Promise.all(
      iconImages.map(async (img) => {
        return new Promise((resolve, reject) => {
          mapboxEl.loadImage(img.url, (error: any, iconImage: ImageBitmap) => {
            if (error) {
              reject(error)
            } else {
              mapboxEl.addImage(img.id, iconImage)
              resolve(mapboxEl.hasImage(img.id))
            }
          })
        })
      })
    )
      .then((icons) => icons)
      .catch((error) => error)
  }

  const addLayerData = () => {
    mapboxEl.addLayer({
      id: layerName,
      type: 'symbol',
      source: sourceName,
      layout: {
        // "text-font": ["Noto Sans Regular"], // 文字字體(map8必要資料, 不可省略)
        'text-field': '{store_name}門市', //資訊文字
        'text-offset': [0, 2.75], //文字位移位置第一個為x軸, 第二個為y軸
        'text-size': {
          stops: [
            [mapConfig.zoom - 1, 0],
            [mapConfig.zoom, 10]
          ]
        },
        'icon-allow-overlap': true,
        'icon-image': ['case', ['has', 'do'], ['get', 'do'], markerId],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          mapConfig.zoom,
          // 0.8,
          0.4,
          mapConfig.maxZoom,
          // 1.3
          1
        ],
        'icon-offset': [0, -21]
      }
    })
  }

  // Radius: 5km
  const addRadiusRange = (coordinates: number[]) => {
    const geojsonSource = mapboxEl.getSource(`${radiusRangeName}-source`)
    const pt = point(coordinates)
    const mapBuffered = buffer(pt, 5)
    if (geojsonSource) {
      geojsonSource.setData(mapBuffered)
    } else {
      mapboxEl.addSource(`${radiusRangeName}-source`, {
        type: 'geojson',
        data: mapBuffered
      })
      mapboxEl.addLayer({
        id: `${radiusRangeName}-layer`,
        type: 'fill',
        source: `${radiusRangeName}-source`,
        layout: {},
        paint: {
          'fill-color': '#F2F12D',
          'fill-opacity': 0.5
        }
      })
    }
  }

  const updateChecked = (target: String) => {
    storeFilterSelectd.value = target
    // if (popup) popup.remove()
    if (!mapboxEl.getLayer(layerName)) return
    if (target === 'all') {
      mapboxEl.setFilter(layerName, null)
    } else {
      mapboxEl.setFilter(layerName, ['in', 'store_type', target])
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
    targetBoxData.info = {}
  }

  let cacheStore_id = ''
  const toggleStoreInfo = (classList: string) => {
    if (Object.keys(targetBoxData.location).length === 0) return
    if (!targetBoxData.toggle) {
      targetBoxData.toggle = true
      cacheStore_id = targetBoxData.info.store_id
    } else if (targetBoxData.toggle && cacheStore_id === targetBoxData.info.store_id) {
      const trigger = ['infoBox'].some((className) => classList.includes(className))
      if (!trigger) closeStoreInfo()
    }
  }

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
  const mapMoveToCenter = (coordinates: [number, number]) => {
    mapboxEl.easeTo({
      center: coordinates,
      zoom: mapConfig.zoom,
      duration: 600,
      easing: (easeEvent: any) => easeEvent
    })
    // addRadiusRange(coordinates)
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
        mapboxgl.accessToken = VITE_MAPBOX_KEY

        // Initialize the Popup.
        // popup = new mapboxgl.Popup({
        //   anchor: 'bottom',
        //   closeButton: true,
        //   closeOnClick: false,
        //   offset: [0, -30]
        // })

        // Initialize the GeolocateControl / Mapbox location button
        geolocateEl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          //地圖上將在使用者所在位置顯示一個點
          trackUserLocation: true,
          // 使用者位置點旁邊繪製一個箭頭，trackUserLocation要為true
          showUserHeading: true,
          // 使用者位置周圍繪製一個透明圓圈
          showAccuracyCircle: true
        }).on('geolocate', async () => {
          console.log('2. A geolocate event has occurred.')
        })

        mapboxEl = new mapboxgl.Map({
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

        // 另一個加marker的方法
        // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
        // mapbox不支援GIF僅靜態圖片和canvas
        mapboxEl.on('load', async () => {
          console.log('mapbox loaded')

          mapboxEl.scrollZoom.enable({ around: 'center' }) // 改為根據地圖中心縮放
          mapboxEl.scrollZoom.setZoomRate(1 / 1600) // 觸控板縮放, 分母越大級距越小
          mapboxEl.scrollZoom.setWheelZoomRate(1 / 100) // 滑鼠滾輪縮放, 分母越大級距越小

          try {
            const storeResults = await fetchLayerData(clientLocationCity.value)
            if (!storeResults) {
              // TODO: alert
              console.error('不合法的geojson')
            } else {
              mapboxEl.addSource(sourceName, {
                type: 'geojson',
                data: storeResults
              })
              // addRadiusRange(mapConfig.taipeiCenter)

              const rr = await loadMultIconImage()
              if (!rr) return
              addLayerData()
            }
          } catch (error) {
            // TODO: alert
            console.error(error)
          }

          // When user clicking on the map, close the store bottom popup if it is not 'all-layer'.
          mapboxEl.on('click', (e: any) => {
            if (e.defaultPrevented) return
            if (!targetBoxData.toggle) return
            try {
              const bbox = [
                [e.point.x - 5, e.point.y - 5],
                [e.point.x + 5, e.point.y + 5]
              ]
              const selectedFeatures = mapboxEl.queryRenderedFeatures(bbox, {
                layers: [layerName]
              })
              if (selectedFeatures.length === 0) closeStoreInfo()
            } catch (error) {
              console.error(error)
            }
          })

          // Clicking on a store icon on the map retrieves information about this store
          // properties: the data source is the features object in GeoJSON
          mapboxEl.on('click', layerName, (e: any) => {
            mapboxEl.getCanvas().style.cursor = 'pointer'
            // if (popup) popup.remove()
            const { features, lngLat } = e
            const coordinates = features[0].geometry.coordinates.slice()
            const properties = features[0].properties
            if (properties) {
              targetBoxData.info = properties
              if (lngLat) targetBoxData.location = lngLat
              if (coordinates) mapMoveToCenter(coordinates)
            }
          })

          // mapboxEl.on('zoomend', (event: Event) => {
          // console.log(mapboxEl.getZoom());
          // console.log(mapboxEl.getBounds());
          // })

          // Add the control to the map.
          mapboxEl.addControl(new mapboxgl.NavigationControl())
          mapboxEl.addControl(
            new mapboxgl.AttributionControl({
              compact: false
            })
          )
          mapboxEl.addControl(geolocateEl)
        })

        // After the last frame rendered before the map enters an "idle" state.
        mapboxEl.on('idle', () => {
          // If these two layers were not added to the map, abort
          if (!mapboxEl.getLayer(layerName)) return
        })
      })
  })

  return {
    storeFilterSelectd,
    storeFilterOptions,
    targetBoxData,
    updateChecked,
    toggleStoreInfo,
    mapNavigation
  }
}
