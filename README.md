# StoreActivities

門市打卡
[demo](https://qwaretest2.web.app/)
[LIFF](https://liff.line.me/2003380973-6NBnrB5K)

## Git Flow

目前分支僅main, dev, feature

1. main:主要部屬分支
   > 主要功能完成或是每周進行dev>main合併
2. dev: 主要開發分支
   > 更新頻率: 2days
3. feature: 根據功能和需求建立不同的分支
   1. 新增分支(base dev)
      > 分支名稱建議:
      > feat/add-linescan
      > feat/integrate-checkin-api
      > style/add-homepage
      > style/rewrite-lightbox
      > 可以使用chartGPT prompt:`使用git flow，<功能開發描述>，寫出分支名稱`
   2. 進行feat>dev合併，**請使用Github pull request(PR)**
   3. 合併完刪除該feature分支


## User story | Issue

- [x] 使用者使用LINE登入(透過Line LIFF實現)
- [x] 使用者在活動大廳(/)觀看有興趣的活動
  - [ ] 樣式
- [x] 使用者在活動詳情頁面(/activity)觀看活動說明
  - [ ] 樣式
  - [ ] 串接API(待UI完成再進行)
- [ ] 使用者透過門市地圖(/mapStore)找到附近或是特色、聯名門市，並可以導航至門市
  - [ ] 樣式
- [x] 使用者開啟掃描說明(/direction)進行開啟相機
  - [ ] 樣式
- [x] 使用者查閱過去所有活動打卡紀錄(/album)
  - [ ] 樣式
- [x] 使用者看到單一活動打卡結果(/collected)
  - [ ] 樣式
- [ ] 使用者使用手機掃描機台qrCode確認所在位置
      POST`https://print-api-uat.ibon.com.tw/cloudprint_api_dev/api/ExtraActivity/ScanEntry/IbonEntry`
- [ ] 打開大廳頁面選擇活動後驗證打卡是否成功
  - [ ] 樣式


### 頁面說明

| | Page          | @/view             | @/component            | Description |
|-| ------------- | ------------------ | ---------------------- | ----------- |
|O|活動大廳        | LobbyView.vue      | ActivitiesListItem.vue | 活動列表組件 |
| |活動說明        | ActivityView.vue   | HeaderMenu             |             |
|O|打卡教學        | DirectionView.vue  | HeaderMenu             |             |
|O|相機掃描        | ScanView.vue       | ScanResult             |            |
|O|所有活動打卡紀錄 | AlbumView.vue      |                        |             |
|O|單一活動打卡紀錄 | CollectedView.vue  | HeaderMenu             |             |
|?|中獎序號        | WinningView.vue    |                        |             |
| |門市地圖        | MapStoreView.vue   | 門市詳細                |             |
|O|活動已結束      | WrapUpView.vue     |                        |             |
|O|ComingSoon     | ComingSoonView.vue |                         | 404page     |

### 組件說明

| | Component              | Description  | Used for                        |
|-| ---------------------- | ------------ | ------------------------------- |
|O| HeaderMenu.vue         | 會觸發Line登入| 活動說明,打卡教學,單一活動打卡紀錄 |
|O| ActivitiesListItem.vue | 活動列表      | 活動大廳                         |
|O| ScanResult.vue         | 打卡結果      | 相機掃描                         |



## Project Setup

### Install

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### 測試環境部屬

編譯成靜態並部屬到[firebase hosting](https://firebase.google.com/docs/hosting/quickstart?hl=zh&authuser=0)上

```sh
npm run deploy
```

### Mock API-dev

[Github](https://github.com/ingridkao/node_todo_test/tree/storeActivities)

1. 於此專案上一層檔案位置進行clone
   `git clone https://github.com/ingridkao/node_todo_test.git -b storeActivities`

2. 於node_todo_test目錄啟動nodejs http server
   `node store.js`

### Mock API-prod

[API URL](https://storeactivities-api.onrender.com)
更新API透過[Github](https://github.com/ingridkao/node_todo_test/tree/storeActivities)push自動部屬到render

```

```

<!-- ### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
``` -->

# tasks

- 使用者如果從其他方式進入網站導轉到Line
- 手機掃描機台qrCode
  - 已登入: 進行打卡行為
  - 未登入: 導轉到Line

# 疑慮

- 地圖其他功能?
  - 門市地圖特別活動
  - 如寶可夢地圖??
- 機台掃描行為

<!-- [![Standard - JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard) -->

# env

```
VITE_LIFF_ID=
VITE_LIFF_ENDPOINT_URL=

VITE_MOCKAPI_URL=
VITE_API_URL=
VITE_BASE_URL=

VITE_MAPBOX_KEY=

```

## 頁面對應

## 使用套件

### 1. sass/scss

安裝 Sass（Syntactically Awesome Stylesheets）的 npm 套件，其中的 -D 選項表示將該套件安裝為專案的開發依賴（devDependency）。

```sh
npm install -D sass
```

### 2.axios

```sh
npm install axios
```

### 3.turf

各式各樣地圖相關演算法

```sh
npm install @turf/turf
npm install @turf/boolean-point-in-polygon
npm install --save-dev @types/turf
```

### 4.[jsQR](https://github.com/cozmo/jsQR)

A pure javascript QR code reading library. This library takes in raw images and will locate, extract and parse any QR code found within.

```sh
npm install jsqr --save
```

### 4.qs

將對象序列化

```sh
npm i qs
npm i --save-dev @types/qs
```

### 5.vueuse

```sh
npm i @vueuse/core
```

### 6.[UAParser.js](https://docs.uaparser.js.org/v2/)

[Github Repo](https://github.com/faisalman/ua-parser-js)

開源 JavaScript 程式庫，用於偵測使用者的瀏覽器、引擎、作業系統、CPU 和裝置類型/型號。

```sh
npm i ua-parser-js
npm i --save-dev @types/ua-parser-js
```

### 7.[sweetalert2](https://sweetalert2.github.io/)
用於創建美觀且高度可自訂的彈出式對話框 alert 和模態對話框 modal，可以取代 Window.alert()、Window.confirm() 和 window.prompt()，比原生的彈跳視窗更加美觀且有更高的可變性。

全域引入於`main.ts`

```sh
npm install sweetalert
```

## Lint with [ESLint](https://eslint.org/)

- 使用[eslint-plugin-vue](https://eslint.vuejs.org/): 專為 Vue.js 項目定制的 ESLint 插件，建立vue專案有選取的話不用另外安裝
- 執行

  ```sh
  npm run lint
  ```

  - 如出現錯誤執行`npm install typescript@4.3.5 --save-dev`
  - eslint-plugin-vue 會自動幫我們修正程式碼撰寫風格、HTML 標籤內的屬性順序、Vue 方法的排序等等都調整成 Vue Style Guide 的建議並存檔。

  [參考文章](https://pjchender.blogspot.com/2019/07/vue-vue-style-guide-eslint-plugin-vue.html)

## 開發中碰到的問題

1. [leaflet]在手機端地圖底圖一直出不來
   原本是以下寫法

   ```sh
       L.map("mapContainer",{
           minZoom: 16,
           zoom: 17,
           maxZoom: 18,
           maxBounds: [
               [25.531787576324817, 118.81139145520717], //south west
               [21.884874173374513, 122.7597027547547]  //north east
           ],
           layers: [
               new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
                   maxZoom: 18
               })
           ]
       })

   ```

   - 將TileLayer來源改成`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`，讓底圖為`https`，就可以避開限制

   - 原本`{s}`代表是TileLayer連結的subdomain，預設為a, b或c其中一個，[參考文章](https://ithelp.ithome.com.tw/articles/10203732)

   - openstreetmap地圖圖磚 [使用政策](https://operations.osmfoundation.org/policies/tiles/)
