import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ActivitiesItem from '../ActivitiesItem.vue'

describe('ActivitiesItem', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivitiesItem, {
      props: { title: '活動名稱', img: '', msg: '活動介紹', link: '' }
    })
    expect(wrapper.text()).toContain('活動名稱')
    expect(wrapper.text()).toContain('活動介紹')
  })
})
