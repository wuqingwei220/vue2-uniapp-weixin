<template>
    <view>
         <NavBar  title="订单详情"  totalBackground="rgba(194,242,31,0.5)"></NavBar>
         <view class="detail">
            <view class="using">
               <view>
                   <text>{{orderDeatil.reprpackGroupName}}</text>
                   <image src="http://oss.juxingta.com/static/images/2022-08-17/a2ec7d58-ceb5-4c17-b493-7cf5d87dc859___%E6%A4%AD%E5%9C%86%E5%BD%A2%201%402x.png"></image>
                </view>
               <view class="pub">
                  <text>订单编号</text>
                  <text>{{orderDeatil.orderNo}}</text>
               </view>
                <view class="pub">
                  <text>预约上门</text>
                  <text>{{orderDeatil.pickupTime}}</text>
               </view>
                <view class="pub">
                  <text>地址</text>
                  <text>{{orderDeatil.address}}</text>
               </view>
                <view class="pub">
                  <text>详细地址</text>
                  <text>{{orderDeatil.addressDetails}}</text>
               </view>
                <view class="pub">
                  <text>联系人</text>
                  <text>{{orderDeatil.contacts}}</text>
               </view>
               <view class="pub">
                  <text>联系方式</text>
                  <text>{{orderDeatil.phone}}</text>
               </view>
               <view class="pub">
                  <text>下单时间</text>
                  <text>{{orderDeatil.createTime}}</text>
               </view>
               
               <!-- 已完成 -->
               <template v-if="orderDeatil.status!=1 && orderDeatil.status!=2 && orderDeatil.status!=3">
                <view class="pub">
                    <text>订单金额</text>
                    <text>{{orderDeatil.amount}}元</text>
                </view>
                <view class="pub">
                    <text>货品重量</text>
                    <text>{{orderDeatil.weight}}kg</text>
                </view>
               </template>
               <!-- 取消 -->
               <view class="pub" v-if="orderDeatil.status==7">
                  <text>取消原因</text>
                  <text>{{orderDeatil.cancelMsg}}</text>
               </view>
                <view class="pub" v-if="orderDeatil.status==6">
                  <text>问题反馈</text>
                  <text>{{orderDeatil.problemDescription}}</text>
               </view>
               <view class="pic" v-if="orderDeatil.goodsPics.length>0">
                  <block v-for="(pic,index) in orderDeatil.goodsPics" :key="index">
                    <image :src="pic"></image>
                  </block> 
               </view>
            </view>

            <view class="no-want" v-if="orderDeatil.status==1 || orderDeatil.status==2 || orderDeatil.status==3">
                <view>
                    <text>不想回收了？</text>
                    <text @click="orderCancel">取消订单</text>
                </view>
            </view>
            <view class="footer" v-if="orderDeatil.status==4 || orderDeatil.status==6">
                <view @click="feedBack">问题反馈</view>
                <view @click="confirm(orderDeatil)">确认</view>
            </view>
         </view>
         <!-- 取消订单弹窗 -->
        <view class="layer" v-show="confirmOrderLayer"></view>
        <view class="toast" v-show="confirmOrderLayer">
            <view>提示</view>
            <view>
                <!-- 回收员正在来的路上，是否确定取消该订单？ -->
                <textarea
                    placeholder="请输入取消订单原因,最多可输入50个字符"
                    v-model="refusedMsg"
                    maxlength="50"
                    adjust-position
                    :show-confirm-bar="false"
                ></textarea>
            </view>
            <view class="toast-btn">
                <view @click="cancel">取消</view>
                <view @click="confirmOrderCancel">确认</view>
            </view>
        </view>
        <!-- 订单确认弹窗 -->
        <view class="layer" v-show="confirmOrderMode"></view>
        <view class="toast1" v-show="confirmOrderMode">
            <view>订单确认</view>
            <view>
                <view>
                    <text>订单编号</text>
                    <text>{{toastMsg.orderNo}}</text>
                </view>
                <view>
                    <text>订单金额</text>
                    <text>{{toastMsg.amount}}元</text>
                </view>
                <view>
                    <text>货品重量</text>
                    <text>{{toastMsg.weight}}kg</text>
                </view>
            </view>
            <view class="toast-btn1">
                <view @click="orderCancelBtn">取消</view>
                <view @click="confirmOrderBtn">确认</view>
            </view>
        </view>
    </view>
</template>

