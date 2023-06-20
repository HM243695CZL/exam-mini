<template>
	<view class="examing-container">
		<view class="progress-bar">
			<view class="percent" :style="{width: (Object.keys(state.answerMap).length / ~~state.paperInfo.paper.questionCount) * 100 + '%'}">
				{{Object.keys(state.answerMap).length}} / {{~~state.paperInfo.paper.questionCount}}
			</view>
		</view>
		<view class="question-area">
			<view class="question-info">
				<view class="head">
					{{state.currentBigInfo.bigName}}(共{{state.currentBigInfo.questionList.length}}题，合计{{state.currentBigInfo.questionScore}}分)
				</view>
				<view class="question-list">
					<view class="question-title">
						<view class="index-number">{{state.currentQuestionIndex + 1}}.</view>
						<ParseHtml :content="state.currentQuestionInfo.question" />
						<view class="score">({{state.currentQuestionInfo.score}}分)</view>
					</view>
					<view class="list-item-box">
						<radio-group @change="changeAnswer">
							<view class="list-item" v-for="(item, index) in state.currentQuestionInfo.questionItemList"
								:key="item.id">
								<radio :value="item.id" :checked="state.answerMap[state.currentQuestionInfo.id] === item.id" />{{state.itemIndex[index] + '. '}}
								<ParseHtml style="margin-top: -20rpx;" :content="item.name" />
							</view>
						</radio-group>
					</view>
				</view>
				<view class="btn-box">
					<view class="button-item" @click="changeQuestion('prev')">上一题</view>
					<view class="button-item" @click="changeQuestion('next')">下一题</view>
					<view v-if="Object.keys(state.answerMap).length === ~~state.paperInfo.paper.questionCount" class="button-item submit" @click="clickSubmitPaper">交卷</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { getAction, postAction } from '@/api/common';
	import { previewPaperApi, submitPaperApi } from '@/api/user';
	import { SUCCESS_CODE } from '@/utils/request';
	import { onLoad } from '@dcloudio/uni-app';
	import { reactive } from 'vue';
	import ParseHtml from '@/components/ParseHtml.vue';
	const state = reactive({
		paperInfo: {
			paper: {},
			questionBigList: [],
		},
		paperId: '',
		itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
		currentBigInfo: {
			questionList: []
		} as any,
		currentQuestionInfo: {
			questionItemList: []
		} as any,
		chooseAnswer: '',
		answerMap: {},
		currentBigIndex: 0,
		currentQuestionIndex: 0,
	});
	const getPaperInfo = () => {
		getAction(previewPaperApi + '/' + state.paperId, '').then(res => {
			if (res.status === SUCCESS_CODE) {
				const { paper, questionBigList } = res.data;
				state.paperInfo.paper = paper;
				state.paperInfo.questionBigList = questionBigList;
				if (questionBigList.length) {
					state.currentBigInfo = questionBigList[0];
					state.currentQuestionInfo = questionBigList[0].questionList[0];
				}
			}
		});
	};
	const changeAnswer = e => {
		state.answerMap[state.currentQuestionInfo.id] = e.target.value;
	};
	const changeQuestion = type => {
		if (type === 'prev') {
			if (state.currentQuestionIndex === 0) {
				if (state.currentBigIndex === 0) {
					return false;
				}
				// 切换到上一个大题
				state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex - 1];
				state.currentQuestionInfo = state.currentBigInfo.questionList[state.currentBigInfo.questionList.length - 1];
				state.currentBigIndex -= 1;
				state.currentQuestionIndex = state.currentBigInfo.questionList.length - 1;
			} else {
				state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex - 1];
				state.currentQuestionIndex -= 1;
			}
		} else {
			if (state.paperInfo.questionBigList[state.currentBigIndex].questionList.length - 1 <= state.currentQuestionIndex) {
				if (state.currentBigIndex + 1 >= state.paperInfo.questionBigList.length) {
					return false;
				} else {
					// 切换到下一个大题
					state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex + 1];
					state.currentQuestionInfo = state.currentBigInfo.questionList[0];
					state.currentBigIndex += 1;
					state.currentQuestionIndex = 0;
				}
			} else {
				state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex + 1];
				state.currentQuestionIndex += 1;
			}
		}
		state.chooseAnswer = '';
		if (state.answerMap[state.currentQuestionInfo.id]) {
			state.chooseAnswer = state.answerMap[state.currentQuestionInfo.id]
		}
	};
	const clickSubmitPaper = () => {
		postAction(submitPaperApi, {
			paperId: state.paperId,
			answerMap: state.answerMap
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '交卷成功'
				});
				uni.navigateBack();
			}
		})
	};
	onLoad(option => {
		state.paperId = option.id;
		getPaperInfo();
	});
