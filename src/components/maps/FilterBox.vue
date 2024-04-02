<script setup lang="ts">
import { useConvenienceStore } from '@/stores/convenience'
// import { useMapbox } from '@/composable/useMapbox'
// const { updateCityLayer } = useMapbox()

const props = defineProps(['toggle'])
const convenienceStore = useConvenienceStore()
const handleOptionChange = (inputEvent: Event) => {
    const inputTarget = inputEvent.target as HTMLInputElement
    convenienceStore.updateChecked(inputTarget.value)
    // await updateCityLayer()
}

</script>

<template>
    <div class="radioWrapper" :class="{ active: props.toggle }">
        <div v-for="item in convenienceStore.storeFilterOptions" :key="item.value" class="radioBox">
            <input type="radio" class="inputRadio" :id="`${item.value}Store`" :value="item.value"
                :disabled="item.disabled" :checked="item.checked" @change="handleOptionChange" />
            <label :for="`${item.value}Store`" class="inputLabel">{{ item.nameTw }}</label>
        </div>
    </div>
</template>

<style lang="scss">
.radioWrapper {
    position: absolute;
    background: #fff;
    color: #555;
    padding: .75rem;
    box-sizing: border-box;

    bottom: 8.5rem;
    right: -10rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;

    will-change: right;
    transition-property: right;
    transition-duration: 600ms;

    &.active {
        right: 0.5rem;
    }

    .radioBox {
        .inputLabel {
            margin: 0 .5rem;
        }

        .inputRadio:disabled+.inputLabel {
            opacity: 0.3;
            cursor: not-allowed;
        }
    }
}
</style>