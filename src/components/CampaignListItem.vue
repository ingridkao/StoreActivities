<script setup lang="ts">
/**
 * 進行中活動 || 預告中活動 || 已結束活動
 */
import { useRouter } from 'vue-router'
import type { EventInterface } from '@/types/ResponseHandle'
const { VITE_ASSETS_URL, VITE_OUTDIR } = import.meta.env
const props = defineProps<{
  campaign: EventInterface
}>()
const router = useRouter()
const linkTo = async () => {
  const { isEnable, pageRouter } = props.campaign
  if (!isEnable) return
  if (pageRouter) {
    router.push({
      name: 'Activity',
      params: {
        id: pageRouter
      }
    })
  }
}
const originURL = window.location.origin
const fileOrigin = VITE_OUTDIR ? `${originURL}/${VITE_OUTDIR}` : ''
</script>

<template>
  <div class="activities" :class="{ invalid: !props.campaign.isEnable }" @click="linkTo()">
    <div class="activities__img">
      <img
        :src="
          VITE_ASSETS_URL && props.campaign.imageFilePath
            ? `${VITE_ASSETS_URL}${props.campaign.imageFilePath}`
            : `${fileOrigin}/images/lobby/lobby-item-1.png`
        "
        :alt="props.campaign.eventName ?? ''"
      />
    </div>
    <!-- TODO: Add else statement for past event -->
    <div class="activities__info">
      <p class="activities__info--title">{{ props.campaign.eventName }}</p>
      <p class="activities__info--date">
        {{ props.campaign.startTime }} - {{ props.campaign.endTime }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activities {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin-bottom: 12px;
  &.invalid {
    opacity: 0.3;
  }

  &__img {
    width: 338px;
    height: 100px;

    img {
      width: 100%;
      height: 100%;
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

    &--title {
      font-size: 18px;
    }

    &--date {
      font-size: 13px;
    }
  }
}
</style>
