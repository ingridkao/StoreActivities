import { ref, onMounted } from 'vue'
// import axios from 'axios'

export function useURL() {

  const ct = ref('')

  const getQueryParam = (url, param) => {
    const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)');
    const results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  onMounted(() => {
    ct.value = getQueryParam(window.location.href, 'ct')
  })

  return {
    ct,

  }
}
