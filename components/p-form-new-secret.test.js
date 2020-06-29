import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueMoment from 'vue-moment'
import moment from 'moment'
import pFromNewSecret from '../components/p-form-new-secret.vue'
// import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
Vue.use(VueMoment)

describe('pFromNewSecret', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(pFromNewSecret)
    expect(wrapper.vm).toBeTruthy()
  })

  const propsWithErrors = {
    propsData: {
      secret: '',
      expireAfter: moment(),
      expireAfterViews: 0
    }
  }

  test('when the secret field is empty and we submit a form, an error shown', async () => {
    const wrapper = mount(pFromNewSecret, propsWithErrors)

    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-qa="a-form-model-item.secret"]').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.secret"] .has-error').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.secret"] .ant-form-explain').text()).toBe('Please enter a secret')
  })

  test('when the expiration date is not in th future, and we submit a form, an error shown', async () => {
    const wrapper = mount(pFromNewSecret, propsWithErrors)

    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-qa="a-form-model-item.expireAfter"]').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.expireAfter"] .has-error').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.expireAfter"] .ant-form-explain').text()).toBe('You should choose an expiration date in the future')
  })

  test('when the allowed views field is 0 and we submit a form, an error shown', async () => {
    const wrapper = mount(pFromNewSecret, propsWithErrors)

    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-qa="a-form-model-item.expireAfterViews"]').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.expireAfterViews"] .has-error').exists()).toBe(true)
    expect(wrapper.find('[data-qa="a-form-model-item.expireAfterViews"] .ant-form-explain').text()).toBe('You should allow at least on view')
  })
})
