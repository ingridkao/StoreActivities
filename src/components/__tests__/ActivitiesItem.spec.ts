import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ActivitiesListItem from '../activity/ActivitiesListItem.vue'

describe('ActivitiesItem', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivitiesListItem, {
      props: {
        activities: {}
      }
    })
    // expect(wrapper.text()).toContain('活動名稱')
    // expect(wrapper.text()).toContain('活動介紹')
  })
})
