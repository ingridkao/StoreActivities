<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import type { CampaignInterface } from '@/types/ResponseHandle'
const { VITE_ASSETS_URL, VITE_OUTDIR } = import.meta.env
const props = defineProps<{
  campaignItem: CampaignInterface
}>()
const router = useRouter()
const linkTo = async (campaignItem: CampaignInterface) => {
  const { id, isEnable, pageRouter } = campaignItem
  if (!isEnable) return
  if (pageRouter) {
    router.push({
      name: 'Activity',
      params: {
        id: id
      }
    })
  }
}
const originURL = window.location.origin
const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
const parseStartTime = (startTime: string = '') =>
  startTime ? dayjs(startTime).format('YYYY/MM/DD') : ''
const parseEndTime = (endTime: string = '') => (endTime ? dayjs(endTime).format('YYYY/MM/DD') : '')
</script>

<template>
  <div
    class="lobby__activities"
    :class="{ invalid: !props.campaignItem.isEnable }"
    @click="linkTo(props.campaignItem)"
  >
    <div class="lobby__activities__img">
      <img
        :src="
          VITE_ASSETS_URL && props.campaignItem.imageFilePath
            ? `${VITE_ASSETS_URL}${props.campaignItem.imageFilePath}`
            : `${fileOrigin}/images/lobby/lobby-item-1.png`
        "
        :alt="props.campaignItem.eventName ?? ''"
      />
    </div>
    <div class="lobby__activities__info">
      <h6 class="lobby__activities__info--title">{{ props.campaignItem.eventName }}</h6>
      <p class="lobby__activities__info--date">
        {{ parseStartTime(props.campaignItem.startTime) }} -
        {{ parseEndTime(props.campaignItem.endTime) }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lobby__activities {
  cursor: pointer;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px #00000040;
  background-color: #ddd;
  &.invalid {
    opacity: 0.3;
  }
  &__img {
    height: 120px;
    img {
      object-fit: cover;
    }
  }

  &__info {
    padding: 15px;
    background-color: #fff;
    color: #000;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--date {
      font-size: 13px;
    }
  }
}
</style>
