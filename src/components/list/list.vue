<template>
	<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="{auto: false}">
		<slot></slot>
	</mescroll-uni>
</template>

<script>
/**
 * 列表请求封装（分页，下拉刷新，上拉加载）
 */
import request from '@/utils/request';
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	props: {
		/**
		 * 列表配置
		 */
		options: {
			type: Object,
			default: () => {
				return {
					url: '', // 请求地址
					method: 'post', // 请求方法
					params: {} // 请求参数
				};
			}
		}
	},
	data() {
		return {
			list: []
		};
	},
	watch: {
		list() {
			this.$emit('success', this.list);
		}
	},
	methods: {
		upCallback(page) {
			let {url, method, params} = this.options
			// 默认没有地址时返回空列表
			if(!url) {
				this.list = []
				this.mescroll.endSuccess(0)
				return
			}
		
			request[method || 'get'](url, {
				page: page.num,
				size: page.size,
				...params
			}, {
				login: true
			}).then((res) => {
				let data = res.data.data || res.data

				// 获取列表数据
				let currentList  = []
				data.length && (currentList = data)
				data.data && data.data.length && (currentList = data.data)
				data.data && data.data.data && data.data.data.length && (currentList = data.data.data)
				data.dataList && data.dataList.length && (currentList = data.dataList)
				data.items && data.items.length && (currentList = data.items)
				data.records && data.records.length && (currentList = data.records)
				// let currentList = data.length? data: (data.data || data.items || data.records || [])

				this.mescroll.endSuccess(currentList.length);
				//设置列表数据
				if(page.num == 1 ) this.list = []; //如果是第一页需手动制空列表
				this.list=this.list.concat(currentList); //追加新数据
			}).catch((res) => {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				this.mescroll.endSuccess(0);
				//联网失败, 结束加载
				this.mescroll.endErr();
			});
		},
		refresh() {
			this.list = []
			this.mescroll.resetUpScroll()
			// 放开
			this.$forceUpdate()
		}
	}
};
</script>

<style lang="css" scoped>
.tip {
	height: 100upx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
}
</style>
