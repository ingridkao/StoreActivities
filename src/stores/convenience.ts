import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useConvenienceStore = defineStore('convenience', () => {
  const storeRadioSelectd = ref<String>('all')
  const storeFilterOptions = reactive([
    {
      value: 'all',
      nameTw: '所有門市',
      disabled: false,
      checked: false
      // storeData: null as any,
    },
    {
      value: 'feature',
      nameTw: '特色門市',
      disabled: false,
      checked: false
      // storeData: null as any,
    },
    {
      value: 'open',
      nameTw: '聯名門市',
      disabled: false,
      checked: false
      // storeData: null as any,
    }
  ])

  const updateChecked = (radioSelectType: string) => {
    storeRadioSelectd.value = radioSelectType
    storeFilterOptions.forEach((layerItem, layerIndex) => {
      storeFilterOptions[layerIndex]['checked'] = radioSelectType == layerItem.value
    })
  }
  return {
    storeRadioSelectd,
    storeFilterOptions,
    updateChecked
  }
})
