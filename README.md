# StoreActivities

This template should help get you started developing with Vue 3 in Vite.

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Project Setup

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

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

- 使用[eslint-plugin-vue](https://eslint.vuejs.org/): 專為 Vue.js 項目定制的 ESLint 插件，建立vue專案有選取的話不用另外安裝
- 執行

  ```sh
  npm run lint
  ```

  - 如出現錯誤執行`npm install typescript@4.3.5 --save-dev`
  - eslint-plugin-vue 會自動幫我們修正程式碼撰寫風格、HTML 標籤內的屬性順序、Vue 方法的排序等等都調整成 Vue Style Guide 的建議並存檔。

  [參考文章](https://pjchender.blogspot.com/2019/07/vue-vue-style-guide-eslint-plugin-vue.html)
