# StoreActivities

This template should help get you started developing with Vue 3 in Vite.

# Project Setup

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

### 編譯成靜態並部屬到firebase hosting上

```sh
npm run deploy
```

### [API-dev](https://github.com/ingridkao/node_todo_test/tree/storeActivities)

1. 於此專案上一層檔案位置進行clone
   `git clone https://github.com/ingridkao/node_todo_test.git -b storeActivities`

2. 於node_todo_test目錄啟動nodejs http server
   `node store.js`

### [API-prod](https://storeactivities-api.onrender.com/activities)

更新API透過github自動部屬到render

```

```

<!-- ### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
``` -->

# User story

- 使用者可以透過掃描機台qrCode連結到官方Line
- 使用者不用進行登入(透過Line LIFF獲取)
- 使用者可以在活動大廳觀看有興趣的活動
- 使用者可以透過門市地圖找到附近或是特色門市、聯名門市，並可以導航至門市
- 使用者可以用手機掃描機台qrCode
- 使用者可以看到打卡紀錄

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
VITE_LINE_CHANNEL_ID=
VITE_LINE_CHANNEL_SECRET=
VITE_LINE_CHANNEL_REDIRECT=
VITE_LIFF_ID=
VITE_LIFF_ENDPOINT_URL=

VITE_API_URL=

VITE_MAP8_KEY=
VITE_MAPBOX_KEY=

```

# Skills

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

開源 JavaScript 程式庫，用於偵測使用者的瀏覽器、引擎、作業系統、CPU 和裝置類型/型號。

```sh
npm i ua-parser-js
npm i --save-dev @types/ua-parser-js
```

[github](https://github.com/faisalman/ua-parser-js)

### Lint with [ESLint](https://eslint.org/)

- 使用[eslint-plugin-vue](https://eslint.vuejs.org/): 專為 Vue.js 項目定制的 ESLint 插件，建立vue專案有選取的話不用另外安裝
- 執行

  ```sh
  npm run lint
  ```

  - 如出現錯誤執行`npm install typescript@4.3.5 --save-dev`
  - eslint-plugin-vue 會自動幫我們修正程式碼撰寫風格、HTML 標籤內的屬性順序、Vue 方法的排序等等都調整成 Vue Style Guide 的建議並存檔。

  [參考文章](https://pjchender.blogspot.com/2019/07/vue-vue-style-guide-eslint-plugin-vue.html)

# 部屬Deploy

[firebase hosting](https://firebase.google.com/docs/hosting/quickstart?hl=zh&authuser=0)

```sh
firebase deploy --only hosting
```

### 開發中碰到的問題

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

   - openstreetmap地圖圖磚 policies[使用政策](https://operations.osmfoundation.org/policies/tiles/)
