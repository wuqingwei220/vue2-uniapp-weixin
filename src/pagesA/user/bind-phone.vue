<template>
  <view>
    <NavBar title="修改手机号" totalBackground="#fff"></NavBar>
    <view style="background: #fff; overflow: hidden">
      <view class="count">
        <view class="rows">
          <text> 手机号 </text>
          <input
            type="text"
            placeholder="请输入新绑定的手机号"
            placeholder-style="color:#BFBFBF;font-size:28rpx"
            v-model="phone"
            class="input-phone"
          />
        </view>
        <view class="rows">
          <text> 验证码 </text>
          <input
            type="number"
            placeholder="请输入验证码"
            class="input-phone"
            v-model="code"
            placeholder-style="color:#BFBFBF;font-size:28rpx"
          />
          <view class="addAddress_yzmright">
            <button
              class="code-btn"
              style="color: #333333"
              @click="getVerificationCode"
              :disabled="disabled"
              v-if="ifCode"
            >
              {{ btntxt }}
            </button>
            <button class="code-btn" :disabled="disabled" v-else>
              {{ btntxt }}
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="footer" @click="submit"> 提交 </view>
  </view>
</template>
<script>
import NavBar from "@/components/nav-bar";
import { sendChangePhone, changePhone } from "@/api/user";
import { required, chs_phone } from "@/utils/validate";
import { mapState,mapMutations } from "vuex";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      ifCode: false,
      btntxt: "获取验证码",
      phone: "",
      seconds: 60,
      code: "",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  watch: {
    deep: true,
    async phone(newVal, oldVal) {
      try {
        await this.$validator({
          newVal: [
            required(required.message("手机号")),
            chs_phone(chs_phone.message()),
          ],
        }).validate({ newVal });
      } catch (e) {
        this.ifCode = false;
        return false;
      }
      if(this.userInfo.user.phone==newVal){
        this.$util.showToast("新绑定手机号不能和当前账号一致！")
        this.ifCode=false;
      }else{
         this.ifCode = true;
      }
      console.log("userAddress.phone", newVal);
    },
  },
  methods: {
    ...mapMutations(['logout']),
    // 获取验证码
    async getVerificationCode() {
      let phone = this.phone;
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
      let postData = {
        phone: this.phone,
      };
      sendChangePhone(postData)
        .then((res) => {
          if (res.data.code == 200) {
            this.$util.showToast("验证码已发送");
            const timer = setInterval(() => {
              this.btntxt = this.seconds + "秒再试";
              this.seconds--;
              this.disabled = true;
              this.ifCode = false;
              if (this.seconds === 0) {
                clearInterval(timer);
                this.btntxt = "获取验证码";
                this.seconds = 60;
                this.disabled = false;
                this.ifCode = true;
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
    // 确定
    async submit() {
      var phone = this.phone,
        code = this.code;
      try {
        await this.$validator({
          phone: [
            required(required.message("联系电话")),
            chs_phone(chs_phone.message()),
          ],
          code: [required(required.message("验证码"))],
        }).validate({ phone, code });
      } catch (e) {
        uni.showToast({
          title: e.errors[0].message,
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      let postData = {
        userId: this.userInfo.user.id,
        phone,
        code,
        userType:'shipper'
      };
      var _this = this;
      uni.showModal({
        title: "提示",
        content: "修改手机号,需要重新登录？",
        success: function (res) {
          if (res.confirm) {
            changePhone(postData)
              .then((res) => {
                if (res.data.code == 200) {
                  _this.logout();
                }
                console.log("校验验证码", res.data.data);
              })
              .catch((err) => {
                uni.showToast({
                  title: err.msg,
                  icon: "none",
                  duration: 2000,
                });
              });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>
<style>
page {
  background: #f2f3f5;
}
</style>
<style lang="less" scoped>
button::after {
  border: none;
}
.count {
  background: #fff;
  padding: 20rpx 30rpx 0 30rpx;
  border-top: 1px solid #f2f3f5;
  margin-top: 20rpx;
  & > .rows:nth-child(1) {
    border-bottom: 1px solid #e1e1e1;
  }
  .rows {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 98rpx;
    line-height: 98rpx;
    & > text:nth-child(1) {
      font-size: 28rpx;
      font-weight: normal;
      color: #333333;
      width: 170rpx;
      text-align: left;
    }
    .input-phone {
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
  }
}
.footer {
  position: fixed;
  bottom: 104rpx;
  text-align: center;
  height: 81rpx;
  background: #c2f21f;
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