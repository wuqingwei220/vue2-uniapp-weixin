<template>
	<view class="uploadimg-box">
		<view class="img-box" v-for="(item, index) in imgList" :key="index" @tap="viewImage" :data-url="imgList[index]">
			<image class="img" :src="imgList[index]" mode="aspectFill"></image>
			<view v-if="!disabled" class="cu-tag bg-red" @tap.stop="delImage" :data-index="index">
				<!-- <van-icon class="del-icon" name="cross" /> -->
				<image class="del-icon" src="http://oss.juxingta.com/static/images/2022-08-16/e2db809c-e9e4-4e21-8a37-bbf218396c40___%E7%BB%84%204%402x.png"></image>
			</view>
		</view>
			<!-- :max-size="500 * 1024" -->
	    	<!-- @oversize="onOversize" -->
		<van-uploader
			@after-read="afterRead"
			custom-style="width: 700rpx;"
			:max-count="max"
			v-model="imgList"
			v-if="!disabled && imgList.length < max" 
		>
			<view class="add-btn">
				<view class="icon-box">
					<!-- <van-icon class="add-icon" name="plus"/> -->
					<image class="add-icon" :src="addIcon"></image>
					<image class="titleImg" :src="titleImg" v-if="titleImg!=''"></image>
					<view class="upload-title">{{title}}</view>
				</view>

			</view>

		</van-uploader>
	</view>
</template>

<script>
/**
 * 上传图片
 */
