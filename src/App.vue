<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function(res){
				// 请求完新版本信息的回调
				console.log(res)
				console.log(res.hasUpdate)
			})
			//下载新版本
			updateManager.onUpdateReady(function(){
				uni.showModal({
					title: '更新提示',
					content: '新版本已准备好，是否重启应用？',
					success(res) {
						if(res.confirm) {
							//重启应用
							updateManager.applyUpdate()
						}
					}
				})
			})

			//新版本下载失败
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新的版本了哟～',
					content:'新版本已经上线啦～，请您删除当前小程序，重新搜索打开哟～'
				})
			})
			// 加载特殊字体
			uni.loadFontFace({
				family: 'Bitstream',
				global:true,
				source: 'url("https://oss.juxingta.com/static/images/2022-09-02/45d80751-9481-408a-a7a3-d48f465b898b___hanti.ttf")',
				success() {
					console.log('success 字体1')
				}
			})
			uni.loadFontFace({
				family: 'DINCondensedBold',
				global:true,
				source: 'url("https://oss.juxingta.com/static/images/2022-09-02/d434c681-6e03-4971-ab20-23f9fb37b973___DINCondensedBold.ttf")',
				success() {
					console.log('success 字体2')
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="less">
	@import "./wxcomponents/vant/dist/common/index.wxss";
</style>