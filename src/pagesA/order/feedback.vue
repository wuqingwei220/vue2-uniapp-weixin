<template>
  <view>
    <view class="feed-back">
      <NavBar title=" "></NavBar>
      <view class="title">
        <text>问题反馈</text>
        <text>提交反馈后订单将交由管理员审核哦～</text>
      </view>
      <view class="info">
        <view>
          <text>问题描述</text>
          <image
            src="http://oss.juxingta.com/static/images/2022-08-17/a2ec7d58-ceb5-4c17-b493-7cf5d87dc859___%E6%A4%AD%E5%9C%86%E5%BD%A2%201%402x.png"
          ></image>
        </view>
        <view>
          <textarea
            @input="watchNum"
            placeholder="请您输入问题描述～"
            v-model="problemDescription"
            :show-confirm-bar="false"
          ></textarea>
          <view>
            <text>(</text>
            <text :class="[inputNum > 0 ? 'active-text' : '']"
              >{{ inputNum }}</text
            >
            <text>/{{ surplus }})</text>
          </view>
        </view>
      </view>
       <view class="footer">
        <view @click="orderFeedbackClick">提交</view>
    </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/nav-bar";

import {orderFeedback} from '@/api/order'
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      inputNum: 0,
      surplus: 100,
      problemDescription:'',
      orderNo:''
    };
  },
  onLoad(){
    this.orderNo=this.$Route.query.orderNo
  },
  methods: {
   orderFeedbackAjax(){
     let postData={
        orderNo:this.orderNo,
        problemDescription:this.problemDescription,
        problemType:''
     }
     orderFeedback(postData).then(res=>{
            if(res.data.code==200){
                 uni.setStorageSync('id', 1);
                 this.problemDescription=''
                 this.$Router.pushTab({
                    path:"/pages/order/index",
                    query:{id:1}
                })
            }else{
                this.$util.showToast(res.data.data.message);
            }
            }).catch(err=>{
                this.$util.showToast(err.data.message);
        })
   }, 
   orderFeedbackClick(){
      var _this=this;
      uni.showModal({
          title: "问题反馈",
          content: "提交反馈后订单将交由管理员审核，是否提交审核？",
          confirmText:"提交",
          success: function (res) {
          if (res.confirm) {
            _this.orderFeedbackAjax()
          } else if (res.cancel) {
              console.log("用户点击取消");
          }
          },
      });
   },
    watchNum(e) {
      this.inputNum = e.detail.value.length;
      this.surplus = 100;
      this.surplus = Number(this.surplus) - Number(this.inputNum);
    },
  },
};
</script>
<style>
page {
  background: #f0f1f5;
}
</style>
<style lang="less" scoped>
.active-text {
  color: #000 !important;
}
.feed-back {
  height: 866rpx;
  background: url("http://oss.juxingta.com/static/images/2022-08-17/e3ef1b7d-fed5-4a4d-9780-9c599654cfed___%E7%BB%84%2010%402x.png")
    no-repeat top center;
  background-size: 100% 100%;
  .title {
    display: flex;
    flex-direction: column;
    margin-top: 44rpx;
    margin-left: 40rpx;
    text:nth-child(1) {
      font-size: 48rpx;
      font-family: "PingFang SC-中黑体", PingFang SC;
      font-weight: normal;
      color: #000000;
      padding-bottom: 24rpx;
    }
    text:nth-child(2) {
      font-size: 28rpx;
      font-family: "PingFang SC-常规体", PingFang SC;
      font-weight: normal;
      color: #3d3d3d;
    }
  }
  .info {
    height: 530rpx;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 28rpx 60rpx 28rpx 40rpx;
    margin: 38rpx 30rpx 0 30rpx;
    position: relative;
    & > view:nth-child(1) {
      position: relative;
      display: inline-block;
      text {
        font-size: 32rpx;
        font-family: "PingFang SC-中黑体", PingFang SC;
        font-weight: normal;
        color: #000000;
      }
      image {
        width: 58rpx;
        height: 54rpx;
        position: absolute;
        right: -10px;
        top: 0rpx;
      }
    }
    & > view:nth-child(2) {
      textarea {
        font-size: 28rpx;
        font-family: "PingFang SC-常规体", PingFang SC;
        font-weight: normal;
        color: #333333;
        white-space: nowrap;
        height: 400rpx;
        text-align: left;
        width: 586rpx;
        margin-top: 16rpx;
      }
      view {
        position: absolute;
        right: 40rpx;
        bottom: 28rpx;
        text {
          font-size: 24rpx;
          font-family: "PingFang SC-常规体", PingFang SC;
          font-weight: normal;
          color: #999999;
        }
      }
    }
  }
  .footer{
    height: 176rpx;
    background: #FFFFFF;
    opacity: 1;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    view{
        width: 690rpx;
        height: 80rpx;
        background: #C2F21F;
        border-radius: 384rpx;
        opacity: 1;
        font-size: 30rpx;
        font-family: 'PingFang SC-中黑体', PingFang SC;
        font-weight: normal;
        color: #000000;
        line-height: 80rpx;
        text-align: center;
        margin: 28rpx auto 0;
    }
  }
}
</style>