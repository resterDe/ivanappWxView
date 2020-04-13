/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// 保存接口信息

// 服务注册中心本地接口 管理员
// eslint-disable-next-line no-unused-vars
// const domain = 'http://127.0.0.1:8081/'
const domain = 'http://192.168.1.4:8081/'

// 封装数据接口 便于管理
const interfaces = {
  // 写demo 获取student信息
  userApi: domain + 'user-api',
  messageApi: domain + 'message-api'
}

// 设置这个，引入时才能使用
export default interfaces
