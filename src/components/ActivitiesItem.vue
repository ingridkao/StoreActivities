<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  title: String,
  img: String,
  msg: String,
  link: String
}>()

</script>

<template>
  <RouterLink :to="props.link" class="activities">
    <div class="activities_img">
      <img :src="props.img" :alt="props.title">
    </div>
    <h2>{{ props.title }}</h2>
    <h3>
      {{ props.msg }}
    </h3>
  </RouterLink>
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
