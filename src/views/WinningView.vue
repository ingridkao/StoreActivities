<script setup lang="ts">
  /**
   * 中獎序號s
   */
  import { ref, onMounted } from 'vue'
  import { useLink } from '@/composable/useLink'
  const { linkToActivity } = useLink()

  const serialNumber = ref(5473985669)
  onMounted(() => {
    // getSerialNumber().then(number => {
    //   serialNumber.value = number
    // }).catch(error => {
    //   取得中獎序號失敗 -> sweetalert2
    //   console.error(error);
    // })
  })
</script>

<template>
  <main>
    <section>
      <h6>ibon列印碼</h6>
      <div>
        {{ serialNumber }}
      </div>
    </section>
    <section>
      <h6>使用說明</h6>
      <p>請至7-Eleven門市ibon機台列印，於.....</p>
      <button @click="linkToActivity()">回到活動首頁</button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
