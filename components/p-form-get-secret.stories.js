import Vue from 'vue'
import Antd from 'ant-design-vue'
import pFromGetSecret from './p-form-get-secret.vue'
import 'ant-design-vue/dist/antd.css'

export default { title: 'p-form-get-secret' }

Vue.use(Antd)

Vue.component('p-form-get-secret', pFromGetSecret)

export const formWithoutData = () => ({
  components: { pFromGetSecret },
  template: '<p-form-get-secret />'
})

export const formWithValidInitialData = () => ({
  components: { pFromGetSecret },
  template: '<p-form-get-secret hash="50ad41624c25e493aa1dc7f4ab32bdc5a3b0b78ecc35b539936e3fea7c565af7" validateOnInit />'
})

export const formWithInvalidInitialData = () => ({
  components: { pFromGetSecret },
  template: '<p-form-get-secret hash="123" validateOnInit />'
})
