<template>
	<view class="custom-navbarWrap">
		<view
			class="custom-navbar"
			:style="{
				height: `${navBoxHeight}px`,
				background: totalBackground
			}"
		>
			<!-- 状态栏 + 空白 -->
			<view
				class="statusBarWithSpace"
				:style="{
					height: `${statusBarWithSpaceHeight}px`
				}"
			></view>
			<!-- 导航栏 -->
			<view class="navbar" :style="{ height: `${capsuleHeight}px` }">
				<!-- 左区 (返回) -->
				<view
					v-if="showBack"
					:style="{
						height: `${capsuleHeight}px`,
						width: customBackAreaWidth
							? `${customBackAreaWidth}px`
							: `${backAreaWidth}px`
					}"
					class="backArea"
					@click.stop="goBack"
				>
					<view
						class="backIconWrap"
						:style="{ height: `${capsuleHeight}px`, width: `${capsuleHeight}px` }"
					>
						<image class="backIcon" :src="customBackIconUrl"></image>
					</view>
				</view>
				<!-- 中心区 (标题, 搜索)-->
				<view v-if="mode === 'title'" class="centerArea">
					<view
						class="title"
						:style="{
							height: `${capsuleHeight}px`,
							lineHeight: `${capsuleHeight}px`,
							paddingLeft: `${
								showBack
									? placeholderAreaWidth - backAreaWidth
									: placeholderAreaWidth
							}px`,
							fontSize: `${titleSize}rpx`,
							color: `${titleColor}`
						}"
					>
						{{ title }}
					</view>
				</view>
				<!-- 左面图标-->
				<view v-if="mode === 'log'" class="centerArea" style="flex:none">
					<view
						class="title"
						:style="{
							height: `${capsuleHeight}px`,
							lineHeight: `${capsuleHeight}px`,
							paddingLeft: '46rpx',
							fontSize: `${titleSize}rpx`,
							color: `${titleColor}`
						}"
					>
					 <image :src="logImg" class="log-img"></image>
					</view>
				</view>
				<view v-if="mode === 'searchPre'" class="centerArea" @click.stop="goSearch">
					<view
						class="search"
						:style="{
							height: `${capsuleHeight}px`,
							marginLeft: `${capsulePadding}px`,
							background: `${customSearchBackground}`
						}"
					>
						<view
							v-if="showMaganifingGlassIcon"
							class="maganifingIconWrap"
							:style="{
								height: `${capsuleHeight}px`
							}"
						>
							<image
								class="maganifingIcon"
								:src="customMaganifingGlassIconUrl"
							></image>
						</view>
						<view class="searchPlaceholder">{{ prePlaceholder }}</view>
					</view>
				</view>
				<view v-if="mode === 'search'" class="centerArea">
					<view
						class="search"
						:style="{
							height: `${capsuleHeight}px`,
							background: `${customSearchBackground}`
						}"
					>
						<view v-if="showMaganifingGlassIcon" class="maganifingIconWrap">
							<image
								class="maganifingIcon"
								:src="customMaganifingGlassIconUrl"
							></image>
						</view>
						<input
							class="search-input"
							v-model="keyWord"
							type="text"
							:style="{ height: `${capsuleHeight}px` ,width:'75%'}"
							placeholder-style="color:#bebebe"
							:focus="focus"
							confirm-type="搜索"
							:placeholder="placeholder"
							@confirm="handleSearch"
							@blur="$emit('update:focus', false)"
							@focus="$emit('update:focus', true)"
						/>
						<view v-if="focus" class="search-clear">
							<view
								:style="{
									height: `${capsuleHeight}px`,
									width: `${capsuleHeight}px`
								}"
								class="clear-wrap"
								@click="handleClear"
							>
								<image
									class="clear-wrap-img"
									src="http://oss.juxingta.com/static/images/2022-05-12/e803cef5-7ca1-4f16-8b6a-3118d69b8e53___%E7%BC%96%E7%BB%84%402x.png"
									mode="widthFix"
								></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 右区 (占位) -->
				<view
					class="placeholderArea"
					:style="{
						height: `${capsuleHeight}px`,
						width: customPlaceholderAreaWidth
							? `${customPlaceholderAreaWidth}px`
							: `${placeholderAreaWidth}px`
					}"
				></view>
			</view>
		</view>
		<view
			v-if="showGridBlock"
			class="gridBlock"
			:style="{ height: `${navBoxHeight}px` }"
		></view>
	</view>
