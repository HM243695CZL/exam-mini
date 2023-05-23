<template>
	<view class="view-paper-container">
		<view class="question-content">
			<view class="big-list" v-for="item in state.paperInfo.questionBigList" :key="item.bigId">
				<view class="big-question-name">
					{{item.bigName}}(共{{item.questionList.length}}题，合计{{item.questionScore}}分)
				</view>
				<view class="question-list">
					<view class="question-list-row" v-for="(ele, index) in item.questionList" :key="ele.id">
						<view class="question-name">
							<view class="index-number">{{index + 1}} .</view><ParseHtml :content="ele.question" />
						</view>
						<view class="question-item-list">
							<view class="question-item" v-for="(e, i) in ele.questionItemList" :key="e.id">
								<view class="option-item">{{state.itemIndex[i]}}</view>
								<ParseHtml :content="e.name" />
							</view>
						</view>
						<view class="view-answer">
							<view class="your-answer">
								<view>你的答案: <text class="your-answer-text">{{state.itemIndex[ele.currentUserAnswerIndex]}}</text></view>
								<view class="result">
									<view class="yes" v-if="ele.answer === ele.currentUserAnswer">√</view>
									<view class="no" v-else>×</view>
								</view>
							</view>
							<view class="correct-answer">
								正确答案: <text class="correct-answer-text">{{state.itemIndex[ele.answerIndex]}}</text>
							</view>
							<view class="analysis">
								解析: <ParseHtml :content="ele.analysis" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="exam-result">
			<view class="paper-score">
				试卷总分: <text class="number">{{state.paperInfo.paper.score}}</text>分
			</view>
			<view class="exma-score">
				考试得分: <text class="number">{{state.paperInfo.answerRecordInfo.score}}</text>分
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { getAction } from '@/api/common';
	import { viewPaperApi } from '@/api/user';
	import { SUCCESS_CODE } from '@/utils/request';
	import { onLoad } from '@dcloudio/uni-app';
	import { reactive } from 'vue';
	import ParseHtml from '@/components/ParseHtml.vue';
	const state = reactive({
		paperId: '',
		paperInfo: {
			paper: {},
			questionBigList: [],
			answerRecordInfo: {}
		} as any,
		itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
		status: '0',
		isRecord: false,
		examInfo: {} as any,
	});
	const getPaperInfo = () => {
		getAction(viewPaperApi + '/' + state.paperId, '').then(res => {
			if (res.status === SUCCESS_CODE) {
				const { paper, questionBigList, answerRecordInfo } = res.data;
				state.paperInfo.paper = paper;
				state.paperInfo.answerRecordInfo = answerRecordInfo;
				state.paperInfo.questionBigList = questionBigList;
				state.paperInfo.questionBigList.map(item => {
					item.questionList.map(ele => {
						ele.questionItemList.map((e, index) => {
							if (ele.currentUserAnswer === e.id) {
								ele.currentUserAnswerIndex = index;
							}
							if (ele.answer === e.id) {
								ele.answerIndex = index;
							}
						})
					})
				})
			}
		})
	};
	onLoad(urlMap => {
		state.paperId = urlMap.paperId;
		state.status = urlMap.status;
		state.isRecord = urlMap.isRecord;
		getPaperInfo();
	})
</script>

<style lang="scss" scoped>
	.view-paper-container {
		.question-content{
			.big-list{
				.big-question-name{
					padding: $uni-padding-half;
					height: 50px;
					line-height: 50px;
					font-weight: 700;
					border-bottom: 1px solid #ccc;
				}
				.question-list{
					padding: $uni-padding;
					.question-list-row{
						margin-bottom: $uni-padding-half;
						border-bottom: 1px solid #ccc;
						.question-name{
							position: relative;
							.index-number{
								position: absolute;
								top: 20rpx;
								left: -$uni-padding;
							}
						}
						.question-item-list{
							.question-item{
								padding: $uni-padding-half;
								.option-item{
									display: inline-block;
									width: 30px;
									height: 30px;
									line-height: 30px;
									border-radius: 50%;
									border: 1px solid #ccc;
									text-align: center;
								}
							}
						}
						.view-answer{
							padding: $uni-padding $uni-padding-half;
							.your-answer{
								display: flex;
								justify-content: space-between;
								align-items: center;
								margin-bottom: $uni-padding-half;
								.your-answer-text{
									color: $uni-color-price;
								}
								.result{
									padding-right: 30%;
									.yes{
										font-size: 60px;
										color: $uni-color-base;
									}
									.no{
										font-size: 60px;
										color: $uni-color-price;
									}
								}
							}
							.correct-answer{
								margin-bottom: $uni-padding-half;
								.correct-answer-text{
									color: #126ac6;
								}
							}
							.analysis{
								color: $uni-color-price;
							}
						}
					}
				}
			}
		}
		.exam-result{
			position: fixed;
			top: 20rpx;
			right: 20rpx;
			padding: 10rpx;
			border: 1px solid #f1f1f1;
			background: rgba(255, 255, 255, .1);
			.paper-score{
				margin-bottom: $uni-padding-half;
				.number{
					color: #126ac6;
					font-size: 20px;
					margin: 0 5px;
				}
			}
			.exam-score{
				margin-top: 10px;
				.number{
					color: #f40;
					font-size: 20px;
					margin: 0 5px;
				}
			}
		}
	}
</style>