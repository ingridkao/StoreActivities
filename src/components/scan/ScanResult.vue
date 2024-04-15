<script setup lang="ts">
/**
 * 打卡結果
 */
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { ScanResultType } from '@/composable/configurable'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
const { getAcString, setAcStorage } = useBrowserStorage()

const props = defineProps<{
  result: ScanResultType
}>()

watch(
  () => props.result.event_id,
  (eventId) => {
    
    if (eventId) setAcStorage(String(eventId))
  }, { deep: true }
)

const successResult = computed(() => Object.keys(props.result).length > 0)
const router = useRouter()

const acString = getAcString()
const showCollect = async () => {
  router.push({
    name: 'Collected',
    params: {
      id: props.result.event_id ?props.result.event_id: acString
    }
  })
}

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
      <button @click="showCollect">查看紀錄</button>
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
