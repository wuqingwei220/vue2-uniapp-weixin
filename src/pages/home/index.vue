<template>
  <view>
     <NavBar  :showBack="false" mode="log" logImg="https://oss.juxingta.com/static/images/2022-09-05/60c0d5d9-f3ac-4c94-90c4-ad01e6d59f2f___%E7%BB%84%2034%402x.png"  totalBackground="#C2F21F"></NavBar>
     <view-tabbar :current="0" ref="tabbar"></view-tabbar>
     <view class="count">
        <image class="banner" @click="about" src="https://oss.juxingta.com/static/images/2022-09-01/1649d497-cd4e-41a7-b974-46c27a14568d___%E7%BB%84%2038%402x.png" style="width:100%"></image>
        <view class="type">
          <view class="title">
            <image src="https://oss.juxingta.com/static/images/2022-08-15/6d4166e0-f231-4367-8ba1-c6da040399bb___%E7%BB%84%2035%402x.png"></image>
          </view>
          <view class="class-flex">
          <view class="allClass"  v-for="(item,index) in classList" :key="index" @click="downOrder(item)">
              <view class="class-title">
                <view>{{item.reprpackGroupName}}</view>
                <view>{{item.remark}}</view>
              </view>
              <view class="class-img">
                <image :src="item.logo"></image>
              </view>
            </view>
          </view>
        </view>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/nav-bar'
import Tabbar from '@/components/tabbar'
import {reprpackGroup} from '@/api/group'
import {mapState} from 'vuex'
export default {
  components:{
    'view-tabbar': Tabbar,
    NavBar
  },
  data() {
    return {
      classList:[],
      isLoginTip:false
    };
  },
  // onLoad() {
    // uni.startPullDownRefresh();
  // },
  onShow() {
       // 判断用户是否登陆
        this.ifToken();
        uni.hideTabBar({
            animation: false
        })
        if(this.token){
           this.$refs.tabbar.orderCountMsg()
        }
  },
  computed:{
    ...mapState(['userInfo', 'token']),

  },
  onPullDownRefresh() {
		console.log('refresh');
    this.groupList();
    this.ifToken();
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
  mounted() {
    this.groupList()
  },
  methods: {
      // 关于我们
    about(){
        this.$Router.push({
          path: "/pagesB/about",
        });
     },
    // 获取回收列表
    groupList(){
      reprpackGroup().then(res=>{
        if(res.data.code==200){
          this.classList=res.data.data
        }else {
          this.$util.showToast(res.data.data.message)
        }
      }).catch(err=>{
        this.$util.showToast(err.data.data.message)
      })
    },
    // 获取下单页面
    downOrder(item){
       if(this.token){
         this.$Router.push({
          path:"/pagesA/order/index",
          query:{
            id:item.id,
            reprpackGroupNo:item.reprpackGroupNo,
            reprpackGroupName:item.reprpackGroupName
          }
        })
      }else{
        this.ifToken()
      }
    },
    ifToken() {
	    var _this=this;	
      if(this.token || this.isLoginTip){
        return;
      }
      this.isLoginTip=true;
      this.isLoginTip && uni.showModal({
        title: "提示",
        content: "您还没有登录账号，是否登陆？",
        confirmText:"去登陆",
        success: function (res) {
          if (res.confirm) {
              _this.$Router.push({
                path: "/pagesA/login/pass-code",
              });
              _this.isLoginTip=false;
          } else if (res.cancel) {
            console.log("用户点击取消");
            _this.isLoginTip=false;
          }
        },
      });
    },
  },
};
</script>
<style>
page {
  background: #F0F1F5;
}
</style>

<style lang="less" scoped>
.count{
  height: 70%;
  background: linear-gradient(180deg, rgba(187,241,0,0.9000) 0%, #FFFFFF 83%, #FFFFFF 100%);
  border-radius: 0px 0px 0px 0px;
  padding-bottom: 190rpx;
  .banner{
    height: 466rpx;
  }
  .type{
    height: 696rpx;
    background: #FFFFFF;
    box-shadow: 0px -2px 20px 0px rgba(0,0,0,0.0400);
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    opacity: 1;
    margin: 24rpx 32rpx 0 32rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    box-sizing: border-box;
    overflow: hidden;
    &>view:nth-child(1){
      margin: 42rpx 0 64rpx 0;
      image{
        width: 216rpx;
        height: 50rpx;  
      }
    }
    .class-flex{
       display: flex;
       flex-wrap: wrap;
       .allClass:nth-child(2n-1){
        padding-right: 30rpx;
       }
    }
    .allClass{
       display: flex;
       flex-wrap: wrap;
       margin-bottom: 80rpx;
      //  width: 50%;
      .class-title{
        display: flex;
        flex-direction: column;
        &>view:nth-child(1){
          font-size: 32rpx;
          // font-weight: normal;
          color: #333333;
          -webkit-background-clip: text;
          font-weight: 600;
          padding-bottom: 6rpx;
          font-family: 'DINCondensedBold';
        }
        &>view:nth-child(2){
          font-size: 24rpx;
          font-weight: normal;
          color: #666666;
          -webkit-background-clip: text;
          width: 188rpx;
        }
      }
     .class-img{
        margin-left: 30rpx;
        image{
          width: 80rpx;
          height: 80rpx;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
          margin-top: 16rpx;
        }
      }
    }
  }
}

</style>