<script>
import NavBar from "@/components/nav-bar";
import {orderInfo,orderConfirm,orderCancel} from '@/api/order'
export default {
    components: {
      NavBar,
    },
    data(){
        return {
            orderNo:"",
            orderDeatil:{},
            confirmOrderLayer:false,
            // 订单确认
            confirmOrderMode:false,
            toastMsg:{
                orderNo:'',
                amount:'',
                weight:''
            },
            // 取消订单原因
            refusedMsg:''

        }
    },
    onLoad(){
       this.orderNo=this.$Route.query.orderNo
    },
    mounted(){
       this.orderInfo() 
    },
    methods:{
         cancel(){
           this.confirmOrderLayer=false;
         },
         confirmOrderCancel(){
            console.log(",,,,,,,",this.refusedMsg)
            if(this.refusedMsg==''){
                this.$util.showToast("请输入取消订单原因！")
                return;
            }
          orderCancel({orderNo:this.orderNo,cancelMsg:this.refusedMsg}).then(res=>{
            if(res.data.code==200){
			     uni.setStorageSync('id', 2);
                 this.refusedMsg=''
                 this.$Router.pushTab({
                    path:"/pages/order/index",
                    query:{id:2}
                })
            }else{
                this.$util.showToast(res.data.data.message);
            }
            }).catch(err=>{
                this.$util.showToast(err.data.message);
            })
         },
        // 订单取消
        orderCancel(){
            this.confirmOrderLayer=true;
        },
        // 订单确认接口
        orderCancelBtn(){
            this.confirmOrderMode=false;
        },
        confirmOrderBtn(){
            let postData={
                orderNo:this.orderNo
            }
            orderConfirm(postData).then(res=>{
                if(res.data.code==200){
                uni.setStorageSync('id', 2);
                this.confirmOrderMode=false;
                this.$Router.pushTab({
                    path:"/pages/order/index",
                    query:{id:2}
                })
                }else{
                    this.$util.showToast(res.data.data.message);
                }
                }).catch(err=>{
                    this.$util.showToast(err.data.message);
            })
            
        },
        confirm(item){
            this.confirmOrderMode=true;
            this.toastMsg=Object.assign(this.toastMsg,item)
        },
        // 订单详情
        orderInfo(){
            console.log(this.orderNo)
            orderInfo({orderNo:this.orderNo}).then(res=>{
                if(res.data.code==200){
                    this.orderDeatil=res.data.data;
                }else{
                    this.$util.showToast(res.data.data.message)
                }
            }).catch(err=>{
                 this.$util.showToast(err.data.message)
            })
        },
        feedBack(){
            this.$Router.push({
                path:"/pagesA/order/feedback",
                query:{
                  orderNo:this.orderNo
                }
            })

        }
    }

}
</script>
<style>
 page{
    background: #F0F1F5;
 }
