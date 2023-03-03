<template>
  <view>
    <NavBar title="企业认证" totalBackground="#fff"></NavBar>
    <view class="count" v-if="!isCertified">
      <view>
        <text> 企业名称 </text>
        <input
          type="text"
          v-model="expressName"
          placeholder="请填写企业名称"
          placeholder-style="color:#BFBFBF;font-size:28rpx"
        />
      </view>
      <view>
        <text> 营业执照 </text>
        <text> 请上传您的有效证件信息 </text>
      </view>
    </view>
    <view class="count" v-else>
      <view>
        <text> 企业名称 </text>
        <input
          type="text"
          style="text-align: right; flex: 1"
          v-model="expressName"
          placeholder="请填写企业名称"
          placeholder-style="color:#BFBFBF;font-size:28rpx"
        />
      </view>
      <view>
        <image
          class="do-img"
          src="http://oss.juxingta.com/static/images/2022-08-25/928a7fc3-b6f5-493a-ba0b-26b647c82997___%E7%BB%84%2035%402x.png"
        ></image>
      </view>
    </view>
        <view class="footer" :class="[isCertified ? 'business' : '']">
         <view>
            <uploadimg
            v-model="business"
            title="上传营业执照照片"
            :max="1"
            addIcon="http://oss.juxingta.com/static/images/2022-08-24/66045b53-95cf-40ef-b625-287ba7bcf45a___%E7%BC%96%E7%BB%84%402x%20%281%29.png"
            :disable="true"
            />
         </view>
         <view @click="updateEnterpriseInfoMsg"> 提交 </view>
        </view>
  </view>
</template>

<script>
import NavBar from "@/components/nav-bar";
import uploadimg from "@/components/upload-img";
import {updateEnterpriseInfo} from '@/api/user';
import { mapState } from "vuex";
import {handleGetUserInfo} from '@/utils/all-request'
export default {
  components: {
    NavBar,
    uploadimg,
  },
  data() {
    return {
      // 营业执照
      business: [],
      // 企业名称
      expressName: "",
      // 是否认证
      isCertified: false,
    };
  },
  computed:{
    ...mapState(['userInfo'])
  },
  onLoad(){
    var query = this.$Route.query;
    this.isCertified=query.isCertified;
    this.expressName=query.name;
    this.business=query.pic3;
  },
  methods:{
    updateEnterpriseInfoMsg(){
        let {expressName,business} = this;
        if(expressName=='' || expressName==null || expressName=='undefined'){
            this.$util.showToast("企业名称不能为空！")
            return ;
        }
        console.log(this.business)
        if(business.length==0){
            this.$util.showToast("请上传营业执照！")
            return ;
        }
        var postData={
            id:this.userInfo.user.id,
            name:this.expressName,
            pic3:this.business[0],
            userType:'shipper'
        }
        updateEnterpriseInfo(postData).then(res=>{
            if(res.data.code==200){
                this.$util.showToast('企业信息提交成功!')
                handleGetUserInfo(null)
                setTimeout(()=>{
                    this.$Router.pushTab({
                        path:"/pages/user/index"
                    })
                },1000)                

            }else{
               this.$util.showToast(res.data.data.message)
            }
        }).catch(err=>{
            this.$util.showToast(err.data.message)
        })
    }
  }

};
</script>
<style>
page {
  background: #f2f3f5;
}
</style>
<style lang="less" scoped>
/deep/ .add-btn {
  width: 668rpx !important;
  height: 415rpx !important;
  border: 2px dashed #e1dfdf !important;
}
/deep/ .uploadimg-box {
  justify-content: center;
}
/deep/ .upload-title {
  font-size: 32rpx !important;
  font-weight: normal !important;
  color: #a09c9c !important;
  padding-top: 34rpx;
}
/deep/ .add-btn .add-icon {
  width: 54rpx !important;
  height: 54rpx !important;
}
/deep/ .img {
  width: 668rpx !important;
  height: 415rpx !important;
}
/deep/ .del-icon {
    right: -17rpx !important;
    top: -17rpx !important;
}
.do-img {
  width: 144rpx;
  height: 50rpx;
  margin-top: 50rpx;
}
.business {
  margin-top: 0 !important;
}
.count {
  padding: 30rpx 30rpx 0 30rpx;
  background: #fff;
  & > view:nth-child(1) {
    border-bottom: 1px solid #e1e1e1;
  }
  & > view {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 98rpx;
    line-height: 98rpx;
    & > text:nth-child(1) {
      width: 170rpx;
      text-align: left;
      font-size: 28rpx;
      font-weight: normal;
      color: #333333;
    }
    & > text:nth-child(2) {
      font-size: 28rpx;
      font-weight: normal;
      color: #bfbfbf;
    }
    input {
      font-size: 28rpx;
      font-weight: normal;
      color: #333333;
      font-family: " PingFang SC-中黑体", PingFang SC;
    }
  }
}
.footer {
  height: calc(100vh - 235rpx);
  margin-top: 16rpx;
  overflow: hidden;
  background: #fff;
  & > view:nth-child(1) {
    text-align: center;
    margin: 72rpx auto 0;
  }
  & > view:nth-child(2) {
    height: 81rpx;
    background: #c2f21f;
    border-radius: 300rpx;
    opacity: 1;
    line-height: 81rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: normal;
    color: #000000;
    position: fixed;
    bottom: 106rpx;
    left: 0;
    right: 0;
    margin: 0 30rpx;
  }
}
</style>