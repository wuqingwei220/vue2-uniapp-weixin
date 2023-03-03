<template>
    <view class="count">
        <view class="header">
             <NavBar title="我的" :showBack="false"></NavBar>
             <view class="enterprise">
                <image src="http://oss.juxingta.com/static/images/2022-08-19/305a748f-01c3-49bc-8073-c6ff22c84a9b___%E8%92%99%E7%89%88%E7%BB%84%204%402x.png"></image>
                <text>{{userInfoMsg.enterpriseName}}</text>
             </view>
        </view>
        <view class="msg">
            <view class="floor">
                <view>
                    <text>用户名</text>
                    <text>{{userInfoMsg.userName ||'--'}}</text>
                </view>
                 <view>
                    <text>手机</text>
                    <text>{{userInfoMsg.phone | filterPhone}}</text>
                </view>
            </view>
            <view class="floor">
                <view @click="auth">
                    <text>企业认证</text>
                    <text class="arrow"></text>
                </view>
                 <view @click="seting">
                    <text>系统设置</text>
                    <text class="arrow"></text>
                </view>
            </view>
             <view class="floor">
                <view @click="about">
                    <text>关于我们</text>
                    <text class="arrow"></text>
                </view>
                 <view @click="help">
                    <text>帮助</text>
                    <text class="arrow"></text>
                </view>
            </view>
            <view class="floor" style="height:90rpx">
                <view style="border-bottom:none" @click="service">
                    <text>客服</text>
                    <text class="arrow"></text>
                </view>
            </view>
        </view>
         <view-tabbar :current="3"></view-tabbar>
    </view>
</template>


<script>
import NavBar from "@/components/nav-bar";
import Tabbar from "@/components/tabbar";
import {getReprpackUserUserInfo,userInfo} from "@/api/user";
import { mapState } from "vuex";
 export default {
    components: {
        "view-tabbar": Tabbar,
        NavBar,
    },
    data(){
        return {
            userInfoMsg:{
                userName:"",
                phone:"",
                enterpriseName:""
            },
            userId:'',
            token1:''
        }
    },
    onShow(){
        if(JSON.stringify(this.userInfo)!="{}"){
            this.userInfoMsg.userName=this.userInfo.user.userName;
            this.userInfoMsg.phone=this.userInfo.user.phone
            this.userInfoMsg.enterpriseName=this.userInfo.enterprise.name
            this.userId=this.userInfo.user.id;
        }
       
    },
    computed:{
        ...mapState(['userInfo','token'])
    },
    mounted(){
        this.getUserInfo()
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
    methods:{
        getUserInfo(){
            userInfo().then(res => {})
        },
        // 帮助
        help(){
            this.$Router.push({
                path:"/pagesB/help"
            })
        },
        // 关于我们
       about(){
         this.$Router.push({
            path: "/pagesB/about",
         });
        },
        seting(){
            this.$Router.push({
                path:"/pagesA/user/seting"
            })
        },
        // 客服
        service(){
         uni.showModal({
            title: "提示",
            content: "拨打电话：400-000-3528",
            confirmText:"拨号",
            success: function (res) {
            if (res.confirm) {
               uni.makePhoneCall({
                    phoneNumber: '400-000-3528' 
                });
            } else if (res.cancel) {
                console.log("用户点击取消");
            }
            },
        });

        },
        //企业认证
        auth(){
            let postData={
                 id: this.userId,
                 userType: "shipper"
             }
            getReprpackUserUserInfo(postData).then(res=>{
                if(res.data.code==200){
                    if(res.data.data.pic3!=''&&res.data.data.pic3!=null&&res.data.data.pic3!='undefined'){
                        this.$Router.push({
                            path:"/pagesA/user/auth",
                            query:{
                                isCertified:true,
                                name:res.data.data.name,
                                pic3:[res.data.data.pic3]
                            }
                        })
                    }else{
                        this.$Router.push({
                            path:"/pagesA/user/auth",
                            query:{
                                isCertified:false,
                                name:res.data.data.name || '',
                                pic3:[]
                            }
                        })
                    }
                }else{
                    this.$util.showToast(res.data.data.message)
                }
            }).catch(err=>{
                this.$util.showToast(err.data.message)
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
// 箭头
 .arrow{
        width: 18rpx;
        height: 18rpx;
        box-sizing: border-box;
        border-top: 4rpx solid #999999;
        border-right: 4rpx solid #999999;
        transform: rotate(45deg);
    }
 .count{
    .header{
        background: url('http://oss.juxingta.com/static/images/2022-08-19/67b70f15-485a-4115-bc6b-c9121647fc29___4.Navigation%20Bar%EF%BC%8FIOS%20X%20-%20miniprogram%402x.png') no-repeat top center;
        background-size: 100% 100%;
        height: 584rpx;
        width: 100%;
        .enterprise{
            display: flex;
            align-items: center;
            margin: 50rpx 0 66rpx 30rpx;
            image{
                width: 130rpx;
                height: 130rpx;
                border-radius: 50%;
            }
            text{
                font-size: 44rpx;
                font-family: 'PingFang SC-中黑体', PingFang SC;
                font-weight: normal;
                color: #000000;
                padding-left: 30rpx;
            }
        }
    }
    .msg{
        margin: -180rpx  30rpx 0 30rpx;
        padding-bottom: 198rpx;
        .floor{
            display: flex;
            flex-direction: column;
             padding: 0 40rpx;
             height: 180rpx;
             background: #FFFFFF;
             border-radius: 20rpx;
             opacity: 1;
             margin-bottom: 20rpx;
            &>view:nth-child(1){
                display: flex;
                justify-content: space-between;
                height: 90rpx;
                line-height: 90rpx;
                border-bottom: 2px solid #F9F9F9;
                align-items: center;
                &>text:nth-child(1){
                    font-size: 28rpx;
                    font-family: 'PingFang SC-常规体', PingFang SC;
                    font-weight: normal;
                    color: #333333;
                }
                 &>text:nth-child(2){
                    font-size: 28rpx;
                    font-family: 'PingFang SC-中黑体', PingFang SC;
                    font-weight: normal;
                    color: #3D3D3D;

                }
            }
             &>view:nth-child(2){
                display: flex;
                justify-content: space-between;
                height: 90rpx;
                line-height: 90rpx;
                align-items: center;
                 &>text:nth-child(1){
                    font-size: 28rpx;
                    font-family: 'PingFang SC-常规体', PingFang SC;
                    font-weight: normal;
                    color: #333333;
                }
                 &>text:nth-child(2){
                    font-size: 28rpx;
                    font-family: 'PingFang SC-中黑体', PingFang SC;
                    font-weight: normal;
                    color: #3D3D3D;
                }
             
                
            }
        }
    }
 }


</style>