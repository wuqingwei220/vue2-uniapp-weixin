<template>
    <cover-view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
        <cover-view class="tabbar-item"
            v-for="(item, index) in list" 
            :key="index" 
            @click="tabbarChange(item.path)"
        >
            <cover-image class="item-img" :src="item.icon_a" v-if="current == index"></cover-image>
            <cover-image class="item-img" :src="item.icon" v-else></cover-image>
            <cover-view class="markers" v-if="item.num &&item.num>=0">{{item.num}}</cover-view>
            <cover-view class="item-name" :class="{'tabbarActive': current == index}" v-if="item.text">{{item.text}}</cover-view>
        </cover-view>
    </cover-view>
</template>
<script>
import {orderCount} from '@/api/order'
import { mapState } from 'vuex';
export default {
    props: {
        current: String,
    },
    data() {
        return {
            paddingBottomHeight: 0,  //苹果X以上手机底部适配高度
            list: [{
                    text: '首页',  
                    icon: '/static/home/icon-index.png',  //未选中图标
                    icon_a: '/static/home/icon-index-hot.png',  //选中图片
                    path: "/pages/home/index"
                },{
                    text: '订单',
                    icon: '/static/home/order2.png',
                    icon_a: '/static/home/order1.png',
                    path: '/pages/order/index',
                    num:0
                },{
                    text: '统计',
                    icon: '/static/home/jiankong1.png',
                    icon_a: '/static/home/jiankong2.png',
                    path: "/pages/stats/index",
                },
                {
                    text: '我的',
                    icon: '/static/home/icon-my.png',
                    icon_a: '/static/home/icon-my-hot.png',
                    path: "/pages/user/index",
                },
            ],
            
        };
    },
    mounted(){
        // 订单角标数量
        if(this.token){
           this.orderCountMsg()
        }
    },
    computed:{
        ...mapState(['token'])
    },
    created() {
        let that = this;
        uni.getSystemInfo({
            success: function (res) {
                let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
                model.forEach(item => {
                    if(res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
                        that.paddingBottomHeight = 40;
                    }
                })
            }
        });
    },
    methods: {
        orderCountMsg(){
            orderCount().then(res=>{
                console.log(res.data.data)
                if(res.data.code==200){
                    this.list[1].num=res.data.data
                }else{
                    this.$util.showToast(res.data.data.message)
                }

            }).catch(err=>{
                this.$util.showToast(err.data.message)
            })
        },
        tabbarChange(path) {
            console.log(path)
                   this.$Router.pushTab({
                      path
                 })
           }
       }
};
</script>

<style lang="less" scoped>
    .tabbarActive{
        color: #333333 !important;
        font-weight: 600;
    }
    .tabbar{
		// border-top: 1px solid #C0C0C0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 168rpx;
        background-color: #ffffff;
        .tabbar-item:nth-child(2){
            position: relative;
        }
        .tabbar-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 168rpx;
            width: 120rpx;
            .item-img{
                margin-bottom: 4rpx;
                width: 46rpx;
                height: 46rpx;
            }
            .item-name{
                font-size: 26rpx;
                color: #A3A3A3;
                margin-top: 4rpx;
            }
            .markers{
                width: 40rpx;
                height: 32rpx;
                background: #F54E3E;
                opacity: 1;
                font-size: 20rpx;
                line-height: 32rpx;
                text-align: center;
                color: white;
                border-radius: 50%;
                position: absolute;
                top: 26rpx;
                right: 19rpx;
                z-index: 10000;
            }
        }
    }
</style>