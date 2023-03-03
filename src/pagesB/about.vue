<template>
<view>
    <NavBar
      title="关于我们"
      titleSize="34"
      titleColor="#000000"
      :showBack="true"
      totalBackground="#C2F21F"
    ></NavBar>
    <image lazy-load mode="scaleToFill" fade-show src="http://oss.juxingta.com/static/images/2022-09-06/0af69a2e-46f0-4132-9b03-1542375a05a5___%E7%BB%84%2040%402x%20%281%29.png"></image>
</view>
 
</template>

<script>
import NavBar from "@/components/nav-bar";
  export default {
     components: { NavBar },
     data(){
        return {

        }
     }
  }
</script>

<style>
 page{
    background: #C2F21F;
 }
</style>
<style lang="less" scoped>

image{
    width: 100%;
    height: 1914rpx;
    margin-top: -157rpx;
}
</style>