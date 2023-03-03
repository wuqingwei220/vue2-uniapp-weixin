<template>
  <view class="main">
    <NavBar mode="title" title="下单" totalBackground="#ffffff"></NavBar>
    <view class="count">
      <view class="map">
        <map
          style="width: 100%; height: 100%"
          :scale="scale"
          :latitude="latitude"
          :longitude="longitude"
          :markers="covers"
        >
        </map>
      </view>
      <view class="msg">
        <view class="rows">
          <text>地址</text>
          <!-- <input
            type="text"
            v-model="placeOrder.addressDetails"
            placeholder="请选择地址"
            :disabled="true"
            :always-embed="true"
            @click="getMapLocation"
          /> -->
          <scroll-view
            class="activeAddress"
            @click="getMapLocation"
            :scroll-x="true"
            :show-scrollbar="true"
          >
          <text v-if="placeOrder.addressDetails=='请选择地址'" style="color:#C5C5C5">
            {{ placeOrder.addressDetails }}
          </text>
          <text  v-else>
            {{ placeOrder.addressDetails }}
          </text>
          </scroll-view>
          <!-- <image class="location"  src="http://oss.juxingta.com/static/images/2022-08-16/5531b93c-bee6-43a0-8f45-19ed6761b5ff___%E5%AE%9A%E4%BD%8D%20%281%29.png"></image>  -->
        </view>
        <view class="rows">
          <text>联系人</text>
          <input
            type="text"
            v-model="placeOrder.contacts"
            placeholder-style="color:#C5C5C5"
            placeholder="请输入联系人"
          />
        </view>
        <view class="rows">
          <text>联系方式</text>
          <input
            type="number"
            v-model="placeOrder.phone"
            placeholder-style="color:#C5C5C5"
            placeholder="请输入联系方式"
          />
        </view>
        <view class="rows">
          <text>上门时间</text>
          <input
            type="text"
            v-model="hopeBeginTime"
            placeholder-style="color:#C5C5C5"
            placeholder="请选择上门时间"
            @click="dateOpen"
            :disabled="true"
          />
        </view>
        <view class="pic">
          <view>货物照片</view>
          <view>
            <view>
              <uploadimg
                v-model="beforePic"
                title="上传货物正面照"
                :max="1"
                :disable="true"
              />
            </view>
            <view>
              <uploadimg
                v-model="afterPic"
                title="上传货物侧面照"
                :max="1"
                :disable="true"
              />
            </view>
          </view>
        </view>
        <view class="btn" @click="createOrder"> 下单 </view>
      </view>
    </view>
    <van-popup
      :show="timePopup"
      @close="onClose"
      position="bottom"
      duration="500"
    >
      <van-datetime-picker
        type="datetime"
        :min-date="minDate"
        :formatter="formatter"
        @confirm="timeConfirm"
        @cancel="timeCancel"
      />
    </van-popup>
  </view>
</template>

