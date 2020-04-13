<template>
 <!--主页 轮播图 按类型一次向下展示套餐-->
 <div class="container">
    <div class="banner">
      <img src="/static/images/logo.png" alt="">
      <span>小凡摄影</span>
    </div>
    <div class="lunbo">
     <swiper class="swiper"
      :indicator-dots = "indicatorDots"
      :autoplay = "autoplay"
      :circular = "circular"
      >
        <block v-for="(item,index) in imgUrls" :key="index">
          <swiper-item>
            <img :src="item" alt="" mode="widthFix">
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="type">
      <span class="spanType">小凡专属</span>
      <!--展示区域-->
      <div v-for="(item,index) in photoList" :key="index">
        <div v-if="item.photoSize === 0">
          <div class="zhenjian shu" @click="getInfo(item.pid)">
          <!--证件照-->
            <img :src="interfaces + item.coverImg" alt="">
            <span>{{item.photoType}}</span>
          </div>
        </div>
        <div v-else-if="item.photoSize === 1">
          <div class="jiehun heng" @click="getInfo(item.pid)">
          <!--结婚照-->
            <img :src="interfaces + item.coverImg" alt="">
            <span>{{item.photoType}}</span>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 轮播图元素
      imgUrls: ['/static/lunbo/1.jpg', '/static/lunbo/2.jpg', '/static/lunbo/3.jpg'],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      // 套餐信息
      photoList: '',
      // 图片地址
      interfaces: 'http://192.168.1.4:8081'
      // interfaces: 'http://localhost:8081'
    }
  },
  methods: {
    // 获取套餐信息
    getPhoto () {
      this.$https.request({
        url: this.$interfaces.messageApi + '/getPhotoLists',
        method: 'GET'
      }).then(result => {
        if (result.status === 0) {
          console.log('成功获取数据')
          this.photoList = result.data
        } else {
          console.log(result.msg)
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 3500,
            mask: false,
            success: (result) => {
            },
            fail: () => {}
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 获取详细信息
    getInfo (pId) {
      wx.navigateTo({
        url: '../info/main?pId=' + pId,
        success: (result) => {
        },
        fail: () => {},
        complete: () => {}
      })
    }
  },
  // 钩子函数
  mounted: function () {
    // 获取套餐全部信息
    this.getPhoto()
  }
}
</script>

<style scoped>
.container{
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
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
.container .lunbo{
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 180px;
}
.container .lunbo .swiper{
  width: 100%;
  height: 100%;
  /* 溢出元素框隐藏 */
  overflow: hidden;
}
.container .lunbo .swiper img{
  /**排除图片显示出现间隔问题 */
  width: 100%;
}
.container .type {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: auto;
  min-height:300px;
  
}
.container .type .spanType{
  margin: 0 auto;
  float: left;
  width: 100%;
  margin-top: 10px;
  color: #ada7a7;
  font-size: 16px;
  margin-left: 5%;
}
.container .type .shu{
  margin: 0 auto;
  float: left;
  width: 41%;
  height: 230px;
  margin-top: 10px;
  margin-left: 6%;
  background: #fff;
}
.container .type .shu:active {
  opacity: 0.8;
}
.container .type .heng:active {
  opacity: 0.8;
}
.container .type .shu img {
  margin: 0 auto;
  width: 92%;
  margin-left: 4%;
  margin-top: 10px;
  float: left;
  height: 200px;
}
.container .type .shu span {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}
.container .type .heng {
  margin: 0 auto;
  width: 88%;
  height: 230px;
  float: left;
  margin-left: 6%;
  margin-top: 20px;
  background: #fff;
}
.container .type .heng img {
  margin: 0 auto;
  width: 92%;
  margin-left: 4%;
  margin-top: 10px;
  float: left;
  height: 200px;
}
.container .type .heng span {
  margin: 0 auto;
  float: left;
  width: 100%;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}
.container .type .tuandui {
  margin-bottom: 20px;
}
</style>
