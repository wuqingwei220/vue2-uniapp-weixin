<template>
<uni-shadow-root class="table-index"><scroll-view scroll-x="true" style="width:100%;" class="table table-border">
    
    <view :class="'thead '+(border ? 'thead-border' : '')+' header-row-class-name'" :style="'width:'+(scrolWidth)+'rpx;'">
      <view v-for="(item,index) in (headers)" :key="item" class="td" :style="'width:'+(item.width)+'rpx;text-align:'+(item.align)">
      {{ item.label }}
      </view>
    </view>  
    
    
    
    <scroll-view scroll-y="true" class="tbody" :style="'width:'+(scrolWidth)+'rpx; height:'+(height ? height : 'auto')+';'">
      <block v-for="(it,idx) in (data)" :key="it" v-if="data.length > 0">
        <view :class="'tbody-tr '+(stripe ? 'tbody-tr-stripe' : '')+' '+(border ? 'tbody-tr-border' : '')+' row-class-name'">
          <view v-for="(head,index) in (headers)" :key="head" class="td cell-class-name" :data-it="it" :data-row="index" :data-column="idx+1" :style="'width:'+(headers[index].width)+'rpx;color:'+(headers[index].color)+';text-align:'+(headers[index].align)" @click="onRowClick">     
          {{it[head["prop"]]}}
          </view>        
        </view>
      </block>
      
      <block v-if="data.length === 0">
        <view class="no-data">{{ msg }}</view>
      </block>
    </scroll-view>
    
</scroll-view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'table/index'
Component({
  /**
   * 外部样式类
   */
  externalClasses: ['header-row-class-name', 'row-class-name', 'cell-class-name'], 

  /**
   * 组件样式隔离
   */
  options: {
    styleIsolation: "isolated", 
    multipleSlots: true, // 支持多个slot
  },

  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: []
    },
    headers: {
      type: Array,
      value: []
    },
    // table的高度, 溢出可滚动
    height: { 
      type: String,
      value: 'auto'
    },
    width: {
      type: Number || String,
      value: '100%'
    },
    // 单元格的宽度
    tdWidth: {
      type: Number,
      value: 35
    },
    // 固定表头 thead达到Header的位置时就应该被fixed了
    offsetTop: {
      type: Number,
      value: 150
    },
    // 是否带有纵向边框
    stripe: {
      type: Boolean,
      value: false
    },
    // 是否带有纵向边框
    border: {
      type: Boolean,
      value: false
    }, 
    msg: {
      type: String,
      value: '暂无数据~'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrolWidth: '100%'
  },

  /**
   * 组件的监听属性
   */
  observers: {
    // 在 numberA 或者 numberB 被设置时，执行这个函数
    'headers': function (headers) {
      const reducer = (accumulator, currentValue) => {
        return accumulator + Number(currentValue.width)
      };
      const scrolWidth = headers.reduce(reducer, 0)

      this.setData({
        scrolWidth: scrolWidth
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRowClick(e) {
      this.triggerEvent('rowClick', e, e.currentTarget.dataset.it)
    },
  }
})
export default global['__wxComponents']['table/index']
</script>
<style platform="mp-weixin">
.table {
  position: relative;
  font-size: 28rpx;
  background: #fff;  
  border-right:none;
  border-radius: 8rpx;  
  overflow: hidden;
  font-family: PingFangSC-Medium, PingFang SC;
}
.thead{
  display: flex;
  align-items: center;
  width: 750rpx;
  height: 90rpx;
  background: #F8F9FA;
  font-size: 24rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #A1A8AD;
}
.thead .td {
  padding: 28rpx 30rpx;
  font-weight: bold;
  display: inline-block;   
  text-align: left;
  /* border-right: 1rpx solid #fff; */
}
.thead .td:last-child {
  border-right: none;
}
.thead-border .td {
  /* border-right: 1rpx solid #ebeef5; */
}
.thead-border .td:last-child {
  border-right: none;
}
/* .tr{
  display: flex;
  white-space:nowrap; 
} */
.tbody {
  box-sizing: border-box;
  font-size: 28rpx;
  color: #666;
  border: 1px solid #ebeef5;
  border-top: none;
  border-bottom-left-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}
.tbody-tr {
  display: flex;
  /* border-bottom: 1px solid #ebeef5; */
}
.tbody-tr:last-child {
  border-bottom-left-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.tbody-tr-stripe {
  background: #fff;
  border-bottom: none;
}
.tbody-tr-stripe:nth-child(2n) {
  background: #F8F9FA;
}
.tbody-tr .td {
  white-space: wrap;
  padding:28rpx 30rpx;
  text-align: left;
}

.tbody-tr-border .td {
  /* border-right: 1rpx solid #F6F6F6; */
}
.tbody-tr-border .td:last-child {  
  border-right: none;
}
.no-data {
  display: flex;
  padding: 50rpx;
  color: #666;
  justify-content: center;
}
</style>