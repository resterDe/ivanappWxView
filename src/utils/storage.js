// 封装缓存方法 设置缓存 获取缓存信息 清除缓存信息 移除缓存信息
const storage = {
  // 设置缓存
  setStorage (options = {}) {
    const { key, data } = options
    // 写一个加载动画
    wx.showLoading({
      title: '载入中...'
    })
    // 成功会调用resolve，失败会调用reject
    return new Promise((resolve, reject) => {
      // 设置缓存
      wx.setStorage({
        key,
        data,
        success: (result) => {
          wx.hideLoading()
          resolve(result)
        },
        fail: (e) => {
          wx.hideLoading()
          reject(e)
        }
      })
    })
  },
  // 获取缓存 指定key获取缓存
  getStroage (options = {}) {
    const { key } = options
    wx.showLoading({
      title: '加载中...'
    })
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: (result) => {
          wx.hideLoading()
          resolve(result.data)
        },
        fail: (e) => {
          wx.hideLoading()
          reject(e)
        }
      })
    })
  },
  // 根据key移除相应的缓存
  removeStorage (options = {}) {
    const { key } = options
    wx.showLoading({
      title: '移除中...'
    })
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: (result) => {
          wx.hideLoading()
          resolve(result)
        },
        fail: (e) => {
          wx.hideLoading()
          reject(e)
        }
      })
    })
  },
  // 删除所有缓存数据
  clearStorage () {
    wx.showLoading({
      title: '清除中...'
    })
    return new Promise((resolve, reject) => {
      wx.clearStorage({
        success: (res) => {
          wx.hideLoading()
          resolve(res)
        },
        fail: (e) => {
          wx.hideLoading()
          reject(e)
        }
      })
    })
  }
}

export default storage
