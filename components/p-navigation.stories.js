import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueMoment from 'vue-moment'
import pNavigation from './p-navigation.vue'
import 'ant-design-vue/dist/antd.css'

export default { title: 'p-navigation' }

Vue.use(Antd)
Vue.use(VueMoment)

Vue.component('p-navigation', pNavigation)

export const newSelected = () => ({
  components: { pNavigation },
  data () {
    return {
      selected: ['new']
    }
  },
  template: `<p-navigation
    :selected="selected"
  />`
})

export const viewSelected = () => ({
  components: { pNavigation },
  data () {
    return {
      selected: ['view']
    }
  },
  template: `<p-navigation
    :selected="selected"
  />`
})
