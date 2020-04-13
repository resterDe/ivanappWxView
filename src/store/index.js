import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

// 使用vuex
Vue.use(Vuex)

const state = {
  // 用户登录状态 默认未登录 false
  isLogin: false,
  // 保存登录用户信息
  userInfo: ''
}

// 一个vuex的创建 相当于一个状态仓库
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
