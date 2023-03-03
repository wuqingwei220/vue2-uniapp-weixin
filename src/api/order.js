import request from '@/utils/request.js';

/**
 * 下单
*/
export function createOrder(data) {
	return request.post('/reprpack/reprpackOrder/createOrder', data, {
		login: true
	})
}

/**
 * 订单列表
*/
export function reprpackOrderList(data) {
	return request.get('/reprpack/reprpackOrder/query', data, {
		login: true
	})
}



/**
 * 订单确认
*/
export function orderConfirm(data) {
	return request.post('/reprpack/reprpackOrder/orderShipperConfirm', data, {
		login: true
	})
}


/**
 * 订单详情
*/
export function orderInfo(data) {
	return request.get('/reprpack/reprpackOrder/orderInfo', data, {
		login: true
	})
}
/**
 * 订单取消
*/
export function orderCancel(data) {
	return request.post('/reprpack/reprpackOrder/orderCancel', data, {
		login: true
	})
}
/**
 * 问题反馈
*/
export function orderFeedback(data) {
	return request.post('/reprpack/reprpackOrder/orderFeedback', data, {
		login: true
	})
}
/**
 * 订单数量(角标)
*/
export function orderCount(data) {
	return request.get('/reprpack/reprpackOrder/orderCount', data, {
		login: true
	})
}