<template>
  <!--详情页面，需要接收父页面传递的参数-->
  <div class="container">
    <div class="head">
      <span>{{photoInfo.photoName}}</span>
    </div>
    <div class="shuoming">
      <h1>服务说明</h1>
      <span>{{photoInfo.minPrice}}元/套起</span>
      <h6>{{photoInfo.serviceInfo}}</h6>
    </div>
    <div class="zhanshi">
      <span>展示</span>
      <div v-for="(item,index) in showLists" :key="index">
        <div class="imgs">
          <img :src="interfaces + item.imgUrl" alt="">
        </div>
      </div>
    </div>
    <div class="jianjie">
      <span>产品简介</span>
      <!--这里是文本域内容-->
      <div class="productInfo">
        {{photoInfo.productInfo}}
      </div>
    </div>
    <div class="xiangqing">
      <span>服务详情</span>
      <div class="infos">
        <span>造型</span>
        <div class="info">
          {{photoInfo.modelling}}
        </div>
        <span>拍摄</span>
        <div class="info">
          {{photoInfo.shoot}}
        </div>
        <span>后期</span>
        <div class="info">
          {{photoInfo.anaphase}}
        </div>
        <span>出图</span>
        <div class="info">
          {{photoInfo.plot}}
        </div>
        <span>数据管理与售后</span>
        <div class="info">
          {{photoInfo.afterSale}}
        </div>
        <span>说明</span>
        <div class="info">
          {{photoInfo.explain}}
        </div>
      </div>
    </div>
    <div class="btu" @click="getForward()">
        <button>立即预约</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // pId 获取的参数 默认为0 表示未获取
      pId: 0,
      // 套餐基础信息
      photoInfo: '',
      // 展示图集合
      showLists: '',
      // 图片地址
      interfaces: 'http://192.168.1.4:8081'
      // interfaces: 'http://localhost:8081'
    }
  },
  methods: {
    // 获取详细信息
    getPhotoInfo () {
      this.$https.request({
        url: this.$interfaces.messageApi + '/getPhotoAllInfo',
        method: 'GET',
        data: {
          'pId': this.pId
        }
      }).then(res => {
        console.log(res)
        this.photoInfo = res.data.photoInfo
        this.showLists = res.data.showList
      }).catch(e => {
        console.log(e)
      })
    },
    // 点击进入预约
    getForward () {
      wx.navigateTo({
        url: '../forward/main',
        // 事件监听器，监听跳转页面传递到当前页面的数据
        events: {
          // 相当于on
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          }
        },
        success: (result) => {
          // 通过emit向页面传递photoInfo
          result.eventChannel.emit('acceptDataFromOpenerPage', { data: this.photoInfo })
          // 监听跳转页面传回来的值 与event中一致
          // result.eventChannel.on('acceptDataFromOpenedPage', function (data) {
          //   console.log(data)
          // })
        },
        fail: () => {},
        complete: () => {}
      })
    }
  },
  mounted: function () {
    this.pId = this.$mp.query.pId
    console.log('获取的pId' + this.pId)
    // 初始化套餐详细信息
    this.getPhotoInfo()
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 100%;
}
.container .head {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #fff;
  font-size: 16px;
}
.container .shuoming {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 70px;
  margin-top: 10px;
  background: #fff;
}
.container .shuoming h1 {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  height: 20px;
}
.container .shuoming span {
  float: right;
  margin-right: 20px;
  margin-top: 10px;
  color: #D4AF37;
  font-size: 15px;
  width: 50%;
  height: 20px;
  text-align: right;
}
.container .shuoming h6 {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  font-size: 15px;
}
.container .zhanshi {
  margin: 0 auto;
  float: left;
  width: 100%;
  margin-top: 10px;
  background: #fff;
}
.container .zhanshi span {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 20px;
}
.container .zhanshi .imgs {
  margin: 0 auto;
  float: left;
  width: 94%;
  height: 230px;
  margin-left: 3%;
  margin-top: 8px;
  margin-bottom: 5px;
}
.container .zhanshi .imgs img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
.container .jianjie {
  margin: 0 auto;
  float: left;
  width: 100%;
  margin-top: 10px;
  background: #fff;
}
.container .jianjie span {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 20px;
}
.container .jianjie .productInfo {
  margin: 0 auto;
  float: left;
  margin-left: 28px;
  margin-right: 28px;
  height: 100px;
  font-size: 15px;
}
.container .xiangqing {
  margin: 0 auto;
  float: left;
  width: 100%;
  min-height: 300px;
  margin-top: 10px;
  background: #fff;
  margin-bottom: 60px;
}
.container .xiangqing span {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 20px;
}
.container .xiangqing .infos {
  margin: 0 auto;
  float: left;
  margin-left: 23px;
  margin-right: 23px;
  font-size: 15px;
}
.container .xiangqing .infos span {
  margin: 0 auto;
  float: left;
  font-size: 15px;
  font-weight: bold
}
.container .xiangqing .infos .info {
  margin: 5px;
  float: left;
  font-size: 15px;
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
</style>