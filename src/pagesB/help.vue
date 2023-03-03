    <template>
       <view>
        <view class="header">
            <NavBar
            title="帮助"
            titleSize="34"
            titleColor="#000000"
            :showBack="true"
            ></NavBar>
       </view>
       <video id="myVideo" src="https://oss.juxingta.com/static/images/2022-09-06/25729362-88ad-4608-90f5-d1729fcbd7a6___20220906-102913.mp4"
                    @error="videoErrorCallback"   controls></video>
    </view>
    </template>
    
    <script>
      import NavBar from "@/components/nav-bar";
      export default {
        components: { NavBar },
        data(){
            return {

            }
        },
        onReady: function(res) {
        // #ifndef MP-ALIPAY
            this.videoContext = uni.createVideoContext('myVideo')
            // #endif
        },
        methods:{
         videoErrorCallback: function(e) {
            uni.showModal({
                content: e.target.errMsg,
                showCancel: false
            })
        },
        }
      }
    
 
    </script>
    
    <style lang="less" scoped>
     .header{
        background: linear-gradient(180deg, rgba(194,242,31,0.5) 0%, rgba(255,255,255,0.03) 100%, rgba(255,255,255,0.03) 100%);
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
     }  
     #myVideo{
        margin-top: 100rpx;
        width: 100%;
     }
    </style>