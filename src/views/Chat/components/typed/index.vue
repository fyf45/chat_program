<!--
 * @Date: 2023-05-11 15:14:41
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-12 15:52:10
-->
<template>
	<div class="typed-element" ref="typedElement">
		<slot name="default"></slot>
	</div>
</template>

<script setup>
	import Typed from "typed.js";
	import { ref, reactive, onMounted, onUnmounted, getCurrentInstance, defineProps, defineExpose } from "vue";
	import { params, getEventHandlers } from "./typed-config.js";
	// 常量
	onMounted(() => {
		init();
	});
	onUnmounted(() => {
		typeObj.destroy();
	});
	const props = defineProps({ ...params });
	const typedElement = ref(null);
	const inits = reactive(getCurrentInstance()); // 获取实例
	// 变量
	let typeObj = reactive({});

	// 初始化
	const init = () => {
		const $typed = typedElement.value.querySelector(".typing");
		let typedConfig = inits.props;
		getEventHandlers(inits, typedConfig);
		typeObj = new Typed($typed, props);
	};
	const stop = () => {
		typeObj.stop();
	};
	defineExpose({ init, stop })
</script>

<style scoped>
	.typed-element {
		display: flex;
		align-items: center;
	}
	.typed-cursor {
		opacity: 1;
		animation: typed 1 s infinite;
	}
	@keyframes typed {
		50% {
			opacity: 0;
		}
	}
</style>
