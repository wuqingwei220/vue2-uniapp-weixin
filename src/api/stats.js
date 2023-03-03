import request from '@/utils/request.js';

/**
 * 统计
*/
export function statistical(data) {
	return request.get('/reprpack/statistical', data, {
		login: true
	})
}