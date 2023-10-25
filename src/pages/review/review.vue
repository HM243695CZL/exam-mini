<template>
	<view class="review-container">
		<uni-data-picker :localdata="state.reviewTypeList" 
			v-model="state.currentTypeId" placeholder="请选择章节"
			:map="{text: 'name', value: 'id'}"
			@change="getReviewInfo"
			></uni-data-picker>
		<view class="list">
			<view class="item" v-for="item in state.reviewList" :key="item.id">
				<view class="title">{{item.reviewTypeName}}</view>
				<view class="content">
					<ParseHtml :content="item.content" />
				</view>
				<view class="img-box" v-if="state.showOrigin">
					<image v-for="ele in (item.pictureUrl || '').split(',')"
						mode="scaleToFill"
						:src="ele" alt=""></image>
				</view>
			</view>
		</view>
		<view v-if="state.reviewList.length === 0" class="no-data">暂无数据</view>
		<view class="view-origin">
			<uni-icons :type="state.showOrigin ? 'eye' : 'eye-slash'" 
			@click="state.showOrigin = !state.showOrigin"
				size="30"></uni-icons>
		</view>
	</view>
</template>

<script setup lang="ts">
import { postAction, getAction } from '@/api/common';
import { getReviewTypeListApi, getReviewInfoApi} from '@/api/user';
import { SUCCESS_CODE } from '@/utils/request';
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import ParseHtml from '@/components/ParseHtml.vue';

const state = reactive({
	reviewTypeList: [],
	currentTypeId: '',
	reviewList: [],
	showOrigin: false
});
const getReviewTypeList = () => {
	getAction(getReviewTypeListApi, '').then(res => {
		if (res.status === SUCCESS_CODE) {
			state.reviewTypeList = res.data;
		}
	})
};
const getReviewInfo = () => {
	postAction(getReviewInfoApi, {
		reviewType: state.currentTypeId,
		pageIndex: 1, 
		pageSize: 10
	}).then(res => {
		if (res.status === SUCCESS_CODE) {
			state.reviewList = res.data.list;
		}
	});
}
onLoad(() => {
	getReviewTypeList();
	getReviewInfo();
});
</script>

<style lang="scss" scoped>
.review-container{
	padding: $uni-padding-half;
	.list{
		.item{
			.title{
				font-size: $uni-font-size-lg;
				padding: $uni-padding-half;
			}
			.img-box{
				height: 300rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.view-origin{
		position: fixed;
		top: 50%;
		right: 10rpx;
		font-size: $uni-font-size-sm;
	}
}
</style>
