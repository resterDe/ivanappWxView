import Vue from 'vue'
import App from './App'

// 引入vuex
import store from './store/index'
// 引入封装的接口
import interfaces from './utils/interfaces'
// 引入封装的https请求文件
import https from './utils/https'
// 引入封装的缓存数据
import storage from './utils/storage'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.$store = store
Vue.prototype.$interfaces = interfaces
Vue.prototype.$https = https
Vue.prototype.$storage = storage

export default {}
