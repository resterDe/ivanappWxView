<template>
  <!--个人订单信息-->
  <div class="container">
    <div v-for="(item,index) in orderList" :key="index">
    <div class="lists">
      <!--订单信息-->
      <span class="spans">
        <!--0表示未拍摄 所以可以取消订单-->
        <span class="cancel" v-if="item.photoState === 0" @click="cancelOrder(item.oid)">取消订单</span>
        <!--1表示已拍摄 不可以取消订单-->
        <span class="cancel" v-if="item.photoState === 1">已拍摄</span>
        <!--2表示已经取消的订单 不接受拍摄-->
        <span class="cancel" v-if="item.photoState === 2">已取消</span>
        <!--已拍摄 未评价 才能评价-->
        <span class="pingjia" v-if="item.photoState === 1 && (item.evaluate === null || item.evaluate === '')" @click="userEvaluate(item.oid)">评价</span>
        <!--已拍摄 已评价 不能评价-->
        <span class="pingjia" v-if="item.photoState === 1 && (item.evaluate !== null && item.evaluate !== '')">已评价</span>
      </span>
      <div class="info">
        <!--详细-->
        <span>照相：{{item.speName}}</span>
        <span>时间：{{item.makeDate}}</span>
        <span>联系：{{item.makePhone}}</span>
      </div>
      <span class="spans">合计：{{item.payPrice}}元</span>
    </div>
    </div>
    <!--自定义一个弹出框 不需要的时候隐藏 v-show 需要的时候就绝对定位在一个位置-->
    <div class="modal" v-show="modal">
      <div class="title">填写评价</div>
      <div class="inputText">
        <input type="text" placeholder="评价内容" v-model="evaluate">
      </div>
      <div class="btus">
        <div id="qx" class="button" @click="cancle">取消</div>
        <div id="qr" class="button" @click="affirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 订单列表
      orderList: [],
      // 评价内容
      evaluate: '',
      modal: false,
      // 订单id
      oId: ''
    }
  },
  methods: {
    // 获取订单信息
    getOrderList () {
      this.$https.request({
        url: this.$interfaces.messageApi + '/getOrderList',
        method: 'GET',
        data: {
          openId: this.$store.state.userInfo.openId
        }
      }).then(res => {
        console.log(res)
        this.orderList = res.data
      }).catch(e => {
        console.log(e)
      })
    },
    // 取消订单
    cancelOrder (oId) {
      console.log('取消订单：' + oId)
      this.$https.request({
        url: this.$interfaces.messageApi + '/cancelOrder',
        method: 'GET',
        data: {
          'oId': oId
        }
      }).then(res => {
        console.log(res)
        if (res.status === 0) {
          console.log('成功取消')
          // 成功取消刷新界面
          this.getOrderList()
        } else if (res.status === 1) {
          console.log('取消失败')
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3500,
            mask: false
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 点击评价 弹出窗口
    userEvaluate (oId) {
      console.log('评价订单：' + oId)
      this.oId = oId
      // 弹出窗口
      this.modal = true
    },
    // 评价订单取消确认
    // 点击确认
    affirm () {
      console.log('点击了确认')
      // 点击确认后获取相应的值 判断值不能为空
      if (this.evaluate === '') {
        wx.showModal({
          title: '提示',
          content: '请对小主评价再提交喔',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F'
        })
        return
      }
      // 执行请求
      this.$https.request({
        url: this.$interfaces.messageApi + '/userEvaluate',
        method: 'GET',
        data: {
          'oId': this.oId,
          'evaluate': this.evaluate
        }
      }).then(res => {
        if (res.status === 0) {
          console.log('评价成功')
          // 提交成功执行刷新
          this.evaluate = ''
          this.getOrderList()
        } else if (res.status === 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500,
            mask: false
          })
        }
      })
      // 执行后关闭窗口
      this.modal = false
    },
    // 点击取消
    cancle () {
      console.log('点击了取消')
      this.modal = false
      this.evaluate = ''
    }
  },
  mounted: function () {
    // 获取初始化信息
    console.log(this.$store.state.userInfo)
    // 获取订单
    this.getOrderList()
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
.container .lists {
  margin: 0 auto;
  float: left;
  width: 94%;
  margin-left: 3%;
  margin-top: 20px;
  height: 120px;
  border: 1px solid #d3d3d3;
  background: #fff;
  /* 阴影 */
  box-shadow: 0 0 5px #8b8989;
  font-size: 13px;
}
.container .lists .spans {
  margin: 0 auto;
  float: left;
  height: 20px;
  line-height: 20px;
  margin-left: 10px;
  color: #d3d3d3;
}
.container .lists .spans .cancel {
  color: red;
}
.container .lists .spans .pingjia {
  color: aqua;
  margin-left: 10px;
}
.container .lists .info {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 78px;
  border-top:1px solid #d3d3d3;
  border-bottom: 1px solid #d3d3d3;
}
.container .lists .info span {
  margin: 0 auto;
  float: left;
  height: 20px;
  width: 100%;
  margin-top: 5px;
  margin-left: 10px;
  color: #d3d3d3;
}
/* 弹出框样式 */
.container .modal{
  position: absolute;
  width: 70%;
  height: 250px;
  margin-left: 15%;
  margin-top: 30%;
  background: white;
  /* 阴影 */
  box-shadow: 0 0 3px #3f3f3f;
  opacity: 0.8;
  z-index: 1;
}
.container .modal .title{
  margin: 0 auto;
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 18px;
  background:linear-gradient(to bottom, #7fdff0,#17c6cc);
  color: white;
}
.container .modal .inputText{
  margin: 0 auto;
  float: left;
  margin-top: 20%;
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.container .modal .inputText input{
  margin: 0 auto;
  float: left;
  width: 80%;
  height: 50px;
  margin-left: 10%;
  color: #000;
  font-size: 16px;
  border-bottom: 1px solid #c7c3c3;
}
.container .modal .btus{
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 60px;
  margin-top: 49px;
  border-radius: 0px;
  border: 0;
}
.container .modal .btus .button{
margin: 0 auto;
  float: left;
  width: 50%;
  height: 51px;
  border-radius: 0px;
  border: 0;
  color: white;
  font-size: 18px;
  text-align: center;
  line-height: 51px;
}
.container .modal .btus .button:active{
  opacity: 0.7;
}
.container .modal .btus #qx{
  background:linear-gradient(to bottom, #f3a88a,#da2525);
}
.container .modal .btus #qr{
  background:linear-gradient(to bottom, #66bfcf,#149ea3);
}
</style>