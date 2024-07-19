declare let gomp: any

import { UAParser } from 'ua-parser-js'

import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFetchData } from '@/composable/useFetch'
import { useSweetAlert } from '@/composable/useSweetAlert'
import { useLayoutStore } from '@/stores/layout'
import type { GeoJsonProperties, LatLngType, ActiveIconType, IconTypeListType } from '@/types/map'

export function useMap8box() {
  const { VITE_OUTDIR, VITE_MAP8_KEY, VITE_ASSETS_URL } = import.meta.env
  const { fetchDefaultLayerData, fetchActiveLayerData, fetchActiveIconData } = useFetchData()
  const { mapErrorAlert } = useSweetAlert()
  const layoutStore = useLayoutStore()
  const route = useRoute()
  const activityId = route?.params?.id
  console.log(activityId);
  
  const defaultSourceName = 'default-store-source'
  const activitySourceName = 'activity-store-source'
  const defaultLayerName = 'all-store-layer'
  const activityLayerName = 'activity-store-layer'
  const mapLayersName = reactive<String[]>([])

  const markerId = 'common-marker'
  // const radiusRangeName = 'radius-range'
  let mapboxEl = null as any
  // let popup = null as any

  /**
   * 地圖基本設定
   */
  const mapConfig = {
    minZoom: 14.5, // 直徑約2km
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

  /**
   * 設定地圖icon
   */
  const iconTypeList = ref<IconTypeListType[]>([])
  const loadMultIconImage = async () => {
    if (iconTypeList.value.length === 0) return
    return Promise.all(
      iconTypeList.value.map(async (iconType: IconTypeListType) => {
        return new Promise((resolve, reject) => {
          mapboxEl.loadImage(iconType.url, (error: any, iconImage: ImageBitmap) => {
            if (error) {
              reject(error)
            } else {
              mapboxEl.addImage(iconType.id, iconImage)
              resolve(mapboxEl.hasImage(iconType.id))
            }
          })
        })
      })
    )
      .then((icons) => icons)
      .catch((error) => error)
  }
  const loadDefaultIconImage = async () => {
    const originURL = window.location.origin
    const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
    return new Promise((resolve, reject) => {
      mapboxEl.loadImage(
        `${fileOrigin}/images/map/711.png`,
        (error: any, iconImage: ImageBitmap) => {
          if (error) {
            reject(error)
          } else {
            mapboxEl.addImage(markerId, iconImage)
            resolve(mapboxEl.hasImage(markerId))
          }
        }
      )
    })
  }

  /**
   * 設定圖層樣式
   * 一般門市(有7-11 icon)以及活動門市(有活動icon)
   */
  const storeLayerStyle = {
    'text-font': ['Noto Sans Regular'], // 文字字體(map8必要資料, 不可省略)
    'text-field': '{storename}門市', //資訊文字
    'text-offset': [0, 1.8], //文字位移位置第一個為x軸, 第二個為y軸
    'text-size': {
      stops: [
        [mapConfig.zoom - 0.5, 0],
        [mapConfig.zoom, 11.5]
      ]
    },
    'icon-allow-overlap': true,
    'icon-offset': [0, -21]
  }

  const addDefultLayerData = () => {
    mapboxEl.addLayer({
      id: defaultLayerName,
      source: defaultSourceName,
      type: 'symbol',
      layout: {
        ...storeLayerStyle,
        'icon-image': markerId,
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          mapConfig.zoom,
          0.5,
          mapConfig.maxZoom,
          0.4
        ]
      }
    })
    mapLayersName.push(defaultLayerName)
  }

  const addActivityLayerData = () => {
    mapboxEl.addLayer({
      id: activityLayerName,
      source: activitySourceName,
      type: 'symbol',
      layout: {
        ...storeLayerStyle,
        visibility: 'none',
        'icon-image': ['case', ["to-boolean", ['get', 'iconid']], ['get', 'iconid'], markerId],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          mapConfig.zoom,
          0.4,
          mapConfig.maxZoom,
          0.45
        ]
      }
    })
    mapLayersName.push(activityLayerName)
  }

  // Radius: 5km
  // const addRadiusRange = (coordinates: number[]) => {
  // const geojsonSource = mapboxEl.getSource(`${radiusRangeName}-source`)
  //   const pt = point(coordinates)
  //   const mapBuffered = buffer(pt, 5)
  //   if (geojsonSource) {
  //     geojsonSource.setData(mapBuffered)
  //   } else {
  // mapboxEl.addSource(`${radiusRangeName}-source`, {
  //       type: 'geojson',
  //       data: mapBuffered
  //     })
  //     mapboxEl.addLayer({
  // id: `${radiusRangeName}-layer`,
  //       type: 'fill',
  // source: `${radiusRangeName}-source`,
  //       layout: {},
  //       paint: {
  //         'fill-color': '#F2F12D',
  //         'fill-opacity': 0.5
  //       }
  //     })
  //   }
  // }

  /**
   * 圖層篩選：依據資料
   * - 顯示所有門市:A
   * - 顯示主題門市:A,B
   * - 顯示聯名門市:A,c
   * - 篩選活動門市:Event
   */
  const storeFilterSelectd = ref<String>('A')
  const storeFilterOptions = reactive([{ value: 'A', nameTw: '所有門市' }])
  const updateChecked = (target: String) => {
    storeFilterSelectd.value = target
    if (mapboxEl.getLayer(defaultLayerName)) {
      if (target === 'Event') {
        mapboxEl.setLayoutProperty(defaultLayerName, 'visibility', 'none')
      } else {
        getDefaultLayerCount()
        mapboxEl.setLayoutProperty(defaultLayerName, 'visibility', 'visible')
        mapboxEl.setFilter(defaultLayerName, target === 'A' ? null : target)
      }
    }
    if (activityId && mapboxEl.getLayer(activityLayerName)) {
      switch (target) {
        case 'Event':
          getActiveLayerCount()
          mapboxEl.setLayoutProperty(activityLayerName, 'visibility', 'visible')
          break
        default:
          mapboxEl.setLayoutProperty(activityLayerName, 'visibility', 'none')
          break
      }
    }
  }

  // 門市資料
  const targetBoxData = reactive({
    toggle: false as boolean,
    imgURL: '' as string,
    info: {} as GeoJsonProperties,
    location: {} as LatLngType
  })
  const closeStoreInfo = () => {
    targetBoxData.toggle = false
    targetBoxData.imgURL = ''
    targetBoxData.info = {}
    targetBoxData.location = {}
  }

  /**
   * 顯示門市資料：點擊後依據point properties顯示，並將移至地圖中心
   * 點擊位置取得 features的屬性properties和地理位置
   */
  const showInfoAndMoveToCenter = (e: any) => {
    const { features, lngLat } = e
    const { properties, geometry } = features[0]
    if (properties) {
      targetBoxData.info = properties
      const img = iconTypeList.value.find((item: IconTypeListType) => item.id == properties.iconid)
      if (img) targetBoxData.imgURL = img.url
      if (lngLat) targetBoxData.location = lngLat
      if (geometry.coordinates) mapMoveToCenter(geometry.coordinates)
    }
  }

  // 關閉門市資料
  let cacheStore_id = ''
  const toggleStoreInfo = (classList: string) => {
    if (Object.keys(targetBoxData.location).length === 0) return
    if (!targetBoxData.info.storeid) return
    if (!targetBoxData.toggle) {
      targetBoxData.toggle = true
      cacheStore_id = targetBoxData.info.storeid
    } else if (targetBoxData.toggle && targetBoxData.info.storeid === cacheStore_id) {
      const trigger = ['infoBox'].some((className) => classList.includes(className))
      if (!trigger) closeStoreInfo()
    }
  }

  /**
   * 載入地圖主程式
   * 這個project使用動態載入
   */
  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof gomp != 'undefined') resolve(true)
      const scr = document.createElement('script')
      scr.type = 'text/javascript'
      scr.src = `https://api.map8.zone/maps/js/gomp.js?key=${VITE_MAP8_KEY}`
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
      link.href = `https://api.map8.zone/css/gomp.css?key=${VITE_MAP8_KEY}`
      link.onload = () => resolve(true)
      link.onerror = (err) => reject(err)
      document.head.appendChild(link)
    })
  }

  /**
   * onMounted後執行地圖程式
   */
  const mapDisplayCountMsg = ref<String>('')
  const activeStoreCount = ref<Number>(0)
  onMounted(() => {
    fetchIconData()

    layoutStore.loadToggle(true)

    loadStyle()
    loadScript()
      .catch((error) => {
        mapErrorAlert('載入異常' + String(error))
      })
      .then(() => {
        gomp.accessToken = VITE_MAP8_KEY
        mapboxEl = new gomp.Map({
          container: 'map8boxBasic', // 地圖容器 ID
          style: 'https://api.map8.zone/styles/go-life-maps-tw-style-std/style.json',
          maxBounds: mapConfig.maxBounds,
          center: mapConfig.taipeiCenter,
          zoom: mapConfig.zoom,
          minZoom: mapConfig.minZoom, // 限制地圖可縮放之最小等級, 可省略, [0-19.99]
          maxZoom: mapConfig.maxZoom, // 限制地圖可縮放之最大等級, 可省略 [0-19.99]
          scrollZoom: false, // 關閉始scroll,始配合始map.scrollZoom.enable({around: 'center'});始可以改根據地圖中心縮放,始預設為根據鼠標位置縮放
          attributionControl: false
        })

        // Initialize the GeolocateControl / Mapbox location button
        const geolocateEl = new gomp.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        })

        mapboxEl.on('load', async () => {
          mapboxEl.scrollZoom.enable({ around: 'center' }) // 改為根據地圖中心縮放
          mapboxEl.scrollZoom.setZoomRate(1 / 100) // 觸控板縮放, 分母越大級距越小
          mapboxEl.scrollZoom.setWheelZoomRate(1 / 10) // 滑鼠滾輪縮放, 分母越大級距越小
          // 隱藏底圖7-11圖層
          mapboxEl.setFilter('poi-all', ['all', ['!=', ['get', 'subclass'], '7-11']])
          mapboxEl.setFilter('poi-Z11-z19', [ 'all', [ '!=', ['get', 'subclass'], '7-11'],[ '==', ['get', 'svg'], 1]])

          try {
            await loadDefaultIconImage()
            const LocationCenter = mapboxEl.getCenter()

            // 取得一般門市(api)
            const defaultResults = await fetchDefaultLayerData(
              LocationCenter.lng,
              LocationCenter.lat
            )
            if (defaultResults) {
              mapboxEl.addSource(defaultSourceName, { type: 'geojson', data: defaultResults })
              addDefultLayerData()
            }

            // 取得活動限定門市
            if (activityId) {
              const activeResults = await fetchActiveLayerData(
                LocationCenter.lng,
                LocationCenter.lat,
                activityId
              )
              if (activeResults) {
                activeStoreCount.value = activeResults.features?.length || 0
                mapboxEl.addSource(activitySourceName, { type: 'geojson', data: activeResults })
                const rr = await loadMultIconImage()
                if (rr) addActivityLayerData()

                storeFilterOptions.push({ value: 'Event', nameTw: '活動限定' })
                // updateChecked('Event')
              } else {
                // 該活動沒有限定門市
                // storeFilterOptions.push({ value: 'A,B', nameTw: '主題門市'})
                // storeFilterOptions.push({ value: 'A,C', nameTw: '聯名門市'})
              }
            } else {
              // 顯示主題門市和聯名門市
              // storeFilterOptions.push({ value: 'A,B', nameTw: '主題門市'})
              // storeFilterOptions.push({ value: 'A,C', nameTw: '聯名門市'})
            }
          } catch (error) {
            mapErrorAlert(String(error))
          }

          // Add the control to the map.
          mapboxEl.addControl(new gomp.NavigationControl())
          mapboxEl.addControl(
            new gomp.AttributionControl({
              compact: false
            })
          )
          mapboxEl.addControl(geolocateEl)
        })

        // Initialize the Popup.
        // https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
        // popup = new gomp.Popup({
        //   anchor: 'bottom',
        //   closeButton: true,
        //   closeOnClick: false,
        //   offset: [0, -30]
        // })

        // When user clicking on the map, close the store bottom popup if it is not 'all-layer'.
        mapboxEl.on('click', (e: any) => {
          if (e.defaultPrevented) return
          if (!targetBoxData.toggle) return
          const selectedFeatures = mapboxEl.queryRenderedFeatures(
            [
              [e.point.x - 5, e.point.y - 5],
              [e.point.x + 5, e.point.y + 5]
            ],
            {
              layers: mapLayersName
            }
          )
          if (selectedFeatures.length === 0) closeStoreInfo()
        })

        // When user clicking default store Layer on the map, show info popup
        mapboxEl.on('click', defaultLayerName, (e: any) => {
          if (e.defaultPrevented) return
          mapboxEl.getCanvas().style.cursor = 'pointer'
          showInfoAndMoveToCenter(e)
        })

        // When user clicking activity store Layer on the map, show info popup
        if (activityId) {
          mapboxEl.on('click', activityLayerName, (e: any) => {
            if (e.defaultPrevented) return
            mapboxEl.getCanvas().style.cursor = 'pointer'
            showInfoAndMoveToCenter(e)
          })
        }

        // 地圖平移結束
        mapboxEl.on('dragend', async (e: any) => {
          // console.log('dragend');
          getDefaultLayerCount()
          getActiveLayerCount()
        })

        // 在渲染最後一幀後
        mapboxEl.on('idle', async () => {
          // console.log('idle');
          layoutStore.loadToggle(false)
        })

        // Geolocation API 位置成功更新時觸發。
        geolocateEl.on('geolocate', () => {
          console.log('A geolocate event has occurred.')
          getDefaultLayerCount()
          getActiveLayerCount()
        })

        // 成功返回但使用者位置超出地圖 maxBounds
        geolocateEl.on('outofmaxbounds', () => {
          console.log('An outofmaxbounds event has occurred.')
        })
        geolocateEl.on('trackuserlocationend', () => {
          console.log('A trackuserlocationend event has occurred.')
        })
      })
  })

  /**
   * 擷取符合地圖中心位置的一般門市資料到地圖Source中
   */
  const getDefaultLayerCount = async () => {
    if (storeFilterSelectd.value === 'Event') return
    try {
      const LocationCenter = mapboxEl.getCenter()
      const defaultNewResults = await fetchDefaultLayerData(LocationCenter.lng, LocationCenter.lat)
      if (defaultNewResults) {
        mapboxEl.getSource(defaultSourceName).setData(defaultNewResults)
      }
    } catch (error) {
      mapErrorAlert(String(error))
    }
  }

  /**
   * 擷取符合地圖中心位置的活動限定門市資料到地圖Source中
   * 取得目前在地中得活動門市數量訊息
   */
  const getActiveLayerCount = async () => {
    if (!(activityId && storeFilterSelectd.value === 'Event')) return
    try {
      const LocationCenter = mapboxEl.getCenter()
      const activeResults = await fetchActiveLayerData(LocationCenter.lng, LocationCenter.lat, activityId)
      if (activeResults) {
        mapboxEl.getSource(activitySourceName).setData(activeResults)
        const activityFeatures = mapboxEl.queryRenderedFeatures({ layers: [activityLayerName] })
        mapDisplayCountMsg.value = `目前地圖中出現${activityFeatures.length}家活動門市，共有${activeStoreCount.value}家`
      }else{
        mapDisplayCountMsg.value = ''
      }
    } catch (error) {
      mapErrorAlert(String(error))
    }
  }

  /**
   * 載入活動門市icon列表
   */
  const fetchIconData = () => {
    if (!activityId) return
    fetchActiveIconData(activityId)
      .then((res: any) => {
        if (res.length === 0) return
        iconTypeList.value = res.map((item: ActiveIconType) => {
          return {
            url: `${VITE_ASSETS_URL}${item.iconFilePath}`,
            id: item.id
          }
        })
      })
      .catch((error) => {
        mapErrorAlert('icon資料請求錯誤' + String(error))
      })
  }

  /**
   * 將地圖中心點移動至店位置
   */
  const mapMoveToCenter = (coordinates: [number, number]) => {
    mapboxEl.easeTo({
      center: coordinates,
      zoom: mapConfig.zoom,
      duration: 600,
      easing: (easeEvent: any) => easeEvent
    })
  }

  /**
   * 開啟googlemap導航: 前往目的地的經緯度
   * https://docs.uaparser.js.org/v2/api/ua-parser-js/get-device.html
   */
  const mapNavigation = () => {
    const parser = new UAParser()
    const { lat, lng } = targetBoxData.location
    const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    const result = parser.getDevice()
    if (result.type) {
      // 創建<a>標籤，模擬單擊操作
      const link = document.createElement('a')
      link.href = googleMapUrl
      link.target = '_blank'
      link.click()
      link.remove()
    } else {
      window.open(googleMapUrl, '_blank', 'noopener noreferrer')
    }
  }

  return {
    storeFilterSelectd,
    storeFilterOptions,
    mapDisplayCountMsg,
    targetBoxData,
    updateChecked,
    toggleStoreInfo,
    mapNavigation
  }
}
