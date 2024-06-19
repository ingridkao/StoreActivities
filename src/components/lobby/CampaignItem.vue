<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import { useRouter } from 'vue-router'
import type { CampaignInterface } from '@/types/ResponseHandle'
import { useDay } from '@/composable/useDay'

const { VITE_ASSETS_URL, VITE_OUTDIR } = import.meta.env
const props = defineProps<{
  campaignItem: CampaignInterface
}>()
const { parseYYYYMMDD } = useDay()
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
</script>

<template>
  <div
    class="activities"
    :class="{ invalid: !props.campaignItem.isEnable }"
    @click="linkTo(props.campaignItem)"
  >
    <div class="activities__img">
      <img
        :src="
          VITE_ASSETS_URL && props.campaignItem.imageFilePath
            ? `${VITE_ASSETS_URL}${props.campaignItem.imageFilePath}`
            : `${fileOrigin}/images/lobby/lobby-item-1.png`
        "
        :alt="props.campaignItem.eventName ?? ''"
      />
    </div>
    <div class="activities__info">
      <h6>{{ props.campaignItem.eventName }}</h6>
      <b>
        {{ parseYYYYMMDD(props.campaignItem.startTime) }} -
        {{ parseYYYYMMDD(props.campaignItem.endTime) }}
      </b>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activities {
  cursor: pointer;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0px 0.25rem 0.25rem 0px rgba($black, 0.3);
  background-color: transparent;
  &.invalid {
    opacity: 0.3;
  }
  &__img {
    background-color: $white2;
    aspect-ratio: 169/50;
    img {
      border-radius: 1.5rem 1.5rem 0px 0px;
      overflow: hidden;
      object-fit: cover;
    }
  }

  &__info {
    @extend %flexColInfo;
    align-items: flex-start;
    justify-content: center;
    gap: 0.5rem;

    padding: 1rem;
    background-color: $whitePure;
    color: $black;
  }
}
</style>
