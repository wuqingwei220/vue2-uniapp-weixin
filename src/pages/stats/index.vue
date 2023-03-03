<template>
  <view class="statsBox">
    <view class="header">
      <NavBar title=" " :showBack="false"></NavBar>
    </view>
    <view class="main">
        <!-- <img class="bgImg" src="http://oss.juxingta.com/static/images/2022-08-30/e4c3b52d-e940-4839-9b32-2bbe3c09d820___%E8%92%99%E7%89%88%E7%BB%84%201%403x.png" alt=""> -->
        <view class="statistics">
             <view class="recycle">
               <p>本月累计回收</p>
                 <p class="nums">{{allData.allOrderNum}}</p>
                <text> 单</text>
            </view>
             <view class="income">
                <p>本月累计收益</p>
                <p class="nums">{{allData.allAmount}}</p>
                <text> 元</text>
            </view>

        </view>
        <view class="box-recycle">
            <view class="title">
                <img src="http://oss.juxingta.com/static/images/2022-08-30/b3024153-8b1b-44ff-bf12-95e86b656be5___%E8%B7%AF%E5%BE%84%403x.png" />
                <view>本月回收品类统计</view>
            </view>
            <view class="echarts-wrap">
                <my-echarts  ref="option2" :echarts="echarts" :onInit="initChart" />
            </view>
        </view>
        <view class="recycling-trends">
            <view class="title">
                <img src="http://oss.juxingta.com/static/images/2022-08-30/c84f9261-0a85-4ef0-bdcc-0c7b2604949c___%E7%BB%84%2048%403x.png" />
                <view>回收趋势</view>
            </view>
            <view class="echarts-line">
                <my-echarts ref="option2" :echarts="echarts" :onInit="lineChart" />
            </view>
        </view>
        <view class="minbox"></view>
       
    </view>
    <view-tabbar :current="2" ref="tabbar"></view-tabbar>
  </view>
</template>
<script>
import NavBar from "@/components/nav-bar";
import Tabbar from "@/components/tabbar";
import { statistical } from "@/api/stats";
import * as echarts from "@/common/echarts.min.js";
import myEcharts from "@/components/mpvue-echarts/src/echarts.vue";
import { option } from '_@dcloudio_vue-cli-plugin-uni@2.0.1-35320220729002@@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
    let option1 = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '2%',
            left: '55%'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['28%', ' 41%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                data: [
                    // { value: 1048, name: 'Search' },
                    // { value: 735, name: 'Direct' },
                    // { value: 580, name: 'Email' },
                    // { value: 484, name: 'Union Ads' },
                    // { value: 300, name: 'Video Ads' }
                ]
            }
        ],
        formatter: function (name) {
            var data = option1.series[0].data;
            var total = 0;
            var tarValue;
            for (var i = 0; i < data.length; i++) {
                total += data[i].value;
                if (data[i].name == name) {
                tarValue = data[i].value;
                }
            }
            var v = tarValue;
            var p = Math.round((tarValue / total) * 100);

            return `${name}` + '     ' + `${p}%`;
        }
    };
    let option2 = {
         grid:{
            // top:'10%',//距上边距
            left:'1%',//距离左边距
            // right:'0%',//距离右边距
            // bottom:'0%',//距离下边距
            containLabel:true
        },
        xAxis: {
            type: 'category',
            data: []
            // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        tooltip: {
            trigger: 'axis'
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                // [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
                itemStyle:{
                    normal:{
                        color:'#BBF100'
                    },
                    lineStyle: {
                        color: '#BBF100'
                    }
                },
            },
        ]
    };