</script>

<style lang="scss" scoped>
	.examing-container {

		.progress-bar {
			position: fixed;
			top: 0;
			right: $uni-padding-half;
			left: $uni-padding-half;
			height: 40rpx;
			background: #ebeef5;
			border-radius: 10rpx;

			.percent {
				height: 40rpx;
				line-height: 40rpx;
				background: #20a0ff;
				color: #fff;
				font-size: $uni-font-size-sm;
			}
		}

		.question-area {
			padding-top: 40rpx;
			.head {
				height: 60px;
				line-height: 60px;
				border-bottom: 1px solid #f1f1f1;
				padding: 0 20px;
				box-sizing: border-box;
			}

			.question-info {
				background: #fff;
				flex: 1;
				padding-bottom: 60px;

				.head {
					font-size: 20px;
					font-weight: 700;
				}

				.question-list {
					height: calc(100% - 60px);
					overflow-y: scroll;

					.question-title {
						font-weight: 700;
						padding: 0 40rpx;
						position: relative;
						.index-number {
							position: absolute;
							top: 20rpx;
							left: 0;
						}
						.score{
							position: absolute;
							top: 20rpx;
							right: 0;
						}

					}

					.list-item-box {

						.list-item {
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;
							margin-bottom: 10px;
							padding: $uni-padding-half;
							color: #000;

							.item {
								margin-left: 5px;
								margin-top: 8px;

								::v-deep {
									img {
										width: 100px;
										height: 100px;
									}

									p {
										display: inline-block;
									}
								}
							}
						}
					}
				}

				.btn-box {
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					padding-left: 20rpx;
					background: #fff;
					display: flex;
					justify-content: flex-start;

					.button-item {
						margin-right: $uni-padding-half;
						margin-bottom: $uni-padding-half;
						padding: $uni-padding-half;
						border: 1px solid #ccc;
						border-radius: 10rpx;
						font-size: $uni-font-size-sm;
						&.submit{
							background: #20a0ff;
							color: #fff;
						}
					}
				}
			}

			.answer-card {
				width: 350px;
				background: #fff;
				margin-left: 20px;
				position: relative;

				.head {
					.count-down {
						text-space: 2px;
						color: #f00;
					}
				}

				.answer-status {
					display: flex;
					justify-content: center;
					justify-items: center;
					padding: 10px;

					.status-item {
						display: flex;
						align-items: center;

						.circle {
							margin-left: 4px;
							margin-right: 10px;
							width: 16px;
							height: 16px;
							border-radius: 50%;
							border: 1px solid #ccc;

							&.done {
								background: #126ac6;
							}

							&.doing {
								border-color: #126ac6;
							}
						}
					}
				}

				.big-title-card {
					padding: 10px 20px;

					.big-title {
						font-weight: 700;
						margin-bottom: 10px;

						.big-item {
							display: flex;
							justify-items: flex-start;
							flex-wrap: wrap;
							padding: 10px 0;

							.question-circle {
								cursor: pointer;
								font-weight: 400;
								display: flex;
								justify-content: center;
								align-items: center;
								width: 26px;
								height: 26px;
								margin-right: 10px;
								border-radius: 50%;
								margin-bottom: 10px;
								border: 1px solid #ccc;

								&.active,
								&:hover {
									border-color: #126ac6;
									color: #126ac6;
								}

								&.done {
									background: #126ac6;
									color: #fff;
								}
							}
						}
					}
				}

				.submit-paper {
					position: absolute;
					width: 100%;
					bottom: 20px;
					left: 0;
					padding: 0 20px;
					text-align: center;

					.submit-btn {
						cursor: pointer;
						padding: 10px 30px;
						background: #126ac6;
						border-radius: 5px;
						color: #fff;
					}
				}
			}
		}
	}
</style>