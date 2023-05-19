<template>
	<view class="user-container">
		<view class="user-box" v-if="userInfo.id">
			<view class="head-card flex-between">
				<view class="left">
					<view class="name">{{userInfo.nickName}}</view>
				</view>
				<image v-if="userInfo.id" class="img-avatar" mode="aspectFill" :src="userInfo.avatar"></image>
			</view>
			<view class="logout-btn" v-if="userInfo.id">
				<view class="logout" @click="logout()">退出登录</view>
			</view>
			<view class="technical-support">
				HL243695CZYN提供技术支持
			</view>
		</view>
		<view class="btn-box" v-else>
			<button open-type="getUserInfo" @getuserinfo="authLogin" type="primary">微信一键登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { getAction, postAction } from '@/api/common';
import { autoLoginApi, getSessionIdApi, getUserInfoApi } from '@/api/user';
import store from '@/store';
import { SUCCESS_CODE } from '@/utils/request';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { computed, reactive } from 'vue';

const state = reactive({
	sessionId: ''
})
const userInfo = computed(() => {
	return store.state.userInfo.userInfo;
});
const getSessionId = () => {
	uni.login({
		provider: 'weixin',
		success: res => {
			getAction(getSessionIdApi, {
				code: res.code
			}, false).then(result => {
				if (result.status === SUCCESS_CODE) {
					state.sessionId = result.data.sessionId;
					uni.setStorageSync('sessionId', state.sessionId);
				}
			})
		}
	})
};
const authLogin = (info: any) => {
	postAction(autoLoginApi, {
		encryptedData: info.detail.encryptedData,
		iv: info.detail.iv,
		sessionId: state.sessionId
	}).then(res => {
		if (res.status === SUCCESS_CODE) {
			uni.setStorage({
				key: 'token',
				data: res.data.token,
			});
			uni.showToast({
				title: '登录成功',
				icon: 'none'
			});
			getUserInfo();
		}
	})
};
const getUserInfo = () => {
	getAction(getUserInfoApi, {
		refresh: true
	}).then(res => {
		if (res.status === SUCCESS_CODE) {
			store.dispatch('setUserInfo', res.data);
			uni.setStorage({
				key: 'userInfo',
				data: res.data
			})
		}
	});
};
const logout = () => {
	
};
onShow(() => {
	state.sessionId = '';
	uni.checkSession({
		complete: () => {
			getSessionId();
		}
	})
})
onLoad((option: any) => {
	
})
</script>

<style lang="scss">
	.user-container{
		font-size: $uni-font-size-base;
		background-color: $uni-color-white;
		height: 100%;
		.user-box{
			.head-card{
				height: 160rpx;
				background-color: $uni-color-base;
				padding: $uni-padding;
				.left{
					.name{
						color: $uni-color-white;
						font-size: 50rpx;
					}
				}
				.img-avatar{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
				}
			}
			.logout-btn{
				margin-top: $uni-padding;
				padding: $uni-padding;
				.logout{
					border-radius: 10rpx;
					padding: $uni-padding 0;
					text-align: center;
					background-color: #f5f5f5;
					color: $uni-color-text;
				}
			}
			.technical-support{
				color: $uni-color-text;
				text-align: center;
				height: 150rpx;
				line-height: 150rpx;
				font-size: $uni-font-size-sm;
			}
		}
		.btn-box{
			margin-top: 100rpx;
			padding: $uni-padding;
			button{
				color: $uni-color-white;
				background-color: $uni-color-base;
				margin-bottom: 50rpx;
			}
		}
	}
</style>