import {VUE_APP_OSS_SRC,uploadImg} from '@/config';
import { dateFormatL } from '@/utils/index'
import { generateUUID, asyncRequest, asyncReadFile } from '@/utils/upload'
var getUploadUrl = async (fileName) => {
  let key = `/static/images/${dateFormatL("YYYY-mm-dd", new Date())}/${generateUUID()}___${fileName}`;
  let res = await asyncRequest({
	method: 'get',
	url: `${uploadImg}server/getUploadUrl?key=${key}`,
	dataType: 'json',
  })
  return res.data.data.url
}
export default {
	props: {
		// 最多上传数量
		max: {
			type: Number,
			default: 1
		},
		value: {
			type: Array,
			default: () => {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '添加图片'
		},
		titleImg:{
			type: String,
			default: ''
		},
		// 添加图片icon
		addIcon:{
			type:String,
			default: 'http://oss.juxingta.com/static/images/2022-08-16/19b9cbf2-0b1a-4b4a-9215-3c42a8a1a62c___camera%20%281%29.png'
		}
		
	},
	data() {
		return {
			imgList: []
		};
	},
	watch: {
		value() {
			this.imgList = this.value;
		}
	},
	methods: {
        // onOversize(file){
		// 	console.log("file",file)
		// 	uni.showToast({
		// 		title:`上传文件不能 超过500kb`,
		// 		icon: "none",
		// 		duration: 2000
		// 	})
		// },
		async afterRead(event) {
			console.log(".........点击；了")
			let _this = this;
			const { file } = event.detail;
			console.log("文件", file)
			let filePath = file.url
			let fileName = filePath.split(/\//).pop();
			try {
				// 读取文件数据 ArrayBuffer
				let { data: fileData } = await asyncReadFile({
					filePath
				})
				// 获取待上传文件url
				let url = await getUploadUrl(fileName)
				if (url.indexOf("https") == -1) {
					console.log(1777)
					url = url.replace("http:", "https:");
				}
				console.log("url",url)
				// 上传文件
				let res = await asyncRequest({
					dataType: 'text',
					url,
					data: fileData,
					header: {
					  "Content-Type": "multipart/form-data"
					},
					method: "put"
				})
                console.log(res)
				if (res.statusCode == 200) {
					console.log(`上传成功,${url.split('?')[0]}`);
					let filesUrl = `${url.split('?')[0]}`;

					let	filesSrc = `${VUE_APP_OSS_SRC}${filesUrl.split('.myqcloud.com').pop()}`

					let filesObj = {
						name: fileName,
						url: filesSrc
					}
					console.log("获取的图片地址：", filesSrc)
					_this.imgList = _this.imgList.concat(filesSrc);
					_this.updateValue();

				} else {
					console.log(`上传失败`);
					_this.uploadShow = false;
					console.log("res",res)
					debugger;
					uni.showToast({
						title:`上传失败`,
						icon: "none",
						duration: 2000
					})
				}
			} catch (error) {
			  console.log(error);
			  _this.uploadShow = false;
			  uni.showToast({
				title: error,
				icon: "none",
				duration: 2000
			  })
			}
		},
		chooseImage() {
			var _this = this
			uni.chooseImage({
				count: this.max - this.imgList.length, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: res => {
					const { tempFilePaths } = res;
					tempFilePaths.forEach(async tempFilePath => {
						console.log("上传开始", tempFilePath)
						let filePath = tempFilePath
						let fileName = filePath.split(/\//).pop();

						try {

							// 读取文件数据 ArrayBuffer
							let { data: fileData } = await asyncReadFile({
								tempFilePath
							})
							console.log("获取", fileData)
							// 获取待上传文件url
							let url = await getUploadUrl(fileName)
							console.log("获取的上传url结果", url)
							if (url.indexOf("https") == -1) {
								console.log(1777)
								url = url.replace("http:", "https:");
							}

							// 上传文件
							let res = await asyncRequest({
								dataType: 'text',
								url,
								data: fileData,
								header: {
								  "Content-Type": "multipart/form-data"
								},
								method: "put"
							})
							console.log("上传结果", res)
							if (res.statusCode == 200) {
								console.log(`上传成功,${url.split('?')[0]}`);
								let filesUrl = `${url.split('?')[0]}`;

								let	filesSrc = `${VUE_APP_OSS_SRC}${filesUrl.split('.myqcloud.com').pop()}`

								let filesObj = {
									name: fileName,
									url: filesSrc
								}

								_this.fileUrl = filesSrc;
								_this.fileList = [filesSrc];
								_this.uploadShow = false;

							} else {
								console.log(`上传失败`);
								_this.uploadShow = false;
								uni.showToast({
									title: res.message || res.msg || res.data.msg || res.data.message,
									icon: "none",
									duration: 2000
								})
							}
						} catch (error) {
						  console.log(error);
						  _this.uploadShow = false;
						  uni.showToast({
							title: error,
							icon: "none",
							duration: 2000
						  })
						}

					});
				}
			});
		},
		viewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		delImage(e) {
			this.imgList.splice(e.currentTarget.dataset.index, 1);
			this.updateValue();
		},
		updateValue() {
			this.$emit('input', this.imgList);
		}
	},
	mounted() {
		this.imgList = this.value;
	}
};
</script>

<style lang="less" scoped>
.titleImg{
	position: absolute;
	z-index: -1;
	width: 293rpx;
	height: 93rpx;
	left: 0;
	right: 0;
	margin: auto;

}
.uploadimg-box {display: flex; align-items: center;}
.img-box {position: relative;}
.img { width: 216rpx;
	height: 216rpx;border-radius: 20rpx;}
.del-icon {position: absolute; right: 10upx; top: 10upx;width: 48rpx;height: 48rpx;}
.add-btn {
	//  width: 332upx; height: 230upx; border: 1px dashed #666;position: relative;
    width: 216rpx;
	height: 216rpx;
	background: #F0F0F0;
	border-radius: 20rpx;
	opacity: 1;
	border: 2px solid #E1DFDF;
	position: relative;
	.icon-box {position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);color: #999;text-align: center;width: 100%;}
	.add-icon {font-size: 60upx;color: #000000;width: 44rpx;height: 38rpx;}
	.upload-title {
		// margin-top: 10upx;
		font-size: 24rpx;
		font-family: 'PingFang SC-常规体', 'PingFang SC';
		font-weight: normal;
		color: #3D3D3D;
	}
}
</style>
