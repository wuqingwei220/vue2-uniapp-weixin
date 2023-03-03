<template>
  <view>
    <view class="header">
      <NavBar
        title="登陆"
        titleSize="34"
        titleColor="#000000"
        :showBack="true"
    ></NavBar>
    </view>
    <view class="addAddress_wrap">
      <view class="register_logwrap">
        <view class="register_logcont">
          <image
            src="http://oss.juxingta.com/static/images/2022-08-15/7e024788-d006-4db4-8f0f-8fd67063d7fe___%E7%BC%96%E7%BB%84%2011%402x.png"
          ></image>
		   <image
            src="http://oss.juxingta.com/static/images/2022-08-15/db67719b-7428-466a-9526-8941b7c55fd3___%E7%BB%84%208%402x.png"
          ></image>
        </view>
      </view>
      <view class="register_down register_down_verlogin">
        <view class="addAddress_items">
          <view class="addAddress_item">
            <view class="decration">+86</view>
            <view class="addAddress_iright">
              <input
                type="number"
                placeholder-style="color:#C3C4C7;font-size:28rpx;font-weight: normal"
                placeholder="请输入你的手机号码"
                v-model="userAddress.phone"
              />
            </view>
          </view>
        </view>
        <view class="addAddress_items">
          <view class="addAddress_item">
            <view class="decration">验证码</view>
            <view class="addAddress_yzmleft">
              <input
                type="number"
                placeholder-style="color:#C3C4C7;font-size:28rpx;font-weight: normal"
                placeholder="请输入验证码"
                v-model="userAddress.verificationCode"
              />
            </view>
            <view class="addAddress_yzmright">
              <button
                class="code-btn"
                :disabled="disabled"
				style="color:#333333"
                @click="getVerificationCode"
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
    </view>
    <view class="verlogin_wrap">
      <view class="verlogin_wleft">
        <image
          class="tick"
          v-if="tips"
          src="http://oss.juxingta.com/static/images/2022-08-12/ea015f57-22be-4516-8083-042ff5b9c9a9___%E7%BB%84%207%402x.png"
        ></image>
        <view class="verlogin_wlview">
          <van-checkbox
            icon-size="28rpx"
            checked-color="#BBF100"
            icon-class="iocn"
            :value="agreeChecked"
            @change="agree"
          ></van-checkbox>
        </view>
      </view>
      <view class="verlogin_wright"
        >我已阅读并同意<text  @click="privacy">《用户协议》</text><text @click="agreement">《隐私协议》</text></view
      >
    </view>
    <view class="login-btn">
      <view class="btn-submit" v-if="allInput" @click.stop="onSubmit">
        登录
      </view>
      <view class="btn" v-else> 登录 </view>
      <view class="changePw">
        <text @click="passWord">账号密码登陆</text>
        <text @click="reg">注册账号</text>
      </view>
    </view>
  </view>
</template>


