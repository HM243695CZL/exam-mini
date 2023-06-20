<template>
	<view class="index-container">
		<view class="box" v-if="userInfo.id">
			<view class="card-list" v-if="state.dataList.length">
				<view class="card-item" v-for="item in state.dataList" :key="item.id">
					<view class="name">{{item.name}}</view>
					<view class="item-body">
						<view class="info">
							<view class="row">试题信息: {{item.questionInfo}}</view>
							<view class="row">题数: {{item.questionCount}}</view>
							<view class="row">总分: {{item.score}}</view>
						</view>
						<view v-if="item.examScore !== null" class="score">得分: {{item.examScore}}</view>
					</view>
					<view class="btn-box">
						<view class="view-exam" v-if="item.examScore !== null" @click="clickViewPaper(item.id)">查看试卷</view>
						<view class="start-exam" v-else @click="clickStartExam(item.id)">开始考试</view>
					</view>
				</view>
				<uni-pagination :total="state.total" :pageSize="state.pageSize" @change="changePage"/>
			</view>
			<view class="no-data" v-else>暂无数据</view>
		</view>
		<view class="no-login" v-else @click="clickGoLogin">
			<button type="primary">去登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { postAction } from '@/api/common';
	import { getMyExamApi } from '@/api/user';
	import { SUCCESS_CODE } from '@/utils/request';
	import { computed, reactive } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import store from '@/store';
	const state = reactive({
		dataList: [],
		pageIndex: 1,
		pageSize: 10,
		total: 0
	});
	const getMyExam = () => {
		postAction(getMyExamApi, {
			pageIndex: state.pageIndex,
			pageSize: state.pageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data.list;
				state.total = res.data.total;
			}
		})
	};
	const clickViewPaper = id => {
		uni.navigateTo({
			url: '/pages/view-paper/view-paper?paperId=' + id + '&isRecord=true'
		});
	};
	const clickStartExam = id => {
		uni.navigateTo({
			url: '/pages/examing/examing?id=' + id
		});
	};
	const changePage = e => {
		state.pageIndex = e.current;
		getMyExam();
	};
	const clickGoLogin = () => {
		uni.switchTab({
			url: '/pages/user/user'
		});
	}
	const userInfo = computed(() => {
		return store.state.userInfo.userInfo;
	});
	onShow(() => {
		getMyExam();
	});
</script>

<style lang="scss" scoped>
	.index-container {
		.card-list {
			padding: $uni-padding-half;

			.card-item {
				margin-bottom: $uni-padding-half;
				padding: $uni-padding-half;
				box-shadow: 0 0 12px rgba(0, 0, 0, .12);

				.name {
					font-weight: 700;
					font-size: $uni-font-size-lg;
					padding-bottom: $uni-padding-half;
					border-bottom: 1px solid #f5f5f5;
				}

				.item-body {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;

					.info {
						.row {
							padding: 4px 0;
						}
					}

					.score {
						font-size: 20px;
						color: #dd4a68;
					}
				}

				.btn-box {
					margin: 10px 0;

					.view-exam,
					.start-exam {
						width: 90%;
						margin: 0 auto;
						padding: 10px;
						background: #126ac6;
						color: #fff;
						border-radius: 10px;
						text-align: center;
					}

					.start-exam {
						background: #dd4a68;
					}
				}
			}
		}
		.no-login{
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