<template>
	<router-view v-slot="{ Component }">
		<transition name="slide-fade" mode="out-in" :duration="{ enter: 500, leave: 300 }">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script>

	export default {
		name: 'App',
		components: {}
	}
</script>

<style>
	@import "./styles/reset/reset.css";
	@import "./styles/iconfont/iconfont.css";
</style>
