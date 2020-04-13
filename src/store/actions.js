// 操作mutations

// 设置判断用户是否登录
export const setIsLogin = ({ commit }, data) => {
  commit('setIsLogin', data)
}
export const setUserInfo = ({ commit }, data) => {
  commit('setUserInfo', data)
}
