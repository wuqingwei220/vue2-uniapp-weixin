import Vue from 'vue'
import App from './App'
import Md5 from 'js-md5'
import {
	router,
	RouterMount
} from '@/router/router' // 引入路由
import store from "@/store";
// 引入常用的工具类
import util from '@/utils';

// 环境的配置{开发环境/生产环境}
import '@/config/env'

// from校验
import schema from "async-validator";

//将my-link注册为全局组件，注册后使用方法同<router-link>
import Mylink from '../node_modules/uni-simple-router/dist/link.vue'
Vue.component('my-link', Mylink)

// 使用方法
// 使用
// navType对应的就是push/pushTab/replace/replaceAll
{/* <my-link to="{path: '/pages/mine/index',query: {name: '我只想去tab5的my-link'}}" navType="pushTab">
    <button type="default">我是router-link</button>
</my-link> */}


//#ifdef H5
import vconsole from 'vconsole' // 引入vconsole 调试工具
if (process.env.VUE_APP_ENV != 'production') {
	Vue.prototype.$vconsole = new vconsole() // 使用vconsole
}
//#endif
Vue.config.productionTip = false
// 设置路由白名单
Vue.use(router) // 使用路由

// 常用工具类挂载Vue实例
Vue.prototype.$util = util
// md5
Vue.prototype.$md5 = Md5
// form校验
Vue.prototype.$validator = function (rule) {
	return new schema(rule);
}
Vue.prototype.$validate = function (form, rules) {
	return new Promise((resolve, reject) => {
		new schema(rules).validate(form)
			.then(() => resolve())
			.catch(({ errors, fields }) => {
				console.log("验证表单结果", errors)
				uni.showToast({
					title: errors[0].message,
					icon: 'none',
					duration: 2000
				})
			});
	})
}
App.mpType = 'app'
Vue.prototype.$store = store;

console.log("PROCESS",process.uniEnv.UNI_BASE_API)
const app = new Vue({
	...App,
	store
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
//为了兼容小程序及app端必须这样写才有效果
app.$mount();
// #endif
