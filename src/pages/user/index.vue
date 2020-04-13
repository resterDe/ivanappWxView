<template>
  <!--用户 我的-->
  <div class="container">
    <div v-if="isLogin">
    <!--个人用户信息-->
    <div class="head">
      <div class="touxiang">
        <open-data type="userAvatarUrl"></open-data>
      </div>
      <div class="info">
        <open-data type="userNickName"></open-data><br/>
        性别：<span style="color: #d3d3d3">{{userInfo.sex}}</span>
      </div>
    </div>
    <div class="list" @click="getList()">
      <img src="/static/images/dingdan.png" alt="">
      <span>预约订单</span>
    </div>
    <div class="list" @click="getXuzhi()">
      <img src="/static/images/xuzhi.png" alt="">
      <span>预约须知</span>
    </div>
    <div class="list" @click="getXieyi()">
      <img src="/static/images/xieyi.png" alt="">
      <span>预约协议</span>
    </div>
    <div class="list" @click="getFankui()">
      <img src="/static/images/yijian.png" alt="">
      <span>意见反馈</span>
    </div>
    <div class="btu" @click="logout()">
        <button>安全登出</button>
    </div>
    </div>
    <!--未登录-->
    <div v-if="!isLogin">
      <div class="banner">
        <img src="/static/images/logo.png" alt="">
        <span>小凡摄影</span>
      </div>
      <div class="loginBtu">
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 用户基本信息
      userInfo: '',
      isLogin: false
    }
  },
  methods: {
    // 进入订单
    getList () {
      wx.navigateTo({
        url: '../order/main',
        success: (result) => {
        },
        fail: () => {},
        complete: () => {}
      })
    },
    // 进入须知
    getXuzhi () {
      wx.navigateTo({
        url: '../xuzhi/main',
        success: (result) => {
        },
        fail: () => {},
        complete: () => {}
      })
    },
    // 进入协议
    getXieyi () {
      wx.navigateTo({
        url: '../xieyi/main',
        success: (result) => {
        },
        fail: () => {},
        complete: () => {}
      })
    },
    // 进入反馈
    getFankui () {
      wx.navigateTo({
        url: '../fankui/main',
        success: (result) => {
        },
        fail: () => {},
        complete: () => {}
      })
    },
    // 获取用户信息
    getUserInfo (e) {
      // 保存授权后用户信息 并且更改状态
      if (e.mp.detail.userInfo) {
        // 用户授权后才可以使用，授权成功后将用户信息存入store-user中
        // 用户授权后,获取用户cod以及相应信息用于入库
        wx.login({
          timeout: 10000,
          success: (result) => {
            // 获取code成功
            this.$https.request({
              url: this.$interfaces.userApi + '/userLogin',
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                'code': result.code,
                'userName': e.mp.detail.userInfo.nickName,
                'sex': ((e.mp.detail.userInfo.gender === 1) && (e.mp.detail.userInfo.gender !== 0)) ? '男' : '女',
                'birthday': '-1'
              }
            }).then(res => {
              // 绑定成功 信息存入
              this.$store.dispatch('setIsLogin', true)
              this.$store.dispatch('setUserInfo', res.data.userInfo)
              this.isLogin = true
              this.userInfo = res.data.userInfo
            }).catch(e => {
              console.log(e)
            })
          },
          fail: () => {},
          complete: () => {}
        })
      } else {
        console.log('用户拒绝授权')
        wx.showModal({
          title: '提示',
          content: '需要授权才能正常使用哦',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#3CC51F'
        })
      }
    },
    // 退出登录
    logout () {
      // 退出登录清除当前登录态以及全局登录态就好
      this.isLogin = false
      this.$store.dispatch('setIsLogin', false)
    }
  },
  mounted: function () {
    // 获取全局登录态
    this.isLogin = this.$store.state.isLogin
    // 以及用户信息
    this.userInfo = this.$store.state.userInfo
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
.container .head {
  float: left;
  width: 100%;
  height: 70px;
  line-height: 20px;
  margin-top: 10px;
  background: #fff;
}
.container .head .touxiang {
  margin: 0 auto;
  float: left;
  width: 50px;
  height: 50px;
  margin-top: 10px;
  margin-left: 20px;
  background: #d3d3d3;
}
.container .head .info {
  margin: 0 auto;
  float: left;
  margin-left: 10px;
  width: 60px;
  height: 40px;
  margin-top: 15px;
  font-size: 13px;
}
.container .list {
  float: left;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  line-height: 50px;
  background: #fff;
  color: rgb(221, 30, 30);
}
.container .list:active {
  opacity: 0.7;
}
.container .list img {
  float: left;
  width: 20px;
  height: 20px;
  margin-top: 15px;
  margin-left: 10px;
}
.container .list span {
  float: left;
  height: 50px;
  line-height: 50px;
  margin-left: 10px;
  font-size: 13px;
}
.container .btu button{
  margin: 0 auto;
  float: left;
  margin-left: 10%;
  margin-top: 5%;
  width: 80%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: aliceblue;
  border-radius: 10px;
  background: rgb(221, 12, 12);
}
.container .btu button:active{
  opacity: 0.85;
}
/* 未登录 */
.container .banner{
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 40px;
  /* background:linear-gradient(to bottom, #ced3d2,#949999); */
  background: #fff;
}
.container .banner img {
  margin: 0 auto;
  float: left;
  width: 30px;
  height: 30px;
  margin-top: 5px;
  margin-left: 15px;
}
.container .banner span {
  text-align: center;
  line-height: 40px;
  font-size: 15px;
  margin-left: 5px;
  color: rgb(49, 45, 45);
}
.container .loginBtu button{
  margin: 0 auto;
  float: left;
  margin-left: 10%;
  margin-top: 5%;
  width: 80%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: aliceblue;
  border-radius: 10px;
  background: rgb(12, 190, 221);
}
.container .loginBtu button:active{
  opacity: 0.85;
}
</style>