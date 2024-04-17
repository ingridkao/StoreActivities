<script setup lang="ts">
/**
 * 打卡結果
 */
import { computed  } from 'vue'
import type { ScanResultType } from '@/composable/configurable'
import { useLink } from '@/composable/useLink'
const { linkToCollect } = useLink()

const props = defineProps<{
  result: ScanResultType
}>()

const successResult = computed(() => Object.keys(props.result).length > 0)

const scanAgain = async () => {
  window.location.reload()
}

</script>

<template>
  <div class="scanResult" :class="successResult ? 'success' : 'fail'">
    <section v-if="successResult">
      打卡成功
      <div>
        {{ props.result }}
      </div>
    </section>
    <section v-else>
      打卡失敗
    </section>
    <section>
      <button @click="linkToCollect(props.result)">查看紀錄</button>
      <button @click="scanAgain">繼續打卡</button>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.scanResult {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  &.fail {
    background-color: #95a6b8;
  }

  &.success {
    background-color: #b6c88a;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
