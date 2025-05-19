import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/common.less'
import './assets/icons' // icon

import * as echarts from 'echarts'
import china from 'echarts/map/json/china.json' //导入china包
echarts.registerMap('china', china) 
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
