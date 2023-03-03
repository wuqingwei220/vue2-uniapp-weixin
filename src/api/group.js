import request from '@/utils/request.js';

/**
 * 回收分类列表
*/
export function reprpackGroup(data) {
	return request.get('/reprpack/reprpackGroup/query', data, {
		login: false
	})
}