<template>
	<view class="update-avatar-container">
		<view class="row">
			<view class="key">昵称</view>
			<view class="value">
				<input @change="changeNickName" v-model="state.nickname" type="nickname" placeholder="请输入昵称">
			</view>
		</view>
		<view class="row">
			<view class="key">修改头像</view>
			<view class="value">
				<image class="img-avatar" mode="aspectFill" :src="state.avatar"></image>
				<button size="mini" open-type="chooseAvatar" @chooseavatar="changeAvatar">点击修改</button>
			</view>
		</view>
		<view class="btn-box">
			<button size="mini" type="default" class="cancel" @click="clickCancel(false)">取消</button>
			<button size="mini" type="primary" @click="clickConfirm">确定</button>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed } from 'vue';
import store from '@/store';
import { getAction, postAction } from '@/api/common';
import { SUCCESS_CODE } from '@/utils/request';
import{ changeNicknameAndAvatarApi, policyApi} from '@/api/user';

const userInfo = computed(() => {
	return store.state.userInfo.userInfo;
});
const state = reactive({
	nickname: userInfo.value.nickName,
	avatar: userInfo.value.avatar,
	dataObj: {
		policy: '',
		signature: '',
		key: '',
		ossAccessKeyId: '',
		dir: '',
		host: ''
	}
});
const changeNickName = e => {
	state.nickname = e.detail.value;
};
const changeAvatar = e => {
	getAction(policyApi).then(res => {
		if (res.status === SUCCESS_CODE) {
			const {accessKeyId, dir, host, policy, signature} = res.data;
			state.dataObj.policy = policy;
			state.dataObj.signature = signature;
			state.dataObj.key = dir + '/${filename}';
			state.dataObj.ossAccessKeyId = accessKeyId;
			state.dataObj.dir = dir;
			state.dataObj.host = host;
			const imgName = e.detail.avatarUrl.split('tmp/')[1];
			uni.uploadFile({
				url: host,
				filePath: e.detail.avatarUrl,
				name: 'file',
				fileType: 'image',
				formData: state.dataObj,
				success: result => {
					state.avatar = state.dataObj.host + '/' + state.dataObj.dir + '/' + imgName;
				}
			})
		}
	});
};
const clickCancel = flag => {
	const pages = getCurrentPages();
	const prevPage = pages[pages.length - 2];
	prevPage.$vm.showUserInfo(flag);
	uni.navigateBack({
		delta: 1
	});
};
const clickConfirm = () => {
	postAction(changeNicknameAndAvatarApi, state).then(res => {
		if (res.status === SUCCESS_CODE) {
			uni.showToast({
				title: '修改成功'
			})
			clickCancel(true);
		}
	})
};
</script>

<style lang="scss" scoped>
	.update-avatar-container{
		background-color: $uni-color-white;
		height: 100%;
		padding: $uni-padding;
		.row{
			display: flex;
			padding: $uni-padding 0;
			border-bottom: 1px solid $uni-color-bd;
			.key{
				color: $uni-color-black;
				margin-right: $uni-padding;
				width: 150rpx;
			}
			.value{
				display: flex;
				align-items: center;
				.img-avatar{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					margin-right: $uni-padding;
				}
				button{
					color: $uni-color-black;
					background-color: $uni-color-btn;
				}
			}
		}
		.btn-box{
			padding: $uni-padding;
			display: flex;
			justify-content: center;
			button{
				color: $uni-color-white;
				background-color: $uni-color-base;
			}
			.cancel{
				background-color: $uni-color-price;
			}
		}
	}
</style>
