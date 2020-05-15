import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './styles/element-ui.scss'
import router from './router'
import store from './store'
import $ from 'jquery'
import echarts from 'echarts'

Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
