<template>
	<view class="parse-html-container">
		<mp-html :content="props.content" />
	</view>
</template>

<script setup lang="ts">
	const props = defineProps({
		content: {
			type: String,
			default: ''
		}
	});
</script>

<style lang="scss">
	.parse-html-container{
		background-color: $uni-color-white;
		line-height: 50rpx;
		padding: $uni-padding-half;
	}
</style>