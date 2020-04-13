// 封装请求
const https = {
  // 封装一个方法
  request (options = {}) {
    // 参数来源于wx.request
    // eslint-disable-next-line no-unused-vars
    const { url, data, header, method } = options
    // 写一个的加载动画 这个方法可以封装起来，也可以不用 主要为了记录 加载动画需要配合wx.hideLoading();使用
    wx.showLoading({
      title: '加载中...'
    })

    // new Promise是es6的语法，成功会调用resolve ，失败会调用reject
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        header,
        method,
        success: function (res) {
          wx.hideLoading()
          // 判断网络等问题
          // eslint-disable-next-line eqeqeq
          if (res.statusCode == 404) {
            // 失败调用reject
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
            return false
          // eslint-disable-next-line eqeqeq
          } else if (res.statusCode != 200) {
            // 交互提示
            wx.showToast({
              title: '网络出错，请稍后再试',
              icon: 'none'
            })
            return false
          }
          // 成功的话直接执行resolve 返回数据
          resolve(res.data)
        },
        fail: function (e) {
          // 调用失败
          wx.hideLoading()
          reject(e)
        },
        // 无论请求是否成功 都会调用
        complete: function () {}
      })
    })
  }
}
// 将其暴露出去，才可以使用
export default https
