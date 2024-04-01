<template>
  <div class="login">
    <div v-if="loginInfo" class="loginInfoBox">
      <img :src="loginInfo.picture" :alt="loginInfo.name">
      {{ loginInfo.name }}
      <RouterLink to="/">回到首頁</RouterLink>
    </div>
    <button v-else @click="lineLoginEvent">Line Login</button>
  </div>
</template>

<script lang="ts">
// 之後改寫成composition API
interface loginInfoOption {
  picture?: string
  name?: string
};
declare module 'qs';
import qs from 'qs';
import axios from 'axios';

const line_channel_id = import.meta.env.VITE_LINE_CHANNEL_ID;         // Line Channel ID
const line_channel_secret = import.meta.env.VITE_LINE_CHANNEL_SECRET; // Line Channel Secret
const line_redirect_uri = import.meta.env.VITE_LINE_CHANNEL_REDIRECT;         // Line developer Callback URL

export default {
  data() {
    return {
      loginInfo: null as null | loginInfoOption,
      line_channel_id: import.meta.env.VITE_LINE_CHANNEL_ID,    // Line Channel ID
      line_channel_secret: import.meta.env.VITE_LINE_CHANNEL_SECRET,// Line Channel Secret
      line_redirect_uri: import.meta.env.VITE_LINE_CHANNEL_REDIRECT,  // Line developer Callback URL
    }
  },
  async mounted() {
    // 使用 window.location.search 和 urlParams 獲取當前網頁 URL 中的查詢參數
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      // 使用 get 方法從 urlParams 實例中獲取名為 code 的參數的值。(授權碼，通常由用戶在身份驗證流程中獲得)
      // 如果查詢字串中存在名為 code 的參數，code 變數將被賦值為該參數的值；否則，code 變數將為 null。
      const code = urlParams.get('code');
      await this.lineLoginRedirect(code)
    } else {
      this.loginInfo = null
      // 判斷有沒有登入過，如果沒有token等同於沒有登入
    }
  },
  methods: {
    lineLoginEvent() {
      // 根據指定的 client_id、redirect_uri、scope 等參數組合出一個 LINE 登入的連結
      const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${line_channel_id}&redirect_uri=${line_redirect_uri}&state=login&scope=openid%20profile`;
      // 將頁面重新導向到該連結
      window.location.href = link;
    },
    async lineLoginRedirect(code: any) {
      try {
        /*
            使用 Axios 發送 HTTP POST 請求到指定的 URL
            並指定 'Content-Type': 'application/x-www-form-urlencoded' 標頭以指示伺服器使用 URL 編碼形式解析參數
            grant_type：指定授權類型為 "authorization_code"
            code：授權碼，這個值是從 code 變數中取得的
            redirect_url：指定用戶授權完成後的重定向 URL
            client_id：用於識別應用程式的客戶端 ID
            client_secret：應用程式的客戶端密鑰
            這些參數使用 qs.stringify 函式轉換為 URL 編碼的形式，以符合 "application/x-www-form-urlencoded" 的請求格式
            Content-Type': 'application/x-www-form-urlencoded'：指定請求的內容類型為 URL 編碼形式
        */
        const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
          grant_type: 'authorization_code',
          code: code,
          // yourURI 請設置為實際Line developer 設定的重新導向網址
          redirect_uri: line_redirect_uri,
          client_id: line_channel_id,
          client_secret: line_channel_secret
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        /*
            從 tokenResponse 的回應資料中取得 access_token 和 id_token。
            這些欄位是從 LINE 登入 API 取得的授權資訊。
            access_token 是用來作為驗證的令牌
            id_token 是使用者的身份令牌。
        */
        if (tokenResponse) {
          const accessToken = tokenResponse.data.access_token;
          const idToken = tokenResponse.data.id_token;
          /*
              使用 Axios 發送 HTTP POST 到 https://api.line.me/oauth2/v2.1/verify，驗證 id_token 以獲取包含使用者資訊的回應
              id_token：用於識別使用者的身份令牌
              client_id：用於識別應用程式的客戶端 ID
              使用 qs.stringify 函式轉換為 URL 編碼的形式，以符合 "application/x-www-form-urlencoded" 的請求格式
              Content-Type': 'application/x-www-form-urlencoded'：指定請求的內容類型為 URL 編碼形式。
              'Authorization': 'Bearer ' + accessToken：使用存取令牌進行身份驗證，將存取令牌放在 'Bearer ' 字符串之後。
          */
          const userInfoResponse = await axios.post('https://api.line.me/oauth2/v2.1/verify', qs.stringify({
            id_token: idToken,
            client_id: line_channel_id
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + accessToken
            }
          });

          /*
              根據需求，可以在登入後的處理中進行相應的操作，例如驗證用戶資訊、儲存登入狀態等。
          */
          this.loginInfo = userInfoResponse.data
          // this.$router.push('/')
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style lang="scss">
.login,
.loginInfoBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.login {
  padding: 1rem;
}

.loginInfoBox img {
  width: 15rem;
  height: 15rem;
  border-radius: 15rem;
  margin-bottom: 1rem;
}
</style>