</style>
<style lang="less" scoped>
// toast
.layer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000;
    opacity: 0.5;
    z-index: 100000;
}
.toast{
    width: 640rpx;
    height: 464rpx;
    background: #FFFFFF;
    border-radius: 16rpx;
    opacity: 1;
    padding-top: 64rpx;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 10000000;
    textarea{
      margin: 16rpx 30rpx 0;
      box-sizing: border-box;
      font-size: 28rpx;
      font-family: "PingFang SC-常规体", PingFang SC;
      font-weight: normal;
      color: #666;
      white-space: nowrap;
      height: 160rpx;
      text-align: left;
      margin-top: 16rpx;
      width: 580rpx;
      background: #F7F7F7;
      border-radius: 20rpx;
      opacity: 1;
      padding: 16rpx 16rpx;
  }
    &>view:nth-child(1){
        font-size: 34rpx;
        font-family: 'PingFang SC-中黑体', PingFang SC;
        font-weight: normal;
        color: #000000;
        text-align: center;
        padding-bottom: 34rpx;
        box-sizing: border-box;

    }
     &>view:nth-child(2){
        font-size: 34rpx;
        font-weight: normal;
        color: #999999;
        text-align: center;
        margin-bottom: 32rpx;
    }
    .toast-btn{
        border-top: 1px solid rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-around;
        height: 110rpx;
        line-height: 110rpx;
        text-align: center;
        &>view:nth-child(1){
            font-size: 34rpx;
            font-family: 'PingFang SC-常规体', PingFang SC;
            font-weight: normal;
            color: #000000;
            border-right: 1px solid rgba(0,0,0,0.1);
            width: 49%;
        }
         &>view:nth-child(2){
            font-size: 34rpx;
            font-family: 'PingFang SC-中黑体', PingFang SC;
            font-weight: normal;
            color: #576B95;
              width: 49%;
        }
    }
}
// 确认价格弹窗
.toast1{
    width: 640rpx;
    height: 467rpx;
    background: #FFFFFF;
    border-radius: 16rpx;
    opacity: 1;
    padding-top: 64rpx;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 10000000;
    &>view:nth-child(1){
        font-size: 34rpx;
        font-family: 'PingFang SC-中黑体', PingFang SC;
        font-weight: normal;
        color: #000000;
        text-align: center;
        padding-bottom: 34rpx;
        box-sizing: border-box;

    }
     &>view:nth-child(2){
         display: flex;
         flex-direction: column;
         view{
            display: flex;
            justify-content:space-between;
            padding: 0 48rpx;
            margin-bottom: 28rpx;
            text:nth-child(1){
                font-size: 34rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #999999;
            }
             text:nth-child(2){
                font-size: 34rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #333333;
            }
        }
        
    }

    .toast-btn1{
        border-top: 1px solid rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-around;
        height: 110rpx;
        line-height: 110rpx;
        text-align: center;
        &>view:nth-child(1){
            font-size: 34rpx;
            font-family: 'PingFang SC-常规体', PingFang SC;
            font-weight: normal;
            color: #000000;
            border-right: 1px solid rgba(0,0,0,0.1);
            width: 49%;
        }
         &>view:nth-child(2){
            font-size: 34rpx;
            font-family: 'PingFang SC-中黑体', PingFang SC;
            font-weight: normal;
            color: #576B95;
              width: 49%;
        }
    }
}
  .detail{
        overflow: hidden;
        background: linear-gradient(180deg, rgba(194,242,31,0.5) 0%, rgba(255,255,255,0.03) 100%);
        padding-bottom: 176rpx;
        height: 866rpx;
    .using{
        margin: 32rpx 30rpx 0 30rpx;
        background: #FFFFFF;
        border-radius: 20rpx;
        opacity: 1;
        padding: 28rpx 56rpx 44rpx 56rpx;
        &>view:nth-child(1){
            position: relative;
            display: inline-block;
            margin-bottom: 40rpx;
            text{
                font-size: 36rpx;
                // font-family: zihun3hao-yingxiongheiti-Regular, zihun3hao-yingxiongheiti;
                font-family: 'Bitstream';
                // font-weight: 600;
                color: #333333;
                position: relative;
                z-index: 1000;
            }
            image{
                width: 58rpx;
                height: 54rpx;
                position: absolute;
                right: -10px;
                top: 0rpx;
                z-index: 0;
            }
        }
        .pub>text:nth-child(1)::after{
            // display: inline-block ; 
            content: ''; 
            padding-left: 100%;
            width: 100%;
            display: block;
            overflow: hidden;
         }
        .pub{
            display: flex;
            justify-content: space-between;
            margin-bottom: 22rpx;
            &>text:nth-child(1){
                font-size: 28rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #999999;
                width: 120rpx;
                text-align: left;
                text-align-last: justify;  
                 display: inline-block;
                //  white-space: nowrap;
                 text-align: justify;
            }
             &>text:nth-child(2){
                font-size: 28rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #000000;
                width: 470rpx;
                text-align: right;
                word-break: break-all;
            }
        }
        .pic{
            image:nth-child(1){
                margin-right: 34rpx;
            }
            image{
                width: 272rpx;
                height: 272rpx;
                border-radius: 20rpx;
                opacity: 1;
            }
        }

    }
    .no-want{
        view{
            height: 60rpx;
            width: 318rpx;
            background: #E9EAEE;
            border-radius: 526rpx;
            line-height: 60rpx;
            margin: 28rpx auto 0;
            text-align: center;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            text:nth-child(1){
                font-size: 24rpx;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #999999;
                // margin-left: 30rpx;
            }
            text:nth-child(2){
                font-size: 24rpx;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #3D3D3D;
                text-decoration: underline;
                box-sizing: border-box;
                
            }
        }
    }
    .footer{
        height: 176rpx;
        background: #FFFFFF;
        opacity: 1;
        position: fixed;
        width: 100%;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        view:nth-child(1){
            width: 312rpx;
            height: 80rpx;
            border-radius: 384rpx;
            opacity: 1;
            border: 2px solid #EBEBF2;
            line-height: 80rpx;
            font-size: 30rpx;
            font-family: 'PingFang SC-常规体', PingFang SC;
            font-weight: normal;
            color: #333333;
            line-height: 80rpx;
            text-align: center;
            margin-top: 28rpx;
        }
          view:nth-child(2){
            width: 312rpx;
            height: 80rpx;
            border-radius: 384rpx;
            opacity: 1;
            border: 2px solid #EBEBF2;
            line-height: 80rpx;
            font-size: 30rpx;
            font-family: 'PingFang SC-常规体', PingFang SC;
            font-weight: normal;
            color: #C2F21F;
            line-height: 80rpx;
            background: #000000;
            text-align: center;
            margin-top: 28rpx;
        }
    }
  }
</style>