<template>
  <!--预约信息登记界面-->
  <div class="container">
    <div v-if="isLogin">
    <div class="info">
      <!--信息-->
      <div class="imgs">
        <img :src="interfaces + photoInfo.coverImg" alt="">
        <span>{{photoInfo.photoName}}</span>
      </div>
      <div class="mingxi">
        <!--明细-->
        <span>明细</span>
        <span>￥{{slePrice}}</span>
        <span class="text">---点击选择更多规格---</span>
        <div class="options">
          <!--选项-->
          <picker class="picker" @change="sleType" mode="selector" :value="sleIndex" :range="sleList" :range-key="'speName'">
          {{speName}}
          </picker>
        </div>
      </div>
    </div>
    <div class="tianxie">
      <!--填写-->
      <div class="date">
        <!--时间-->
        <span>预约日期：</span>
        <picker class="picker" @change="getDate" mode="date" :value="myDate" :start="dateStart" :end="dateEnd">
          {{myDate}}
        </picker>
      </div>
      <div class="time">
        <!--时间-->
        <span>预约时间：</span>
        <picker class="picker" @change="getTime" mode="time" :value="myTime" :start="timeStart" :end="timeEnd">
          {{myTime}}
        </picker>
      </div>
      <div class="name">
        <!--姓名-->
        <span>预约姓名：</span>
        <input type="text" v-model="name" id="name">
      </div>
      <div class="phone">
        <!--电话-->
        <span>预约电话：</span>
        <input type="text" v-model="phone" id="phone">
      </div>
      <div class="radios">
        <div :class="radios.zq ? 'choose' : 'notChoose'" @click="stuChoose">
          <span>自取</span>
        </div>
        <div :class="radios.yj ? 'choose' : 'notChoose'" @click="teaChoose">
          <span>邮寄</span>
        </div>
      </div>
      <div v-if="radios.yj">
      <div class="sendSite">
        <!--快递地址-->
        <span>邮寄地址：</span>
        <picker class="picker" mode="region" @change="getSendSite" :value="region">
          {{region[0]}}，{{region[1]}}，{{region[2]}}
        </picker>
      </div>
      <div class="more">
        <span>详细地址：</span>
        <input type="text" v-model="more" id="more">
      </div>
      </div>
    </div>
    <div class="btu">
      <button @click="zhifu()">支付</button>
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
      radios: {
        // 默认选择自取
        state: 0,
        zq: true,
        yj: false
      },
      // 地区
      region: ['广东省', '广州市', '天河区'],
      more: '',
      // 选择规格
      sleIndex: 0,
      sleList: '',
      slePrice: '',
      speName: '套餐规格',
      // 日期 开始的应该获取当前日期跟时间
      myDate: '',
      dateStart: '1999-01-01',
      dateEnd: '2999-12-12',
      // 时间
      myTime: '09:00',
      timeStart: '09:00',
      timeEnd: '21:00',
      // 预约姓名
      name: '',
      // 预约电话
      phone: '',
      // 获取的套餐信息
      photoInfo: '',
      // 根据是否登录 ，渲染显示 , 默认未登录
      isLogin: false,
      // 图片地址
      interfaces: 'http://192.168.1.4:8081'
      // interfaces: 'http://localhost:8081'
    }
  },
  methods: {
    // 获取规格信息
    getSpe () {
      console.log('获取套餐规格以及价格')
      console.log(this.photoInfo)
      this.$https.request({
        url: this.$interfaces.messageApi + '/getSpeInfo',
        method: 'GET',
        data: {
          'pId': this.photoInfo.pid
        }
      }).then(res => {
        console.log(res)
        this.sleList = res.data
        this.slePrice = this.sleList[0].price
        this.speName = this.sleList[0].speName
      }).catch(e => {
        console.log(e)
      })
    },
    // 选择规格
    sleType (e) {
      console.log(e.mp.detail.value)
      this.sleIndex = e.mp.detail.value
      this.slePrice = this.sleList[this.sleIndex].price
      this.speName = this.sleList[this.sleIndex].speName
    },
    // 选择日期
    getDate (e) {
      this.myDate = e.mp.detail.value
    },
    // 选择时间
    getTime (e) {
      this.myTime = e.mp.detail.value
    },
    // 点击选择自取
    stuChoose () {
      this.radios.state = 0
      this.radios.zq = true
      this.radios.yj = false
    },
    // 选择邮寄
    teaChoose () {
      this.radios.state = 1
      this.radios.zq = false
      this.radios.yj = true
    },
    // 获取邮寄地址
    getSendSite (e) {
      console.log(e.mp.detail.value)
      this.region = e.mp.detail.value
    },
    // 支付
    zhifu () {
      console.log('点击支付')
      // 支付前判断是否已经输入信息
      if (this.name === '' || this.phone === '') {
        console.log('没有填写信息')
        wx.showModal({
          title: '提示',
          content: '请先填写预约信息再支付喔',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
            }
          },
          fail: () => {},
          complete: () => {}
        })
        return
      }
      // 已经输入信息 提交信息预约
      this.submitInfo()
    },
    // 提交信息预约
    submitInfo () {
      this.$https.request({
        url: this.$interfaces.messageApi + '/addOrder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'pId': parseInt(this.photoInfo.pid),
          'openId': this.$store.state.userInfo.openId,
          'speName': this.speName,
          'makeDate': this.myDate + '/' + this.myTime,
          'postState': parseInt(this.radios.zq ? 0 : 1),
          'makeName': this.name,
          'makePhoto': this.phone,
          'makeSex': this.$store.state.userInfo.sex,
          'payPrice': parseFloat(this.slePrice),
          'sendSite': this.region[0] + this.region[1] + this.region[2] + this.more
        }
      }).then(res => {
        if (res.status === 0) {
          console.log('支付成功')
          wx.showToast({
            title: '',
            icon: 'none',
            duration: 3500,
            mask: false,
            success: (result) => {
              this.name = ''
              this.phone = ''
              this.radios.zq = true
              this.radios.yj = false
            }
          })
        } else if (res.status === 1) {
          console.log('支付失败')
          wx.showToast({
            title: '支付失败，请稍后再试',
            icon: 'none',
            duration: 3500,
            mask: false,
            success: (result) => {
              this.name = ''
              this.phone = ''
              this.radios.zq = true
              this.radios.yj = false
            }
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 判断是否绑定登录
    userLogin () {
      // 点击登录
      console.log('点击登录')
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
    }
  },
  mounted: function () {
    // 获取全局登录态
    this.isLogin = this.$store.state.isLogin
    // 初始化时间
    var myDates = new Date()
    // 格式化日期
    this.myDate = myDates.getFullYear() + '-' +
    ((myDates.getMonth() + 1) < 10 ? '0' + (myDates.getMonth() + 1) : (myDates.getMonth() + 1)) + '-' +
    (myDates.getDate() < 10 ? '0' + myDates.getDate() : myDates.getDate())
    // 格式化时间
    this.myTime = (myDates.getHours() < 10 ? '0' + myDates.getHours() : myDates.getHours()) + ':' +
    (myDates.getMinutes() < 10 ? '0' + myDates.getMinutes() : myDates.getMinutes())
    var infos = {}
    // mpvue里面要用.$mp.page获取事件对象
    const eventChannel = this.$mp.page.getOpenerEventChannel()
    // 通过emit向父页面传递数据
    eventChannel.emit('acceptDataFromOpenedPage', {data: '这里是预约登记界面'})
    // 监听获取的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      infos = data.data
    })
    // 获取信息后 执行获取对应套餐规格信息
    this.photoInfo = infos
    this.getSpe()
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
.container .info {
  margin: 0 auto;
  width: 100%;
  height: 230px;
  float: left;
  background: #fff;
  margin-top: 10px;
}
.container .info .imgs {
  margin: 0 auto;
  width: 35%;
  height: 230px;
  float: left;
  margin-left: 15px;
}
.container .info .imgs img {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 200px;
}
.container .info .imgs span {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #d3d3d3;
  font-size: 12px;
}
.container .info .mingxi {
  margin: 0 auto;
  float: left;
  width: 55%;
  height: 230px;
  margin-left: 10px;
}
.container .info .mingxi span {
  margin: 0 auto;
  float: left;
  margin-top: 10px;
  width: 100%;
  height: 20px;
  text-align: left;
  font-size: 15px;
  line-height: 20px;
}
.container .info .mingxi .text {
  color: #d3d3d3;
  font-size: 13px;
  text-align: center;
}
.container .info .mingxi .options {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 190px;
  margin-top: 10px;
}
.container .info .mingxi .options .picker {
  margin: 0 auto;
  float: left;
  width: 94%;
  height: 25px;
  margin-left: 3%;
  margin-top: 6px;
  text-align: center;
  line-height: 25px;
  border: 1px solid red;
  color: red;
}
.container .tianxie {
  margin: 0 auto;
  width: 100%;
  float: left;
  background: #fff;
  margin-top: 10px;
  margin-bottom: 60px;
}
.container .tianxie .date {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  margin-top: 10px;
}
.container .tianxie .date span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .date .picker {
  margin: 0 auto;
  float: left;
  width: 70%;
  height: 45px;
  line-height: 45px;
}
.container .tianxie .time {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  border-top: 2px solid #f7f7f7;
}
.container .tianxie .time span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .time .picker {
  margin: 0 auto;
  float: left;
  width: 70%;
  height: 45px;
  line-height: 45px;
}
/* 地址 */
.container .tianxie .sendSite {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  border-top: 2px solid #f7f7f7;
}
.container .tianxie .sendSite span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .sendSite .picker {
  margin: 0 auto;
  float: left;
  width: 70%;
  height: 45px;
  line-height: 45px;
}
.container .tianxie .more {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  border-top:2px solid #f7f7f7;
  border-bottom:2px solid #f7f7f7;
}
.container .tianxie .more span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .more input {
  margin: 0 auto;
  float: left;
  width: 60%;
  height: 45px;
  color: #000;
  text-indent: 10px;
  font-size: 16px;
}
.container .tianxie .name {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  border-top:2px solid #f7f7f7;
}
.container .tianxie .name span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .name input {
  margin: 0 auto;
  float: left;
  width: 60%;
  height: 45px;
  color: #000;
  text-indent: 10px;
  font-size: 16px;
}
.container .tianxie .phone {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 45px;
  border-top:2px solid #f7f7f7;
  border-bottom:2px solid #f7f7f7;
}
.container .tianxie .phone span {
  margin: 0 auto;
  float: left;
  width: 30%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  color: #d3d3d3;
}
.container .tianxie .phone input {
  margin: 0 auto;
  float: left;
  width: 60%;
  height: 45px;
  color: #000;
  text-indent: 10px;
  font-size: 16px;
}
.container .tianxie .radios{
  margin: 0 auto;
  float: left;
  margin-left: 10%;
  width: 130px;
  height: 40px;
}
.container .tianxie .radios .choose{
  margin: 0 auto;
  float: left;
  width: 60px;
  height: 40px;
  margin-left: 5px;
  background-color: #15c6cc;
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
  color: aliceblue;
}
.container .tianxie .radios .notChoose{
  margin: 0 auto;
  float: left;
  width: 60px;
  height: 40px;
  margin-left: 5px;
  background-color: #d3d3d3;
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
}
.container .btu button{
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  color: aliceblue;
  border-radius: 0;
  border: 0;
  background: rgb(47, 214, 214);
  position: fixed;
  bottom: 0;
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