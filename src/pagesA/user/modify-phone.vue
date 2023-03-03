<template>
    <view>
         <NavBar title="修改手机号" totalBackground="#fff"></NavBar>
         <view style="background: #fff;overflow: hidden;">
         <view class="count">
            <view class="rows">
                <text>
                    手机号
                </text>
                <input type="text" :disabled="true" v-model="phone" class="input-phone">
            </view> 
            <view class="rows">
                <text>
                    验证码
                </text>
                <input type="number" v-model="code"  placeholder="请输入验证码" class="input-phone" placeholder-style="color:#BFBFBF;font-size:28rpx">
                <view class="addAddress_yzmright">
                <button
                class="code-btn"
				style="color:#333333"
                @click="getVerificationCode"
                :disabled="disabled"
				v-if="ifCode"
               >
                {{ btntxt }}
              </button>
			  <button
                class="code-btn"
                :disabled="disabled"
				v-else
              >
                {{ btntxt }}
              </button>
            </view>
            </view> 
         </view>   
         </view> 
         <view class="footer" @click="nextEditPhone"> 
             下一步
         </view>    
    </view>
</template>
<script>
import NavBar from "@/components/nav-bar";
import {sendChangePhone,verifyPhone} from '@/api/user';
import { mapState } from "vuex";
export default {
    components: {
        NavBar
    },
    data(){
        return {
            ifCode:true,
            btntxt: "获取验证码",
            phone:"",
            seconds:60,
            code:''
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    mounted(){
        this.phone=this.userInfo.user.phone
        console.log(this.userInfo)
    },
    methods:{
       // 获取验证码
        async getVerificationCode() {
        let postData = {
            phone:this.phone
        };
        sendChangePhone(postData)
            .then((res) => {
            if (res.data.code == 200) {
                this.$util.showToast("验证码已发送");
                const timer = setInterval(() => {
                    this.btntxt = this.seconds + "秒再试";
                    this.seconds--;
                    this.disabled = true;
                    this.ifCode=false
                    if (this.seconds === 0) {
                    clearInterval(timer);
                    this.btntxt = "获取验证码";
                    this.seconds = 60;
                    this.disabled = false;
                    this.ifCode=true
                    }
                }, 1000);
            }
            console.log(res.data.data);
            })
            .catch((err) => {
            uni.showToast({
                title: err.msg,
                icon: "none",
                duration: 2000,
            });
            });
        },
        // 下一步
        nextEditPhone(){
          let postData={
            id:this.userInfo.user.id,
            phone:this.phone,
            code:this.code
          }  
          verifyPhone(postData)
            .then((res) => {
            if (res.data.code == 200) {
                this.$Router.push({
                  path:"/pagesA/user/bind-phone"
                })
            }
            console.log("校验验证码",res.data.data);
            })
            .catch((err) => {
            uni.showToast({
                title: err.msg,
                icon: "none",
                duration: 2000,
            });
            });
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
  button::after { border: none ;}
  .count {
    background: #fff;
    padding: 20rpx 30rpx 0 30rpx;
    border-top: 1px solid #F2F3F5;
    margin-top:20rpx;
    &>.rows:nth-child(1){
        border-bottom: 1px solid #E1E1E1;
    }
    .rows{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 98rpx;
        line-height: 98rpx;
        &>text:nth-child(1){
            font-size: 28rpx;
            font-weight: normal;
            color: #333333;
            width: 170rpx;
            text-align: left;
        }
        .input-phone{
            font-size: 28rpx;
            font-weight: normal;
            color: #838383;
        }
        .addAddress_yzmright {
            height: 98rpx;
            float: left;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: auto;
            }
            .code-btn{
            font-size: 26rpx;
            font-weight: normal;
            color: #c3c4c7;
            background: none;
            outline: 0 none !important;
            padding-left: 0;
            padding-right: 0;
            margin: 0;
        }
       
    }
  }
  .footer{
    position:fixed;
    bottom: 104rpx;
    text-align: center;
    height: 81rpx;
    background: #C2F21F;
    border-radius: 300rpx;
    opacity: 1;
    line-height: 81rpx;
    font-size: 32rpx;
    font-weight: normal;
    color: #000000;
    margin: 0 30rpx;
    left: 0;
    right: 0;
  }

</style>