<template>
  <view class="main">
    <view class="header">
      <NavBar title="订单" :showBack="false"></NavBar>
      <view class="nav">
        <view
          v-for="(item, index) in selectNav"
          :key="index"
          @click="nav(item, index)"
          :class="{ 'active-class': activeIndex == index }"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <list ref="list" :options="options" @success="onListSuccess"> 
      <block v-if="list.length>0">
      <view class="order-list" v-for="(item,index) in list" :key="index" @click="stay(item)">
        <view class="mark">
            <view v-if="item.status==4">待确认</view>
            <view v-if="item.status==6">待管理员端审核</view>
            <view v-if="item.status==5" style="background: #EBEBF2;box-shadow: none;">已完成</view>
            <view v-if="item.status==7" style="background: #EBEBF2;box-shadow: none;">已取消</view>
            <view v-if="item.status==1 || item.status==2 || item.status==3">待取货</view>
        </view>
        <view class="msg">
            <view>
              <text>{{item.reprpackGroupName}}</text>
              <image src="http://oss.juxingta.com/static/images/2022-08-17/a2ec7d58-ceb5-4c17-b493-7cf5d87dc859___%E6%A4%AD%E5%9C%86%E5%BD%A2%201%402x.png"></image>
            </view>
             <!-- 待取货 -->
            <template  v-if="item.status==1 || item.status==2 || item.status==3">
               <view>订单正在分配，请您耐心等待</view>
               <view class="order-pub">
                  <text>订单编号</text>
                  <text>{{item.orderNo}}</text>
               </view>
                <view class="order-pub">
                    <text>预约上门</text>
                    <text>{{item.pickupTime}}</text>
                </view>
                <view class="order-pub">
                  <text>地   址</text>
                  <text>{{item.address}}</text>
               </view>
            </template>
             <!-- 待确认 已完成-->
            <template  v-if="item.status==4 || item.status==5 || item.status==6" >
               <view v-if="item.status==5">订单已完成</view>
               <view v-if="item.status==4 ||item.status==6">货品已回收，待您确认订单金额</view>
               <view class="order-pub">
                  <text>订单编号</text>
                  <text>{{item.orderNo}}</text>
               </view>
               <view class="order-pub">
                  <text>订单金额</text>
                  <text>{{item.amount}}元</text>
               </view>
                <view class="order-pub">
                  <text>货品重量</text>
                  <text>{{item.weight}}kg</text>
               </view>
            </template>
             <!-- 已取消 -->
            <template  v-if="item.status==7">
               <view>订单已取消</view>
               <view class="order-pub">
                  <text>订单编号</text>
                  <text>{{item.orderNo}}</text>
               </view>
               <view class="order-pub">
                    <text>预约上门</text>
                    <text>{{item.pickupTime}}</text>
                </view>
                <view class="order-pub">
                  <text>发货地</text>
                  <text>{{item.address}}</text>
               </view>
            </template>
        </view>
        <view class="order-btn">
           <view v-if="item.status==4 || item.status==6" @click.stop="confirmOrder(item)">确认</view>
           <view v-else @click.stop="orderDeatil(item)">查看详情</view>
        </view>
      </view>
      </block>
     </list>
    <view class="empty" v-if="list.length==0">
            <image src="http://oss.juxingta.com/static/images/2022-08-17/f9e9ff37-70c8-456a-957e-35857c842c75___%E5%9B%BE%E5%B1%82%201%402x.png"></image>
            <text>您还没有订单哦～</text>
            <view @click="jumpDownOrder">我要下单</view>
    </view>
    <!-- 订单确认弹窗 -->
    
    <view class="layer" v-show="confirmOrderLayer"></view>
    <view class="toast" v-show="confirmOrderLayer">
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
        <view class="toast-btn">
            <view @click="cancel">取消</view>
            <view @click="confirm">确认</view>
        </view>
    </view>
    <view-tabbar :current="1" ref="tabbar"></view-tabbar>
  </view>
