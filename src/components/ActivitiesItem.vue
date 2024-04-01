<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFetchData } from '@/composable/useFetch'
import { useBrowserStorage } from '@/composable/useBrowserStorage'

const props = defineProps<{
  activities: { id?: number; title?: string; msg?: string; link?: string }
}>()
const img = 'https://picsum.photos/seed/picsum/400/300'

const router = useRouter()
const { verifyQRCode } = useFetchData()
const { setAcStorage } = useBrowserStorage()

const linkTo = async () => {
  const routerPath = props.activities.link
  if (routerPath) {
    const verifyRes = await verifyQRCode().catch(error => { })
    if (verifyRes) {
      const activitiesID = String(props.activities.id) || ''
      setAcStorage(activitiesID)
      router.push({
        path: `${routerPath}`,
        query: {
          ac: activitiesID
        }
      })
    }
  } else {
    // 檢核失敗或沒有link
    router.push({ path: '/error' })
  }
}
</script>

<template>
  <div class="activities" @click="linkTo">
    <div class="activities_img">
      <img :src="img" :alt="props.activities.title || ''">
    </div>
    <h2>{{ props.activities.title || '' }}</h2>
    <h3>
      {{ props.activities.msg || '' }}
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.activities {
  position: relative;
  display: block;
  padding: 0.5rem;
  border-radius: .25rem;

  &:hover {
    .activities_img {
      filter: brightness(1);

    }
  }

  &_img {
    filter: brightness(0.8);
    width: 100%;
    height: 10rem;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  h2 {
    position: absolute;
    font-weight: 500;
    font-size: 1.5rem;
    color: #fff;
    top: 0.25rem;
    left: 0.75rem;
    font-weight: bold;
  }

  h3 {
    font-size: 1rem;
  }
}
</style>
