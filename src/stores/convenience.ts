import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConvenienceStore = defineStore('convenience', () => {
  const storeFilterKeys = ref(['all', 'feature', 'open'])
  const storeFilterOptions = ref([{
    value: 'all',
    nameTw: '所有門市',
    // disabled: false,
    checked: false,
    // storeData: null as any,
  }, {
    value: 'feature',
    nameTw: '特色門市',
    // disabled: false,
    checked: false,
    // storeData: null as any,
  }, {
    value: 'open',
    nameTw: '聯名門市',
    // disabled: false,
    checked: false,
    // storeData: null as any,
  }])

  const updateChecked = (radioSelectType) => {
    storeFilterKeys.value.forEach((layerItem, layerIndex) => {
      storeFilterOptions.value[layerIndex]['checked'] = (radioSelectType == layerItem)
    })
  }
  return { 
    storeFilterKeys, 
    storeFilterOptions,
    updateChecked,
  }
})
