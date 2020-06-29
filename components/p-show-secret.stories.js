import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueMoment from 'vue-moment'
import pShowSecret from './p-show-secret.vue'
import 'ant-design-vue/dist/antd.css'

export default { title: 'p-show-secret' }

Vue.use(Antd)
Vue.use(VueMoment)

Vue.component('p-show-secret', pShowSecret)

export const secretWithExpiration = () => ({
  components: { pShowSecret },
  data () {
    return {
      hash: '50ad41624c25e493aa1dc7f4ab32bdc5a3b0b78ecc35b539936e3fea7c565af7',
      secretText: 'secret text',
      expiresAt: this.$moment().add(10, 'minutes'),
      remainingViews: 10,
      createdAt: this.$moment()
    }
  },
  template: `<p-show-secret
    title="Secret"
    :hash="hash"
    :secretText="secretText"
    :expiresAt="expiresAt"
    :remainingViews="remainingViews"
    :createdAt="createdAt"
  />`
})

export const secretWithNoExpiration = () => ({
  components: { pShowSecret },
  data () {
    return {
      hash: '50ad41624c25e493aa1dc7f4ab32bdc5a3b0b78ecc35b539936e3fea7c565af7',
      secretText: 'secret text',
      expiresAt: this.$moment.unix(0),
      remainingViews: 10,
      createdAt: this.$moment()
    }
  },
  template: `<p-show-secret
    title="Secret"
    :hash="hash"
    :secretText="secretText"
    :expiresAt="expiresAt"
    :remainingViews="remainingViews"
    :createdAt="createdAt"
  />`
})
