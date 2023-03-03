
import Fly from "flyio/dist/npm/wx";


import cookie from "@/utils/cookie";

import {handleLoginFailure} from "@/utils";



const fly = new Fly()

fly.config.baseURL = process.uniEnv.UNI_BASE_API


fly.interceptors.response.use(
  response => {
    console.log(response)
    return response;
  },
  error => {
	  console.log(error)
    if (error.toString() == 'Error: Network Error') {
      console.log('————————')
      console.log('发送请求失败', error)
      console.log('————————')
      handleLoginFailure();
      return Promise.reject({ msg: "未登录", toLogin: true });
    }
    if (error.status == 401) {
      console.log('————————')
      console.log('登录失效 401', error)
      console.log('————————')
      handleLoginFailure();
      return Promise.reject({ msg: "未登录", toLogin: true });
    }

    if (error.response.data.status == 5109) {
      uni.showToast({
        title: error.response.data.msg,
        icon: "none",
        duration: 2000
      });
    }
    return Promise.reject(error);
  }
);

const defaultOpt = { login: true };

function baseRequest(options) {

  // 从缓存中获取 token 防止 token 失效后还会继续请求的情况
  const token = cookie.get('login_status');
  const author = cookie.get('author_status');

  console.log("token----------", token)
  console.log("author----------", author)

  // 合并传参过来的 headers
  // 如果接口需要登录，携带 token 去请求

  options.headers = {
    ...options.headers,
  }

  if(options.islogin === true) {
	  options.headers = {
	    ...options.headers,
	  	device: 'mobile'
	  }
  }

  if (options.login === true) {
	if(author && author.length > 0){
		options.headers = {
		  ...options.headers,
		  token,
		  Authorization: 'Bearer ' + author
		}
	} else {
		options.headers = {
		  ...options.headers,
		  token,
		}
	}
  }

  // 如果需要登录才可访问的接口没有拿到 token 视为登录失效
  if (options.login === true && !token) {
    // 跳转到登录或授权页面
    handleLoginFailure();
    // 提示错误信息
    return Promise.reject({ msg: "未登录", toLogin: true });
  }
  // 结构请求需要的参数
  const { url, params, data, login, ...option } = options
  let requestData = {
	  ...(params || data)
	  // channelNo: 'QD-20220301-0001'
  }

  //console.log(options)
  // 发起请求
  return new Promise((resolve, reject) => {
	fly.request(url, requestData, {
	  ...option
	}).then(res => {
	  const data = res.data || {};
	  if (res.status !== 200) {
	    reject({ msg: res.message || "请求失败", res, data });
	  }

		if([401, 403].indexOf(data.result) !== -1){
			handleLoginFailure();
			reject({ msg: res.data.message, res, data, toLogin: true });
		}
	  if ([401, 403].indexOf(data.code) !== -1) {
	    handleLoginFailure();
	    reject({ msg: res.data.message, res, data, toLogin: true });
	  } else if (data.code === 200 || data.code == null) {
	    resolve(res);
	  } else {
	    if(options.showErrMsg) {
	      uni.showToast({
	        icon: 'none',
	        title: res.data.message
	      })
	    }
	    reject({ msg: res.data.message, res, data });
	  }
	}).catch((res) => {
		  uni.showToast({
		    icon: 'none',
		    title: (res && res.msg) || '请求失败，请稍后重试'
		  })
	});
  })

}

/**
 * http 请求基础类
 * 参考文档 https://www.kancloud.cn/yunye/axios/234845
 *
 */
const request = ["post", "put", "patch"].reduce((request, method) => {
  /**
   *
   * @param url string 接口地址
   * @param data object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, data = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, data, method }, defaultOpt, options)
    );
  };
  return request;
}, {});

["get", "delete", "head"].forEach(method => {
  /**
   *
   * @param url string 接口地址
   * @param params object get参数
   * @param options object axios 配置项
   * @returns {AxiosPromise}
   */
  request[method] = (url, params = {}, options = {}) => {
    return baseRequest(
      Object.assign({ url, params, method }, defaultOpt, options)
    );
  };
});

export default request;