export default {
  components: {
    "view-tabbar": Tabbar,
    NavBar,
    myEcharts,
  },
  data() {
    return {
      	echarts,
        echarts1: {},
        allData: null
    };
  },
  computed: {},
  mounted() {
   
  },
  watch:{
   
  },
  onHide(){
   
  },
  onShow() {
    this.getTime();
  },
  methods: {
    initChart(canvas, width, height) {
        let chart = null
        chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        canvas.setChart(chart)
        chart.setOption(option1);
        return chart; // 返回 chart 后可以自动绑定触摸操作
	},
    lineChart(canvas, width, height){
        let chart = null
        chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        canvas.setChart(chart)
        chart.setOption(option2);
        return chart; // 返回 chart 后可以自动绑定触摸操作
    },
    getData(startDate, endDate){
        let getData={
            startTime: '2022-08-01 00:05:06',
            // startDate,
            endTime: '2022-08-31 00:05:06'
            // endDate
        }
        statistical(getData).then(res=>{
            if(res.data.code==200){
                this.allData = res.data.data;
                console.log(this.allData.orderAmountItem)
                setTimeout(() => {
                    option1.series[0].data = this.allData.reprpackGroupItems;
                    option2.xAxis.data = this.allData.orderAmountItem.times;
                    option2.series[0].data = this.allData.orderAmountItem.prices;
                }, 0);
                this.$refs.option1.init();
                this.$refs.option2.init();
            }else{
                // this.$util.showToast(res.data.data.message)
            }
        }).catch(err=>{
            // this.$util.showToast(err.data.message)
        })
    },
    getTime(){
        var date = new Date() // this.startTime = '2022-5-02'
        var new_year = date.getFullYear() // 取当前的年份
        var month = date.getMonth()
        var new_month = month + 1 // 取当前的月份
        if (month > 12) {
            new_month -= 12 // 月份减
            new_year++ // 年份增
        }
        var firstDay = new Date(new_year, new_month, 1) // 取当年当月中的第一天
        var lastDay = new Date(firstDay.getTime() - 1000 * 60 * 60 * 24).getDate() // 获取当月最后一天日期
        if (firstDay.getMonth() < 10) {
            var mon = "0" + firstDay.getMonth()
        } else {
            var mon = firstDay.getMonth()
        }
        var startDate = firstDay.getFullYear() + '-' + mon + '-' + "0" + firstDay.getDate() + ' ' +  '00:00:00';
        var endDate = firstDay.getFullYear() + '-' + mon + '-'  + lastDay  + ' ' + '00:00:00' ;
        console.log(startDate);
        console.log(endDate)
        this.getData(startDate,endDate)
    }
  },
};
</script>
<style>
page {
  background: #f0f1f5;
}
</style>
<style lang="less" scoped>
.statsBox{
    position: relative;
}
.header{
    background: url('http://oss.juxingta.com/static/images/2022-08-30/e4c3b52d-e940-4839-9b32-2bbe3c09d820___%E8%92%99%E7%89%88%E7%BB%84%201%403x.png') no-repeat top center;
    background-size: 100% 100%;
    height: 660rpx;
    width: 100%;
}
.main{
    width: 100%;
    height: 100%;
    
    position: absolute;
    top: 20%;

}
.bgImg{
    width: 100%;
    height: 866upx;
}
.statistics{
    padding: 60upx 28upx 20upx 38upx;
    .recycle{
        display: inline-block;
    }
    .income{
        display: inline-block;
        margin-left: 100upx;
    }
    p{
        font-size: 28upx;
        color: #333333;
        margin-bottom: 16upx;
    }
    text{
        display: inline-block;
        font-size: 28upx;
        margin-left: 8upx;
    }
    .nums{
        display: inline-block;
        font-size: 60upx;
        font-weight: 500;
        color: #000000;
    }
}
.box-recycle{
    width: 94%;
    height: 400upx;
    background: #FFFFFF;
    border-radius: 20upx;
    opacity: 1;
    margin: 0 auto;
   
    .echarts-wrap {
    width: 100%;
    height: 400upx;
} 
    
}

.recycling-trends{
    width: 94%;
    height: 498upx;
    background: #FFFFFF;
    border-radius: 20upx;
    opacity: 1;
    margin: 40upx auto;
    img{
        width: 36upx !important;
        height: 32upx !important;     
    }
    .echarts-line{
        width: 100%;
        height: 590upx;
        margin-top: -72upx;
        margin-left: 22upx;
    }
}
.title{
    font-size: 32upx;
    font-weight: normal;
    color: #3D3D3D;
    margin-left: 24upx;
    padding-top: 22upx;
    img{
        width: 24upx;
        height: 34upx;
        vertical-align: middle;
        margin-right: 15upx;
    }
    view{
        vertical-align: middle;
        display: inline-block;
        
    }
}
.minbox{
    padding-bottom: 150upx;
}

</style>
