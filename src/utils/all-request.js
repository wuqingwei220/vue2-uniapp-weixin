import store from "@/store";
import cookie from "@/utils/cookie";
import {userInfo} from "@/api/user";
// 退出登录
export const handleLoginFailure = () => {
	console.log('————————')
	console.log('退出登录，标记当前页面为授权页面，防止多次跳转')
	console.log('————————')

	store.commit("logout");

	//token失效
	uni.reLaunch({
		url: '/pages/home/index',
	})
}

// 获取用户信息
export const handleGetUserInfo = (toHomePage = true) => {
	return new Promise((resolve) => {
		userInfo().then(res => {
			console.log('获取用户信息',res)
			let getData = res.data;
			if(getData.data){
				store.dispatch('setUserInfo', getData.data);
				if(toHomePage==null){
					// 企业认证 ，返回不跳转页面
					return;
				}		
				if(toHomePage) {
					let redirect = cookie.get('redirect').replace(/\ /g, '');
					if(redirect) {
						reLaunch({
							url: redirect,
						});
						return
					}
					uni.reLaunch({
						url: '/pages/home/index',
					})
				}else{
					uni.reLaunch({
						url: '/pages/home/index',
					})
				}
				resolve(getData.data)

			} else {
				uni.showToast({
					title: '账号错误，换账号重新登录',
					icon: "none",
					duration: 2000,
					success: function() {
						setTimeout(function() {
							handleLoginFailure()
						}, 1500);
					}
				})
			}

		})
	})
}