<script>
import {signin,sendSms} from '@/api/user'
import {handleGetUserInfo} from '@/utils/all-request'
import NavBar from "@/components/nav-bar";
import { required, chs_phone } from "@/utils/validate";
export default {
  components: { NavBar },
  data() {
    return {
      btntxt: "获取验证码",
      userAddress: { phone: "", verificationCode: "" },
      //协议
      agreeChecked: false,
	  //勾选协议图片状态   
      tips: false,
	  //手机号输入是否正确
	  ifCode:false,
	  //倒计时毫秒数   
	  seconds:60   
    };
  },
  watch:{
	deep:true,
	'userAddress.phone':async function(newVal,oldVal){
	   try {
        await this.$validator({
          newVal: [
            required(required.message("手机号")),
            chs_phone(chs_phone.message()),
          ],
        }).validate({ newVal });
       } catch (e) {
        this.ifCode=false;
        return false;
      }
	  this.ifCode=true
	  console.log("userAddress.phone",newVal)
	}
  },
  computed: {
    allInput() {
      if (this.userAddress.phone && this.userAddress.verificationCode) {
        return true;
      } else {
        return false;
      }
    },
  },
  onLoad(){
    if(this.$Route.query.phone){
      let phone=this.$Route.query.phone;
      this.userAddress.phone=phone;
    }
  },
  methods: {
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
    reg() {
      this.$Router.push({
        path: "/pagesA/reg/index",
      });
    },
    //  跳转账号密码登陆
    passWord() {
      this.$Router.push({
        path: "/pagesA/login/pass-word",
      });
    },
    // 勾选隐私协议
    agree(event) {
      this.agreeChecked = event.detail;
    },
    // 获取验证码
    async getVerificationCode() {
      let phone = this.userAddress.phone;
      try {
        await this.$validator({
          phone: [
            required(required.message("手机号")),
            chs_phone(chs_phone.message()),
          ],
        }).validate({ phone });
      } catch (e) {
        uni.showToast({
          title: e.errors[0].message,
          icon: "none",
          duration: 2000,
        });
        return false;
      }

      const timer = setInterval(() => {
        this.btntxt = this.seconds + "秒再试";
        this.seconds--;
        this.disabled = true;
        if (this.seconds === 0) {
          clearInterval(timer);
          this.btntxt = "获取验证码";
          this.seconds = 60;
          this.disabled = false;
        }
      }, 1000);

      let postData = {
          phone
      };
      sendSms(postData)
        .then((res) => {
          if (res.data.code == 200) {
            this.$util.showToast("验证码已发送");
          }
          console.log(res);
        })
        .catch((err) => {
          uni.showToast({
            title: err.msg,
            icon: "none",
            duration: 2000,
          });
        });
    },
    sendRegister() {
      try {
        let _this = this;
        let phone = _this.userAddress.phone, //联系电话
          verificationCode = _this.userAddress.verificationCode;
        let postData = {
          username: phone,
          code: verificationCode,
          phone,
          appId: "reprpack-app",
        };
        console.log(postData);
        uni.showLoading({
          title: "数据加载中....",
        });
        signin(postData)
          .then((res) => {
            console.log("请求成功");
            let getToken = res.headers.token;
            _this.$store.commit("login", getToken[0], null);
            let getAuthor = res.data.data.token;
            _this.$store.commit("author", getAuthor, null);
            _this.$store.commit("setAuthorPhone", phone, null);
            handleGetUserInfo();
            uni.hideLoading();
          }).catch((loginerror) => {
            uni.hideLoading();
            uni.showToast({
              title:loginerror.msg ||
                loginerror.response.data.msg ||
                loginerror.response.data.message,
              icon: "none",
              duration: 2000,
            });
          });
      } catch (err) {
        uni.hideLoading();
        uni.showToast({
          title: err.msg || err.response.data.msg || err.response.data.message,
          icon: "none",
          duration: 2000,
        });
      }
    },
    async onSubmit() {
      let phone = this.userAddress.phone,
        verificationCode = this.userAddress.verificationCode;
      //是否勾选哟用户协议
      if (!this.agreeChecked) {
        this.tips = true;
        return;
      }
      try {
        await this.$validator({
          phone: [
            required(required.message("联系电话")),
            chs_phone(chs_phone.message()),
          ],
          verificationCode: [required(required.message("验证码"))],
        }).validate({ phone, verificationCode });
      } catch (e) {
        uni.showToast({
          title: e.errors[0].message,
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      this.sendRegister();
    },
  },
};
</script>

<style lang="less" scoped>
.header{
  background: linear-gradient(180deg, rgba(194,242,31,0.5) 0%, rgba(255,255,255,0.03) 100%, rgba(255,255,255,0.03) 100%);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
}  
.btn-submit {
  font-size: 28rpx;
  font-weight: normal;
  color: #c2f21f;
  text-align: center;
  height: 96rpx;
  background: #000000;
  border-radius: 48px 48px 48px 48px;
  opacity: 1;
  line-height: 96rpx;
  margin-bottom: 20rpx;
}
button::after {
  border: none;
}
.tick {
  width: 210rpx;
  height: 50.28rpx;
  position: absolute;
  top: -12rpx;
}
/deep/ .van-checkbox__icon--checked {
  color: #151515;
}
.code-btn {
  font-size: 26rpx;
  font-weight: normal;
  color: #c3c4c7;
  background: none;
  outline: 0 none !important;
  padding-left: 0;
  padding-right: 0;
  margin: 0;
}
.decration {
  font-size: 28rpx;
  font-family: PingFang, PingFang SC;
  font-weight: normal;
  color: #333333;
  font-weight: 600;
  width: 102rpx;
  text-align: left;
}
.addAddress_wrap {
  width: 100%;
  height: auto;
}
.addAddress_items {
  width: 100%;
  height: 108rpx;
  border-bottom: 1px solid #e6e6ef;
}
.addAddress_item {
  width: 100%;
  height: 108rpx;
  display: flex;
  line-height: 108rpx;
}
.addAddress_ileft {
  width: 20%;
  height: 108rpx;
  float: left;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #7a7a7a;
  line-height: 108rpx;
  position: relative;
}
.addAddress_ileft text {
  position: absolute;
  left: -16rpx;
  color: #ff0000;
}
.addAddress_iright {
  width: 80%;
  height: 108rpx;
  float: left;
  position: relative;
}
.addAddress_iright input {
  display: block;
  width: 100%;
  height: 108rpx;
  border: none;
  outline: none;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: normal;
  text-align: left;
  color: #000;
  line-height: 108rpx;
  // font-weight: 600;
}
.addAddress_irmask {
  width: 100%;
  height: 108rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
}
.addAddress_irmask text {
  width: 100%;
  display: block;
  height: 108rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 100rpx;
}
.addAddress_solid {
  border: none;
}
.address_footer {
  width: 100%;
  height: auto;
  background: #f0f0f0;
  padding: 30rpx 20rpx 37rpx 20rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
}
.register_down {
  height: auto;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 27rpx;
  padding: 0 50rpx 0 50rpx;
}
.register_top {
  width: 94.667%;
  height: auto;
  margin: 20rpx auto 0 auto;
  background: #ffffff;
  box-sizing: border-box;
  padding: 32rpx 34rpx;
  border-radius: 27rpx;
}
.register_ttitle {
  width: 100%;
  height: 68rpx;
  box-sizing: border-box;
  padding-bottom: 18rpx;
  font-size: 36rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #000000;
  line-height: 50rpx;
}
.register_ttitle text {
  color: #ff0000;
}
.register_banner {
  width: 100%;
  height: 296rpx;
  border-radius: 20rpx;
  position: relative;
}
.register_banner_down {
  width: 100%;
  height: 296rpx;
}
.register_banner_down image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.register_banner_up {
  width: 100%;
  height: 296rpx;
  position: absolute;
  left: 0;
  top: 0;
}
.register_bupimg {
  width: 100%;
  height: 296rpx;
  position: relative;
}
.register_bupimg image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.register_bupmask {
  width: 100%;
  height: 296rpx;
  background: rgba(102, 102, 102, 0.6);
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 20rpx;
}
.help_down {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding-top: 20rpx;
}
.help_downview {
  width: 100%;
  height: auto;
}
.help_downcont {
  width: 100%;
  height: auto;
}
.goodsDet_tatitle {
  width: 100%;
  height: 58rpx;
}
.goodsDet_taticon {
  width: 14rpx;
  height: 48rpx;
  display: flex;
  justify-content: start;
  align-items: center;
  float: left;
}
.goodsDet_taticon_dv {
  width: 5rpx;
  height: 30rpx;
  background: linear-gradient(180deg, #1777ff, #ffffff);
}
.goodsDet_tatname {
  width: 200rpx;
  height: 48rpx;
  font-size: 30rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #292929;
  line-height: 48rpx;
  float: left;
}
.upload_wrap {
  width: 100%;
  height: auto;
}
.upload_title {
  width: 100%;
  height: 92rpx;
  box-sizing: border-box;
  padding: 27rpx 0 16rpx 0;
  font-size: 35rpx;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  text-align: center;
  color: #242424;
  line-height: 49rpx;
}
.upload_demo {
  width: 100%;
  height: 498rpx;
  box-sizing: border-box;
  padding: 0 30rpx;
}
.upload_demo image {
  display: block;
  width: 100%;
  height: 100%;
}
.upload_message {
  width: 100%;
  padding: 30rpx 30rpx 75rpx 30rpx;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Semibold;
  text-align: center;
  color: #333333;
  line-height: 32rpx;
}
.upload_btns {
  width: 100%;
  height: 135rpx;
  box-sizing: border-box;
  padding: 0 20rpx 55rpx 20rpx;
  position: relative;
}
.upload_btn {
  width: 100%;
  height: 80rpx;
}
.register_bupmleft {
  width: 50%;
  height: 296rpx;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.register_bupmright {
  width: 50%;
  height: 296rpx;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
.register_bupmview {
  width: 50rpx;
  height: 50rpx;
}
.register_bupmview image {
  display: block;
  width: 100%;
  height: 100%;
}
.interest_wrap {
  width: 100%;
  height: auto;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
}
.interest_title {
  width: 100%;
  height: auto;
  padding: 125rpx 0 110rpx 0;
  font-size: 29rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3b3b3b;
  line-height: 41rpx;
}
.interest_list {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 30rpx;
}
.interest_list:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.interest_items {
  width: 33.333%;
  height: 210rpx;
  float: left;
}
.interest_item {
  width: 175rpx;
  height: 175rpx;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1rpx solid #ffffff;
  border-radius: 40rpx;
}
.interest_item_top {
  width: 100%;
  height: 115rpx;
  box-sizing: border-box;
  padding: 12rpx 37rpx 0 37rpx;
}
.interest_item_icon {
  width: 100rpx;
  height: 100rpx;
  background: #d8d8d8;
  box-sizing: border-box;
  border: 1px solid #979797;
  border-radius: 50%;
}
.interest_item_text {
  width: 100%;
  font-size: 29rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3b3b3b;
  line-height: 60rpx;
}
.interest_item_active {
  box-sizing: border-box;
  border: 1rpx solid #3e90ff;
  border-radius: 40rpx;
}
.interest_btns {
  width: 100%;
  height: 140rpx;
  box-sizing: border-box;
  padding: 40rpx 20rpx 0 20rpx;
}
.interest_btndown {
  width: 100%;
  height: 100rpx;
  font-size: 32rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #3e90ff;
  line-height: 100rpx;
}
.address_footer {
  width: 100%;
  height: auto;
  background: #ffffff;
  padding: 30rpx 60rpx 37rpx 60rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}
.address_fleft {
  width: 300rpx;
  height: 90rpx;
}
.address_fright {
  width: 300rpx;
  height: 90rpx;
}
.register_logwrap {
  width: 100%;
  height: 280rpx;
  box-sizing: border-box;
  padding-top: 132rpx;
  margin-bottom: 132rpx;
}
.register_logcont {
  background: #ffffff;
  display: flex;
  flex-direction: column;
}
.register_logcont image:nth-child(1) {
  width: 136rpx;
  height: 136rpx;
  margin: 0 auto;
}
.register_logcont image:nth-child(2) {
  width: 396rpx;
  height: 66rpx;
  margin: 24rpx auto 0;
}
.addAddress_yzmleft {
  height: 108rpx;
  float: left;
}
.addAddress_yzmleft input {
  display: block;
  width: 100%;
  height: 108rpx;
  border: none;
  outline: none;
  font-size: 28rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  line-height: 108rpx;
  color: #000;
  // font-weight: 600;
  font-weight: normal;
}
.addAddress_yzmright {
  height: 108rpx;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}
.yzmbtns {
  width: 100%;
  height: 108rpx;
  display: block;
  height: 40rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3488ff;
  line-height: 40rpx;
  border: none;
  color: #3488ff;
}
.addAddress_ilpsd {
  display: flex;
  justify-content: center;
  align-items: center;
}
.addAddress_ilview {
  width: 38rpx;
  height: 38rpx;
}
.addAddress_ilview image {
  display: block;
  width: 38rpx;
  height: 38rpx;
}
.register_footer {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 30rpx;
}
.register_down_verlogin {
  margin-bottom: 55rpx;
}
.verlogin_wrap {
  width: 100%;
  // height: 103rpx;
  box-sizing: border-box;
  // padding: 0 30rpx;
  display: flex;
  justify-content: center;
}
.verlogin_wleft {
  width: 30rpx;
  height: 103rpx;
  display: flex;
  align-items: center;
  position: relative;
}
.verlogin_wlview {
  width: 30rpx;
  height: 30rpx;
  display: flex;
  align-items: center;
}
.verlogin_wright {
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #a09f9d;
  line-height: 103rpx;
  padding-left: 7rpx;
}
.verlogin_wright text {
  font-size: 24rpx;
  font-weight: normal;
  color: #666666;
}
.verlogin_divider_wrap {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 30rpx;
}
.verlogin_divider_top {
  width: 100%;
  padding-top: 150rpx;
}
.verlogin_divider_down {
  width: 47%;
  height: auto;
  padding-top: 42rpx;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.verlogin_divider_ditems {
  width: 50%;
  height: auto;
}
.verlogin_divider_ditem_icon {
  width: 100%;
  height: 89rpx;
  display: flex;
  justify-content: center;
}
.verlogin_divider_ditem_icon image {
  display: block;
  width: 80rpx;
  height: 80rpx;
}
.verlogin_divider_ditem_text {
  width: 100%;
  height: 33rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #b0b0b0;
  line-height: 33rpx;
  text-align: center;
}
.login-btn {
  margin-top: 46rpx;
  padding: 0 25rpx 0 25rpx;
  box-sizing: border-box;
  .btn {
    height: 96rpx;
    background: #ebebf2;
    border-radius: 24px 24px 24px 24px;
    opacity: 1;
    font-size: 28rpx;
    font-weight: normal;
    color: #8a8a93;
    line-height: 96rpx;
    text-align: center;
    margin-bottom: 20rpx;
  }
  .changePw {
    display: flex;
    flex-direction: row;
    // justify-content: flex-end;
    justify-content: space-between;
    font-size: 24rpx;
    font-weight: normal;
    color: #666666;
  }
}
</style>