</template>
<script>
import NavBar from "@/components/nav-bar";
import Tabbar from "@/components/tabbar";
import {orderConfirm} from '@/api/order'
import { mapState } from "vuex";
export default {
  components: {
    "view-tabbar": Tabbar,
    NavBar,
  },
  data() {
    return {
      selectNav: [
        {
          name: " 待取货",
        },
        {
          name: "待确认",
        },
        {
          name: "已完成",
        },
      ],
      list: [],
      activeIndex: 0,
    //   请求状态
      statusArr:'1,2,3',
    //  确认订单弹窗
      confirmOrderLayer:false,
      toastMsg:{
        orderNo:'',
        amount:'',
        weight:''
      }
    };
  },
  computed: {
    ...mapState(['userInfo','token']),
    options() {
      return {
        url: '/reprpack/reprpackOrder/query',
        method: "get",
        params: {
		    	status:this.statusArr
        },
      };
    },
  },
  watch:{
    immediate:true,
    activeIndex(newVal,oldVal){
        if(newVal==0){
            // 待取货
            this.statusArr="1,2,3"
        }else if(newVal==1){
            // 待确认
            this.statusArr="4,6"
        }else if(newVal==2){
            //已完成
            this.statusArr="5,7"
        }
    }
  },
  onHide(){
    uni.removeStorageSync("id");
  },
  onShow() {
    try{
      var id =uni.getStorageSync('id');
      if(id){
        if(id==-1){
          this.activeIndex=0
          this.$nextTick(() => {
            this.$refs.list.refresh();
          })
        }else if(id==1){
          this.activeIndex=1
          this.$nextTick(() => {
            this.$refs.list.refresh();
          })
        }else if(id==2){
          this.activeIndex=2
          this.$nextTick(() => {
            this.$refs.list.refresh();
          })
        }

      }
    }catch (e){
      console.log(e)
    }
    uni.hideTabBar({
      animation: false,
    });
    // 获取订单角标数量
    if(this.token){
        this.$refs.tabbar.orderCountMsg()
    }
  },
  methods: {
    // 订单确认弹窗
    confirmOrder(item){
        this.confirmOrderLayer=true;
        this.toastMsg=Object.assign(this.toastMsg,item)
    },
    // 订单确认接口
    confirm(){
        let postData={
            orderNo:this.toastMsg.orderNo,
        }
      orderConfirm(postData).then(res=>{
        if(res.data.code==200){
             this.activeIndex=2;
             this.confirmOrderLayer=false;
             this.$nextTick(() => {
                this.$refs.list.refresh();
            })
        }else{
            this.$util.showToast(res.data.data.message);
        }
        }).catch(err=>{
            this.$util.showToast(err.data.message);
        })
    },
    // 订单确认取消
    cancel(){
        this.confirmOrderLayer=false;
    },
    // 跳转下单页面
    jumpDownOrder(){
        this.$Router.pushTab({
            path:"/pages/home/index"
        })
    },
    // 订单详情
    orderDeatil(item){
        this.$Router.push({
            path:"/pagesA/order/detail",
            query:{
                orderNo:item.orderNo
            }
        })
    },
    // 待确认订单去详情页面
    stay(item){
        if(item.status==4 || item.status==6){
         this.$Router.push({
            path:"/pagesA/order/detail",
            query:{
                orderNo:item.orderNo
            }
         })
        }
    },
    nav(item,index){
        this.activeIndex=index;
        this.$nextTick(() => {
			this.$refs.list.refresh()
		})
    },
    onListSuccess(list) {
      console.log("list",list)  
      this.list = list.map((x) => {
        return {
          ...x,
        };
      });
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
.active-class {
  background: #c2f21f !important;
}
/deep/ .mescroll-uni-fixed{
    margin-top: 269rpx;
    top: 269rpx;
    bottom: 190rpx !important;
}
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
.empty{
    // text-align: center;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 10000;
    left: 0;
    right: 0;
    top: 450rpx;
    image{
        width: 280rpx;
        height: 316rpx;
        margin:0 auto;
    }
    text{
        font-size: 28rpx;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #999999;
        padding: 36rpx 0 76rpx 0;
        text-align: center;
    }
    &>view{
        width: 520rpx;
        height: 96rpx;
        background: #C2F21F;
        border-radius: 106rpx;
        opacity: 1;
        font-size: 32rpx;
        font-family: 'PingFang SC-中黑体', PingFang SC;
        font-weight: normal;
        color: #000000;
        line-height: 96rpx;
        text-align: center;
        margin: 0 auto;

    }
}
.main {
  .header {
    height: 273rpx;
    background: linear-gradient(
      180deg,
      rgba(194, 242, 31, 0.5) 0%,
      rgba(255, 255, 255, 0.8) 90%
    );
    // position: relative;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1000;
    .nav {
      display: flex;
      justify-content: space-around;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20rpx;
      view {
        font-size: 28rpx;
        font-weight: normal;
        color: #000000;
        line-height: 56rpx;
        -webkit-background-clip: text;
        width: 188rpx;
        height: 56rpx;
        background: #f5f5f5;
        border-radius: 28rpx;
        opacity: 1;
        text-align: center;
        // font-weight: bold;
        font-family: 'Bitstream';
      }
    }
  }
  .order-list{
    margin: 20rpx 30rpx;
    padding: 28rpx 0 28rpx 56rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    position: relative;
    .mark{
        view{
            position: absolute;
            right: 0;
            top: 0;
            height: 56rpx;
            opacity: 1;
            font-size: 28rpx;
            font-family: 'PingFang SC-常规体', 'PingFang SC';
            font-weight: normal;
            color: #333333;
            line-height: 56rpx;
            text-align: center;
            padding: 0 34rpx;
        }
        &>view:nth-child(1),&>view:nth-child(4),&>view:nth-child(5){
            background: rgba(194,242,31,0.5);
            box-shadow: 0px 4rpx 16rpx 0px rgba(173,228,18,0.3132);
            opacity: 1;
            border-radius: 0 20rpx 0 20rpx;
        }
         &>view:nth-child(2),&>view:nth-child(3){
            background: #EBEBF2;
            
        }
      
    }
    .msg{
       &>view:nth-child(1){
        position: relative;
        display: inline-block;
        text{
        font-size: 36rpx;
        // font-family: zihun3hao-yingxiongheiti-Regular, zihun3hao-yingxiongheiti;
        font-family:'Bitstream';
        // font-weight: 600;
        color: #333333;
        margin-bottom: 16rpx;
        display: inline-block;
        position: relative;
        z-index: 10000;
        }
        image{
            width: 58rpx;
            height: 54rpx;
            position: absolute;
            right: -10px;
            top: 0rpx;
            z-index: 0;
        }
        // background: rgba(194,242,31,0.5);
        // box-shadow: 0px 4rpx 16rpx 0px rgba(173,228,18,0.3132);
       }
        &>view:nth-child(2){
            width: 578rpx;
            height: 48rpx;
            background: rgba(194,242,31,0.15);
            border-radius: 8rpx;
            opacity: 1;
            font-size: 24rpx;
            font-family: 'PingFang SC-常规体', PingFang SC;
            font-weight: normal;
            color: #666666;
            line-height: 48rpx;
            margin-bottom: 16rpx;
            padding-left: 12rpx;
            box-sizing: border-box;
       }
       .order-pub>text:nth-child(1)::after{
            display: block ; content: ''; padding-left: 100%;width: 100%;
         }
       .order-pub{
            display: flex;
            margin-bottom: 22rpx;
            text:nth-child(1){
                font-size: 28rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #999999;
                box-sizing: border-box;
                 display: inline-block;
                 width: 112rpx;
                 text-align: justify;
	               text-align-last: justify;
            }
            text:nth-child(2){
                font-size: 28rpx;
                font-family: 'PingFang SC-常规体', PingFang SC;
                font-weight: normal;
                color: #333333;
                 padding-left: 20rpx;
            }
       }

    }
    .order-btn{
        margin-top: 22rpx;
        view{
            width: 188rpx;
            height: 56rpx;
            background: #000000;
            border-radius: 28rpx;
            opacity: 1;
            line-height: 56rpx;
            text-align: center;
            font-size: 28rpx;
            font-family: 'PingFang SC-中黑体', PingFang SC;
            font-weight: normal;
            color: #C2F21F;
            margin-right: 56rpx;
            margin-left: auto;
        }

    }

  }
}
</style>