</template>
<script>
export default {
	props: {
		logImg:{
			type:String,
			default:""
		},
		// 小程序不支持 v-bind="",暂时加判断
		showGridBlock: {
			type: Boolean,
			default: true
		},
		correctionFactor: {
			type: Number,
			default: 0
		},
		totalBackground: {
			type: String,
            default: 'transparent'
		},
		showBack: {
			type: Boolean,
			default: true
		},
		customBackAreaWidth: {
			type: Number
		},
		customBackIconUrl: {
			type: String,
			default:
				'http://oss.juxingta.com/static/images/2022-05-06/23f879cb-9298-43bd-a58a-8cec58e86b87___icon%EF%BC%8F%E7%B3%BB%E7%BB%9F%EF%BC%8F%E4%B8%8B%E4%B8%80%E6%AD%A5%402x.png'
		},
		customPlaceholderAreaWidth: {
			type: Number
		},
		mode: {
			required: true,
			type: String,
			default: 'title'
		},
		title: {
			type: String,
			default: '标题'
		},
		titleSize: {
			type: Number,
			default: 30
		},
		titleColor: {
			type: String,
			default: '#000'
		},
		customSearchBackground: {
			type: String,
			default: '#fff'
		},
		showMaganifingGlassIcon: {
			type: Boolean,
			default: true
		},
		customMaganifingGlassIconUrl: {
			type: String,
			default:
				'http://oss.juxingta.com/static/images/2022-05-19/ceea31f1-a038-4981-b7f8-ac8ef129ff19___icon%EF%BC%8F%E7%B3%BB%E7%BB%9F%EF%BC%8F%E6%9D%A5%E8%AE%BF%202%402x.png'
		},
		prePlaceholder: {
			type: String,
			default: '请输入想要搜索的内容'
		},
		focus: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: '请输入想要搜索的内容'
		},
	    
	},
	emits: ['search'],
	data() {
		return {
			statusBarWithSpaceHeight: 0,
			navBoxHeight: 0,
			capsuleHeight: 0,
			capsulePadding: 0,
			backAreaWidth: 0,
			centerAreaWidth: 0,
			placeholderAreaWidth: 0,
      keyWord: null,
		}
	},
	created() {
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		console.log('胶囊区:', menuButtonInfo)
		// 手机状态栏高 + 空白
		this.statusBarWithSpaceHeight = menuButtonInfo.top + this.$props.correctionFactor
		// 胶囊高 -> 导航高
		this.capsuleHeight = menuButtonInfo.height - this.$props.correctionFactor
		// 胶囊宽
		// this.capsuleWidth1 = menuButtonInfo.width
		// 导航整体高 = 胶囊顶部位置 + 胶囊高 -> 手机状态栏高 + 空白 + 导航高
		this.navBoxHeight = this.statusBarWithSpaceHeight + this.capsuleHeight

		//
		const systemInfo = uni.getSystemInfoSync()
		// 边距
		this.capsulePadding = systemInfo.screenWidth - menuButtonInfo.right

		// 左侧返回区宽度
		this.backAreaWidth = this.capsuleHeight + this.capsulePadding * 2
		// 右侧占位区宽度
		this.placeholderAreaWidth = menuButtonInfo.width + this.capsulePadding * 2

		let menuButtonObject = uni.getMenuButtonBoundingClientRect()
	},
	methods: {
		goBack() {
			// 回到上一页
			uni.navigateBack({
        delta: 1
      })
		},
		// onConfirm(event) {
		// 	const { value } = event.detail
		// 	//console.log(value)
		// 	this.$emit('searchFun', value)
		// },
		goSearch() {
			uni.navigateTo({
				url: '/pages/searchDetail/index?routeKey=home'
			})
		},
		handleClear() {
			console.log('清除', this.$data.keyWord)
			this.$data.keyWord = null
		},
		handleSearch() {
			console.log('抛出搜索', this.$data.keyWord)
			this.$emit('search',this.$data.keyWord)
		}
	},
	onShow() {}
}
</script>
<style scoped lang="less">
.log-img{
	height: 58rpx;
	width: 367rpx;
}
.field-class {
	padding: 3px 0 0 0;
}

.custom-navbar {
	position: fixed;
	width: 100%;
	z-index: 99;
}

.navbar {
	width: 100%;
	display: flex;
	align-items: center;

	.backArea {
		display: flex;
		justify-content: center;
		align-items: center;

		.backIconWrap {
			.backIcon {
				width: 100%;
				height: 100%;
			}
		}
	}

	.centerArea {
		flex: 1;

		// padding-left: 30rpx;
		.title {
			text-align: center;
		}

		.search {
			position: relative;
			border-radius: 29rpx;
			box-sizing: border-box;
			padding-left: 26rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
      font-size: 24rpx;

			.maganifingIconWrap {
				display: flex;
				justify-content: center;
				align-items: center;

				.maganifingIcon {
					width: 30rpx;
					height: 30rpx;
				}
			}

			.searchPlaceholder {
				font-size: 28rpx;
				font-family: PingFangSC, PingFangSC-Regular;
				font-weight: 400;
				text-align: left;
				color: #bebebe;
				padding-left: 10rpx;
			}

			.search-input {
				margin-left: 16rpx;
			}

			.search-clear {
				position: absolute;
				right: 0rpx;
				top: 0rpx;

				.clear-wrap {
					z-index: 999;
					display: flex;
					align-items: center;
					justify-content: center;

					.clear-wrap-img {
						width: 22rpx;
						height: 22rpx;
					}
				}
			}
		}
	}
}
</style>
