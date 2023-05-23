<template>
	<view class="wrong-container">
		<view class="card-list">
			<view class="card-item" v-for="(item, index) in state.dataList" :key="item.id">
				<view class="question-name">
					<view class="index-number">{{index + 1}} .</view><ParseHtml :content="item.questionName" />
				</view>
				<view class="question-item-list">
					<view :class="['question-item', item.correctAnswerId === e.id ? 'active' : '']" v-for='(e, i) in item.questionItemList' :key='e.id'>
						<view class="option-item">{{state.itemIndex[i]}}</view>
						<ParseHtml :content="e.name" />
					</view>
				</view>
			</view>
			<uni-pagination :total="state.total" :pageSize="state.pageSize" @change="changePage"/>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { postAction } from '@/api/common';
import { wrongBookPageApi } from '@/api/user';
import { SUCCESS_CODE } from '@/utils/request';
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import ParseHtml from '@/components/ParseHtml.vue';
const state = reactive({
	dataList: [],
	pageIndex: 1,
	pageSize: 10,
	total: 0,
	itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
})
const getDataList = () => {
	postAction(wrongBookPageApi, {
		pageIndex: state.pageIndex,
		pageSize: state.pageSize
	}).then(res => {
		if (res.status === SUCCESS_CODE) {
			state.dataList = res.data.list;
			state.total = res.data.total;
		}
	})
};
const changePage = e => {
	state.pageIndex = e.current;
	getDataList();
};
onLoad(() => {
	getDataList();
})
</script>

<style lang="scss" scoped>
.wrong-container{
	padding: $uni-padding-half;
	.card-list{
		padding: $uni-padding-half;
		.card-item{
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
					&.active{
						color: #dd4a68;
					}
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
		}
	}
}
</style>
