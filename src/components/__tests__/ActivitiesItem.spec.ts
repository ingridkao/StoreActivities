import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ActivitiesOnGoingItem from '../activity/ActivitiesOnGoingItem.vue'

describe('ActivitiesItem', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivitiesOnGoingItem, {
      props: {
        activities: {}
      }
    })
    // expect(wrapper.text()).toContain('活動名稱')
    // expect(wrapper.text()).toContain('活動介紹')
  })
})
