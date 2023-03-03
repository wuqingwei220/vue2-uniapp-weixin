<template>
    <view>
         <NavBar title="系统设置" totalBackground="#fff"></NavBar>
         <view class="seting">
            <view class="edit" @click="editPhone">
                <text>
                   修改手机号
                </text>
                <text>
                    {{phone | filterPhone}}
                </text>
            </view>
            <view class="agreement" @click="privacy">
                <view class="direct">
                    <text> 
                       用户协议
                    </text>
                    <text class="arrow">
                        
                    </text>
                </view>
                <view class="line">
                    
                </view>
                <view class="direct" @click="agreement">
                    <text> 
                       隐私政策
                    </text>
                    <text class="arrow">
                        
                    </text>
                </view>
            </view>
            <view class="footer" @click="logOut">
                退出登录
            </view>
         </view>
    </view>
</template>

<script>
import NavBar from "@/components/nav-bar";
import { mapMutations, mapState } from "vuex";
export default {
    components: {
        NavBar,
    },
    data(){
        return {
            phone:''
        }
    },
    computed: {
    ...mapState(["userInfo"]),
   },
    filters:{
        filterPhone(data){
            if(data){
               return data.slice(0,4)+'****'+data.slice(8,12)
            }else{
                return '--'
            }
        }
    },
    mounted(){ 
        this.phone=this.userInfo.user.phone
        console.log(this.userInfo)
    },
    methods:{
        agreement(){
            this.$Router.push({
                path:"/pagesB/agreement"
            })
        },
        privacy(){
            this.$Router.push({
                path:"/pagesB/privacy"
            })
        },
        ...mapMutations(['logout']),
        //退出登陆
        logOut(){
            var _this=this;
            uni.showModal({
                title: "提示",
                content: "是否确定退出登录？",
                success: function (res) {
                if (res.confirm) {
                    _this.logout();
                    _this.$Router.pushTab({
                        path:"/pages/home/index"
                    })
                } else if (res.cancel) {
                    console.log("用户点击取消");
                }
                },
            });
        },
        editPhone(){
            this.$Router.push({
                path:"/pagesA/user/modify-phone"
            })
        }
    }
}
</script>

<style>
 page{
    background: #F2F3F5;
 }
</style>
<style lang="less" scoped>
// 箭头
 .arrow{
    width: 18rpx;
    height: 18rpx;
    box-sizing: border-box;
    border-top: 4rpx solid #999999;
    border-right: 4rpx solid #999999;
    transform: rotate(45deg);
}
.seting{
    .edit{
      display: flex;
      padding: 30rpx;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-top: 1px solid #F2F3F5;
      text:nth-of-type(1){
        font-size: 28rpx;
        font-weight: normal;
        color: #333333;
      }
      text:nth-of-type(2){
        font-size: 24rpx;
        font-weight: normal;
        color: #979797;
      }

    }
    .agreement{
        margin-top: 16rpx;
        margin-bottom: 16rpx;
        display: flex;
        flex-direction: column;
        background: #fff;
       .line{
            border-bottom: 1px solid #E1E1E1;
            margin-left: 30rpx;

       }
       .direct{
            padding: 26rpx 30rpx 26rpx 30rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            &>text:nth-child(1){
                font-size: 28rpx;
                font-weight: normal;
                color: #333333;
            }
        }
    }
    .footer{
        background: #fff;
        text-align: center;
        padding: 26rpx 0;
        font-size: 28rpx;
        font-weight: normal;
        color: #333333;

    }
}

</style>