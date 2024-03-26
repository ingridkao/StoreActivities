import { ref, onMounted } from 'vue'

// https://developers.line.biz/en/docs/liff/pluggable-sdk/#activate-liff-api
import liff from '@line/liff/core'
import isLoggedIn from '@line/liff/is-logged-in'

// The liff.use() method is executed before the liff.init() method
liff.use(new isLoggedIn())

export function useLIFF() {
  const message = ref('')
  const error = ref('')
  const isLoggedIn = ref(false)

  // function update(event) {
  //     message.value = event.pageX
  //     error.value = event.pageY
  // }

  onMounted(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        message.value = 'LIFF init succeeded.'
        isLoggedIn.value = liff.isLoggedIn()
      })
      .catch((e: Error) => {
        message.value = 'LIFF init failed.'
        error.value = `${e}`
      })
  })

  return { message, error, isLoggedIn }
}
