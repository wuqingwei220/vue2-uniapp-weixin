import request from '@/utils/request.js';
/**
 * 用户登录
 * @param data object 用户账号密码
 */
export function signin(data){
	return request.post('/sso/login', data, {
		login: false ,//权限控制，为true时候请求头里会传入token
		islogin: true, //判读是否为登录接口
	})
}
/**
 * 用户信息
*/
export function userInfo(data) {
	return request.post('/sso/info', data, {
		login: true
	})
}
/**
 * 获取短信验证码（验证码登录）
*/
export function sendSms(data) {
	return request.post('/sso/sendSms', data, {
		login: false
	})
}

/**
 * 获取旧的短信验证码
*/
export function sendChangePhone(data) {
	return request.post('/reprpack/sms/sendChangePhone', data, {
		login: false
	})
}
/**
 * 修改手机号验证旧手机号
*/
export function verifyPhone(data) {
	return request.post('/reprpack/reprpackUser/verifyPhone', data, {
		login: true
	})
}
/**
 * 修改手机号提交新手机号
*/
export function changePhone(data) {
	return request.post('/reprpack/reprpackUser/changePhone', data, {
		login: true
	})
}
/**
 * 获取用户认证信息
*/
export function getReprpackUserUserInfo(data) {
	return request.post('/reprpack/reprpackUser/getReprpackUserUserInfo', data, {
		login: true
	})
}
/**
 * 更新用户认证信息
*/
export function updateEnterpriseInfo(data) {
	return request.post('/reprpack/reprpackUser/updateEnterpriseInfo', data, {
		login: true
	})
}

/**
 * 注册、创建货主
*/
export function shipperCreate(data) {
	return request.post('/reprpack/reprpackUser/shipper/create', data, {
		login: false
	})
}