<script>
import NavBar from "@/components/nav-bar";
import uploadimg from "@/components/upload-img";
import { required, chs_phone } from "@/utils/validate";
import { mapState } from "vuex";
import { createOrder } from "@/api/order";
import { ggTimestamp } from "@/utils/format";
// 引入SDK核心类
var QQMapWX = require("../libs/qqmap-wx-jssdk.js");
export default {
  components: {
    NavBar,
    uploadimg,
  },
  data() {
    return {
      //静态地图数据
      latitude: 39.908739,
      longitude: 116.397513,
      covers: [], //标记点用于在地图上显示标记的位置
      controls: [
        {
          //在地图上显示控件，控件不随着地图移动
          id: 1, //控件id
          iconPath:
            "http://oss.juxingta.com/static/images/2022-08-16/ef9c64c1-36e5-4909-bbf1-719de8c98320___%E5%AE%9A%E4%BD%8D.png", //显示的图标
          position: {
            //控件在地图的位置
            left: 15,
            top: 15,
            width: 50,
            height: 50,
          },
        },
      ],
      scale: 16, //地图缩放比例
      beforePic: [],
      afterPic: [],
      //下单数据
      placeOrder: {
        // 回收分类编号
        reprpackGroupNo: "",
        // 回收分类名称
        reprpackGroupName: "",
        // 详细地址
        addressDetails: "请选择地址",
        // 经度
        longitude: "",
        // 纬度
        latitude: "",
        // 联系人
        contacts: "",
        // 联系人手机号
        phone: "",
        // 上门取货时间
        pickupTime: "",
        // 货物照片集合
        goodsPics: [],
        // 下单备注
        remark: "",
      },
      // 日期插件
      minDate: new Date().getTime(),
      hopeBeginTime: "",
      timePopup: false,
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        } else if (type === "day") {
          return `${value}日`;
        } else if (type === "hour") {
          return `${value}时`;
        } else if (type === "minute") {
          return `${value}分`;
        }
        return value;
      },
    };
  },
  computed: {
    ...mapState(["userInfo", "token"]),
  },
  onShow() {
    console.log("USERINFO", this.userInfo);
  },
  onLoad() {
    // query传参
    const query = this.$Route.query;
    console.log("query", query);
    this.placeOrder.phone = this.userInfo.user.phone;
    this.placeOrder.contacts = this.userInfo.user.userName;
    this.placeOrder.reprpackGroupNo = query.reprpackGroupNo;
    this.placeOrder.reprpackGroupName = query.reprpackGroupName;

    var _this = this;
    uni.authorize({
      scope: "scope.userLocation",
      success() {
        //引入腾讯地图对象
        let qqmapsdk = new QQMapWX({
          key: "Q3SBZ-JZYCD-YTO45-PDO4R-HWXG5-QKB7X",
        });
        //成功以后获取位置信息
        uni.getLocation({
          type: "gcj02", //这里是不同的地图api支持的格式不一样，腾讯的gcj02，因为这里返回的是一个具体的经纬度，所以我们需要逆地址解析进行匹配对应的位置
          success: function (res) {
            qqmapsdk.reverseGeocoder({
              location: {
                longitude: res.longitude,
                latitude: res.latitude,
              },
              success(res) {
                console.log("2222", res);
                _this.getRegionFn(res.result);
              },
            });
          },
        });
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: "位置获取失败，部分功能不能使用,请在系统设置中打开定位服务！",
          duration: 2000,
        });
        console.info(err);
      },
    });
  },
  methods: {
    // 时间弹窗
    timeCancel() {
      this.timePopup = false;
    },
    timeConfirm(e) {
      console.log(e);
      this.hopeBeginTime = ggTimestamp(e.detail);
      this.timePopup = false;
      console.log(e.detail);
    },
    onClose() {
      this.timePopup = false;
    },
    //创建订单
    async createOrder() {
      let arr = [];
      if (this.beforePic.length > 0) {
        arr.push(this.beforePic[0]);
      }
      if (this.afterPic.length > 0) {
        arr.push(this.beforePic[0]);
      }
      this.placeOrder.goodsPics = [...arr];
      this.placeOrder.pickupTime = this.hopeBeginTime + ":00";

      let reprpackGroupNo = this.placeOrder.reprpackGroupNo;
      let reprpackGroupName = this.placeOrder.reprpackGroupName;
      let addressDetails = this.placeOrder.addressDetails;
      let contacts = this.placeOrder.contacts;
      let phone = this.placeOrder.phone;
      try {
        await this.$validator({
          reprpackGroupNo: [required(required.message("回收分类编号不能为空"))],
          reprpackGroupName: [
            required(required.message("回收分类名称不能为空")),
          ],
          addressDetails: [required(required.message("请输入地址信息"))],
          contacts: [required(required.message("请输入联系人"))],
          phone: [
            required(required.message("手机号")),
            chs_phone(chs_phone.message()),
          ],
        }).validate({
          reprpackGroupNo,
          reprpackGroupName,
          addressDetails,
          contacts,
          phone,
        });
      } catch (e) {
        uni.showToast({
          title: e.errors[0].message,
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      if (
        this.placeOrder.pickupTime == "" ||
        this.placeOrder.pickupTime == null ||
        this.placeOrder.pickupTime == undefined
      ) {
        this.$util.showToast("请选择上门时间");
        return;
      }
      if (this.placeOrder.goodsPics.length == 0) {
        this.$util.showToast("请至少上传一张货物照片");
        return;
      }
      if(contacts.length>20){
        this.$util.showToast("联系人可输入最大字符为20个");
        return;
      }
      createOrder(this.placeOrder)
        .then((res) => {
          if (res.data.code == 200) {
            uni.setStorageSync("id", -1);
            this.$Router.pushTab({
              path: "/pages/order/index",
            });
          } else {
            this.$util.showToast(res.data.data.message);
          }
        })
        .catch((err) => {
          this.$util.showToast(err.data.message);
        });
    },
    //开启选择时间弹窗
    dateOpen(key, date) {
      this.timePopup = true;
    },
    getRegionFn(option) {
      // 静态地图赋值
      this.latitude = option.latitude || option.location.lat;
      this.longitude = option.longitude || option.location.lng;
      this.covers = [
        {
          latitude: option.latitude || option.location.lat,
          longitude: option.longitude || option.location.lng,
          iconPath:
            "http://oss.juxingta.com/static/images/2022-08-16/ef9c64c1-36e5-4909-bbf1-719de8c98320___%E5%AE%9A%E4%BD%8D.png", //地图上的图标
          width: 25, //宽
          height: 25, //高
          callout: {
            //自定义标记点上方的气泡窗口 点击有效
            content: option.address, //文本
            color: "#ffffff", //文字颜色
            fontSize: 14, //文本大小
            borderRadius: 2, //边框圆角
            bgColor: "#00c16f", //背景颜色
            display: "ALWAYS", //常显
            padding: 5, //气泡窗口的内间距
          },
        },
      ];
      // 下单数据赋值
      // 详细地址
      this.placeOrder.addressDetails = option.address;
      // 经
      this.placeOrder.longitude = option.longitude || option.location.lng;
      // 纬度
      this.placeOrder.latitude = option.latitude || option.location.lat;
    },
    // 位置授权
    getMapLocation() {
      uni.chooseLocation({
        success: (res) => {
          console.log(res);
          this.getRegionFn(res);
        },
        fail: () => {
          // 如果用uni.chooseLocation没有获取到地理位置，则需要获取当前的授权信息，判断是否有地理授权信息
          uni.getSetting({
            success: (res) => {
              console.log(res);
              var status = res.authSetting;
              if (!status["scope.userLocation"]) {
                // 如果授权信息中没有地理位置的授权，则需要弹窗提示用户需要授权地理信息
                uni.showModal({
                  title: "是否授权当前位置",
                  content:
                    "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                  success: (tip) => {
                    if (tip.confirm) {
                      // 如果用户同意授权地理信息，则打开授权设置页面，判断用户的操作
                      uni.openSetting({
                        success: (data) => {
                          // 如果用户授权了地理信息在，则提示授权成功
                          if (data.authSetting["scope.userLocation"] === true) {
                            uni.showToast({
                              title: "授权成功",
                              icon: "success",
                              duration: 1000,
                            });
                            // 授权成功后，然后再次chooseLocation获取信息
                            uni.chooseLocation({
                              success: (res) => {
                                console.log("详细地址", res);
                                this.getRegionFn(res);
                              },
                            });
                          } else {
                            uni.showToast({
                              title: "授权失败",
                              icon: "none",
                              duration: 1000,
                            });
                          }
                        },
                      });
                    }
                  },
                });
              }
            },
            fail: (res) => {
              uni.showToast({
                title: "调用授权窗口失败",
                icon: "none",
                duration: 1000,
              });
            },
          });
        },
      });
    },
  },
  mounted() {
    // this.getMapLocation()
  },
};
</script>


<style lang="less" scoped>
  /deep/::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
    background: transparent;
}
/deep/ .del-icon {
  right: -10rpx !important;
  top: -10rpx !important;
}
/deep/ .add-icon {
    width: 50rpx !important;
    height: 50rpx !important;
}
.activeAddress{
  font-size: 28rpx;
  font-family: "PingFang SC-常规体", "PingFang SC";
  font-weight: normal;
  color: #3d3d3d;
  width: 517rpx !important;
  // overflow-x: auto;
  // display: flex;
  // flex-wrap: nowrap;
  white-space: nowrap;
  text-align: left;
}
.count {
  .map {
    height: 598rpx;
    background: #eee;
  }
  .msg {
    background: #fafafa;
    opacity: 1;
    padding: 40rpx 30rpx 60rpx 30rpx;
    .location {
      width: 50rpx;
      height: 50rpx;
      margin-left: auto;
    }
    .rows {
      display: flex;
      align-items: center;
      // padding-bottom: 46rpx;
      height: 86rpx;
      border-bottom: 1px solid #F3F3F3;

      text {
        display: inline-block;
        width: 170rpx;
        text-align: left;
        font-size: 28rpx;
        font-family: "PingFang SC-常规体", "PingFang SC";
        font-weight: normal;
        color: #3d3d3d;
        display: inline-block;
      }
      input {
        font-size: 28rpx;
        font-family: "PingFang SC-常规体", "PingFang SC";
        font-weight: normal;
        color: #3d3d3d;
        // width: 80%;
        text-align: left;
        width: 60%;
      }
    }
    .pic {
      & > view:nth-child(1) {
        font-size: 28rpx;
        font-family: "PingFang SC-常规体", "PingFang SC";
        font-weight: normal;
        color: #3d3d3d;
        margin-bottom: 24rpx;
        margin-top: 22rpx;
      }
      & > view:nth-child(2) {
        display: flex;
        justify-content: flex-start;

        & > view:nth-child(1) {
          margin-right: 20rpx;
        }
      }
    }
    .btn {
      height: 76rpx;
      background: #c2f21f;
      border-radius: 48rpx;
      opacity: 1;
      font-size: 28rpx;
      font-family: "PingFang SC-中黑体", "PingFang SC";
      font-weight: normal;
      color: #1a1a1a;
      text-align: center;
      line-height: 76rpx;
      margin-top: 56rpx;
    }
  }
}
</style>