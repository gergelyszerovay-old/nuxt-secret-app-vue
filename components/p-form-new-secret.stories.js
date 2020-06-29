import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueMoment from 'vue-moment'
import pFromNewSecret from './p-form-new-secret.vue'
import 'ant-design-vue/dist/antd.css'

export default { title: 'p-form-new-secret' }

Vue.use(Antd)
Vue.use(VueMoment)

Vue.component('p-form-new-secret', pFromNewSecret)

export const formWithDefaultData = () => ({
  components: { pFromNewSecret },
  template: '<p-form-new-secret />'
})

export const formWithInvalidInitialData = () => ({
  components: { pFromNewSecret },
  data () {
    return {
      expireAfter: -1,
      expireAfterViews: 0
    }
  },
  template: `<p-form-new-secret
    secret=""
    :expireAfterViews="expireAfterViews"
    :expireAfter="expireAfter"
    validateOnInit
  />`
})
