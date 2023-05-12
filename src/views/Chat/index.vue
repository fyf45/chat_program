<!--
 * @Date: 2023-05-10 15:42:00
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-12 13:55:12
-->
<template>
	<div class="box-card">
		<div class="app-container">
			<div class="left-content" :style="{display:isFullScreen ? 'none' : 'flex'}">
				<div class="left-head">
					<el-button class="btn" @click="handleAddMessageData">新建聊天</el-button>
				</div>
				<!-- 聊天信息列表 start -->
				<div class="left-center">
					<div class="chat-list">
						<div class="chat-item" :class="{'chat-item-active':index == currentIndex}" v-for="(item,index) in cardList" :key="index" @click="handleClickLeftItem(index)">
							<div class="chat-item-info">
								<el-icon class="icon-style">
									<ChatDotSquare />
								</el-icon>
								<el-input v-model="item.keyword" clearable autofocus :ref="(el)=>setInputRefs(el,item,index)" size="small" @blur="handleIntBlur" placeholder="请输入" v-if="isInt && index == currentIndex" />
								<span v-else>{{item.keyword}}</span>
							</div>
							<div class="chat-icon-box" v-if="index == currentIndex">
								<div v-if="isInt">
									<el-icon>
										<DocumentChecked @click="handleSaveLeftItem(index)" />
									</el-icon>
								</div>
								<div v-else>
									<el-icon class="icon-style" @click="handleEditLeftItem(index)">
										<EditPen />
									</el-icon>
									<el-popconfirm width="220" @confirm="handleRemoveLeftItem(index)" confirm-button-text="确认" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF" title="确认删除此记录?">
										<template #reference>
											<el-icon>
												<Delete />
											</el-icon>
										</template>
									</el-popconfirm>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 聊天信息列表 end -->
				<div class="left-foot">
					<el-avatar :size="40" :src="avtar" @click="$hevueImgPreview(avtar)" class="avtar" />
					<div class="person-box">
						<b>ChatGPT On Web</b>
						<span>与我联系</span>
					</div>
				</div>
				<div class="left-icon-box">
					<el-icon class="icon" @click="handleClickFullScreen(true)">
						<ArrowLeft />
					</el-icon>
				</div>
			</div>
			<div class="right-content">
				<div class="msg-content" ref="msgContentRef">
					<!-- 提示消息 start -->
					<div class="prompt" v-if="!messageList.length">
						<p class="prompt-txt">🤖ChatGPT On Web 体验站，仅供学习交流使用🤖</p>
						<p class="prompt-txt">😋本站 GPT-4.0 是基于 GPT-3.5 伪装的，仅供娱乐，没有欺骗的意思😋</p>
						<p class="prompt-txt">⭐点此体验真GPT-4.0 ， 或在此获取GPT-3.5 一周不限次体验⭐</p>
						<p class="prompt-txt">❤️如需问题反馈，学习交流，搭建同款站点欢迎点击左下角与我联系❤️</p>
					</div>
					<!-- 提示消息 end -->

					<!-- 聊天内容 start -->
					<div class="message-box" v-else>
						<div class="message-list" ref="msgListRef">
							<div class="message-item" v-for="(item,index) in messageList" :key="index">
								<!-- 用户消息 start -->
								<div class="user-message-box" v-if="item.type == '0'">
									<el-popover :ref="(el) => setPopoverItemRefs(el, item,index)" :width="80" trigger="hover" :offset="0" :show-arrow="false" placement="left" popper-class="user-message-info">
										<template #reference>
											<el-icon class="message-icon-other" size="14">
												<MoreFilled />
											</el-icon>
										</template>
										<template #default>
											<div class="keyboard-box">
												<div class="keyboard-info" @click="handleCopyMessage(item,index)">
													<el-icon color="#000">
														<DocumentCopy />
													</el-icon>
													<span>复制</span>
												</div>
												<div class="keyboard-info" @click="handleDeleteMessage(index)">
													<el-icon color="#000">
														<Delete />
													</el-icon>
													<span>删除</span>
												</div>
											</div>
										</template>
									</el-popover>
									<div class="message-txt">{{item.message}}</div>
									<el-avatar :size="40" :src="avtar1" class="avtar" />
								</div>
								<!-- 用户消息 end -->
								<!-- 我是机器人消息 start -->
								<div class="chat-message-box" v-else>
									<el-avatar :size="40" :src="avtar" class="avtar" />
									<vue-typed :ref="(el) => setTypedItemRefs(el, item,index)" @onComplete="handleTypedComplete" class="message-txt" :strings="[item.message]" :loop="false" :showCursor="false">
										<div class="typing" />
									</vue-typed>
									<div class="message-icon-box" @click="handleRefreshMessage(item,index)">
										<el-icon class="message-icon" size="14">
											<Refresh />
										</el-icon>
										<el-popover :ref="(el) => setPopoverItemRefs(el, item,index)" :width="item.isPreview ? 80 : 110" trigger="hover" :offset="0" :show-arrow="false" placement="right" popper-class="user-message-info">
											<template #reference>
												<el-icon class="message-icon" size="14">
													<MoreFilled />
												</el-icon>
											</template>
											<template #default>
												<div class="keyboard-box">
													<div class="keyboard-info">
														<p class="keyboard-icon-box" v-show="item.isPreview" @click="handlePreviewMessage(item,index,false)">
															<el-icon color="#000">
																<View />
															</el-icon>
															<span>预览</span>
														</p>
														<p class="keyboard-icon-box" v-show="!item.isPreview" @click="handlePreviewMessage(item,index,true)">
															<el-icon color="#000">
																<Expand />
															</el-icon>
															<span>显示原文</span>
														</p>
													</div>
													<div class="keyboard-info" @click="handleCopyMessage(item,index)">
														<el-icon color="#000">
															<DocumentCopy />
														</el-icon>
														<span>复制</span>
													</div>
													<div class="keyboard-info" @click="handleDeleteMessage(index)">
														<el-icon color="#000">
															<Delete />
														</el-icon>
														<span>删除</span>
													</div>
												</div>
											</template>
										</el-popover>
									</div>
								</div>
								<!-- 我是机器人消息 end -->
							</div>
						</div>
					</div>
					<!-- 聊天内容 end -->
					<div class="stop-btn-box" v-if="isStopBtn">
						<el-button class="stop-btn" @click="handleStopMessage">
							<el-icon class="stop-icon">
								<VideoPause />
							</el-icon>&nbsp;停止回复</el-button>
					</div>
				</div>
				<!-- 聊天输入 start -->
				<div class="search-box">
					<div class="search-btn-box">
						<el-button class="search-btn" @click="$hevueImgPreview(wxCode)">搭建教程</el-button>

						<el-button class="search-btn" @click="$hevueImgPreview(paper)">GPT&AI课程</el-button>
						<el-icon :size="18" class="search-icon" @click="handleClearMessage">
							<Delete />
						</el-icon>
						<el-icon :size="18" class="search-icon" @click="handleDownLoadMessage">
							<Download />
						</el-icon>
					</div>
					<div class="search-input-box">
						<el-input v-model="keyword" clearable autofocus class="int" @input="handleSearchIntChange" @focus="handleSearchIntFocus" @blur="handleSearchIntBlur" placeholder="仅供学习交流使用，请勿滥用～～" />
						<el-button class="search-input-btn" :disabled="isDisabled" @click="handleSendMessage" :class="{'search-input-btn-active':!isDisabled}">
							<el-icon class="search-input-icon" color="#fff">
								<Promotion />
							</el-icon>
						</el-button>
					</div>
				</div>
				<!-- 聊天输入 end -->
			</div>

			<!-- 左半屏显示图标 start -->
			<div class="right-icon-box" v-show="isFullScreen">
				<el-icon class="icon" @click="handleClickFullScreen(false)">
					<ArrowRight />
				</el-icon>
			</div>
			<!-- 左半屏显示图标 end -->
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, nextTick, onUpdated, getCurrentInstance } from 'vue'
	import { InfoFilled } from '@element-plus/icons-vue'
	import { ElMessageBox, ElMessage } from 'element-plus'
	import clipboard3 from 'vue-clipboard3';
	import vueTyped from './components/typed/index.vue'
	import ResizeObserver from 'resize-observer-polyfill';
	import html2canvas from 'html2canvas';
	const currentIndex = ref(0);
	const chatItemIndex = ref(null);
	const keyword = ref("");
	const isInt = ref(false);
	const isDisabled = ref(true);
	const isFullScreen = ref(false);
	const isStopBtn = ref(false);
	const isIntFocus = ref(false);
	const { proxy } = getCurrentInstance();
	const wxCode = require('../../assets/wx_code.jpg');
	const paper = require('../../assets/paper.jpg');
	const avtar = require('../../assets/humen.jpg');
	const avtar1 = require('../../assets/humen.png');
	const cardList = ref([
		{ id: 1, keyword: 'new Chat1' },
		{ id: 2, keyword: 'new Chat2' },
		{ id: 3, keyword: 'new Chat3' },
		{ id: 4, keyword: 'new Chat4' },
		{ id: 5, keyword: 'new Chat5' },
	])
	const msgContentRef = ref("");
	const msgListRef = ref("");
	const popoverRefList = [];
	const typedRefList = [];
	const inputRefList = [];
	const setPopoverItemRefs = (el, item, index) => {
		setRefs(el, item, index, popoverRefList);
	}
	const setTypedItemRefs = (el, item, index) => {
		setRefs(el, item, index, typedRefList);
	}
	const setInputRefs = (el, item, index) => {
		setRefs(el, item, index, inputRefList);
	}
	const setRefs = (el, item, index, arr) => {
		if (!arr.length) {
			arr.push({ el, ...item, index })
		} else {
			let isPass = arr.every(k => k.index != index);
			isPass && arr.push({ el, ...item, index })
		}
	}
	onMounted(() => {
		observer.observe(msgListRef.value);
	});
	onUpdated(() => {
		// console.log(typedRefList);
	});
	/* 监听message-list 高度变化 */
	const observer = new ResizeObserver(entries => {
		for (const entry of entries) {
			// 可以通过 判断 entry.target得知当前改变的 Element，分别进行处理。
			if (entry.target == msgListRef.value) {
				handleScrollBottom();
			}
		}
	});
	document.onkeydown = function (e) {
		let key = e || event || window.event || arguments.callee.caller.arguments[0];
		if (key && key.keyCode === 13 && isIntFocus.value) {
			handleSendMessage();
		}
	}
	const handleSearchIntFocus = () => {
		isIntFocus.value = true;
	}
	const handleSearchIntBlur = () => {
		isIntFocus.value = false;
	}
	const messageList = ref([
		{ type: '0', message: '用户1', isPreview: true },
		{ type: '1', message: '我是机器人1', isPreview: true },
		{ type: '0', message: '用户2', isPreview: true },
		{ type: '1', message: '我是机器人2', isPreview: true },
		{ type: '0', message: '用户3', isPreview: true },
		{ type: '1', message: '我是机器人3', isPreview: true },
		{ type: '0', message: '用户4', isPreview: true },
		{ type: '1', message: '我是机器人4', isPreview: true },
		{ type: '0', message: '用户5', isPreview: true },
		{ type: '1', message: '我是机器人5', isPreview: true },
		{ type: '0', message: '用户6', isPreview: true },
		{ type: '1', message: '我是机器人6', isPreview: true },
		{ type: '0', message: '用户7', isPreview: true },
		{ type: '1', message: '我是机器人7', isPreview: true },
		{ type: '0', message: '用户8', isPreview: true },
		{ type: '1', message: '我是机器人8', isPreview: true }
	]);
	const { toClipboard } = clipboard3();
	/* 文本复制 */
	const handleCopyMessage = async (item, index) => {
		try {
			await toClipboard(item.message);
			ElMessage({ message: '复制成功!', type: 'success' })
		} catch (error) {
			ElMessage({ message: '复制失败!', type: 'error' })
		}
		popoverRefList[index].el.hide();
	}
	const handleDeleteMessage = (index) => {
		ElMessageBox.confirm('是否删除此消息?', '删除消息', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
			messageList.value.splice(index, 1);
		}).catch(() => {

		})
	}
	const handlePreviewMessage = (item, index, bool) => {
		nextTick(() => {
			messageList.value[index]['isPreview'] = bool;
		})
		popoverRefList[index].el.hide();
	}
	const handleRefreshMessage = (item, index) => {
		chatItemIndex.value = index;
		let str = '我是中国人 我爱我的祖国我是中国人 我爱我的祖国我是中国人 我爱我的祖国我是中国人 我爱我的祖国我是中国人 我爱我的祖国';
		if (item.message != str) {
			isStopBtn.value = true;
			messageList.value[index]['message'] = str;
			nextTick(() => {
				typedRefList.filter(v => v.index == index)[0].el.init();
				handleScrollBottom();
			})
		}
	}
	const handleStopMessage = () => {
		nextTick(() => {
			typedRefList.filter(v => v.index == chatItemIndex.value)[0].el.stop();
			isStopBtn.value = false;
		})
	}
	const handleScrollBottom = () => {
		nextTick(() => {
			(function smoothscroll () {
				const currentScroll = msgContentRef.value.scrollTop;   // 已经被卷掉的高度
				const clientHeight = msgContentRef.value.offsetHeight; // 容器高度
				const scrollHeight = msgContentRef.value.scrollHeight; // 内容总高度
				if (scrollHeight - 10 > currentScroll + clientHeight) {
					window.requestAnimationFrame(smoothscroll);
					msgContentRef.value.scrollTo(0, currentScroll + (scrollHeight - currentScroll - clientHeight) / 2);
				}
			})()
		})
	}
	const handleTypedComplete = () => {
		isStopBtn.value = false;
	}
	const handleClickFullScreen = (bool) => {
		isFullScreen.value = bool;
	}
	const handleAddMessageData = () => {
		cardList.value[cardList.value.length] = { id: cardList.value.length, keyword: 'new Chat' };
	}
	const handleClickLeftItem = (index) => {
		currentIndex.value = index;
	}
	const handleEditLeftItem = (index) => {
		currentIndex.value = index;
		isInt.value = true;
		nextTick(() => {
			inputRefList.filter(v => v.index == index)[0].el.focus();
		})
	}
	const handleSaveLeftItem = () => {
		isInt.value = false;
	}
	const handleRemoveLeftItem = (index) => {
		cardList.value.splice(index, 1);
		currentIndex.value = 0;
	}
	const handleIntBlur = () => {
		isInt.value = false;
	}
	const handleSearchIntChange = (val) => {
		isDisabled.value = val.length ? false : true;
	}
	const handleSendMessage = () => {
		if (!keyword.value.length) return;
		nextTick(() => {
			messageList.value[messageList.value.length] = { type: '0', message: keyword.value };
			keyword.value = "";
		})
	}
	const handleClearMessage = () => {
		ElMessageBox.confirm('是否清空会话?', '清空会话', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
			messageList.value = [];
		}).catch(() => {

		})
	}
	const handleDownLoadMessage = () => {
		ElMessageBox.confirm('是否将会话保存为图片?', '保存会话到图片', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
			html2canvas(msgListRef.value).then((canvas) => {
				proxy.$hevueImgPreview(canvas.toDataURL('image/jpeg'))
			});
		}).catch(() => {

		})
	}
</script>

<style lang="scss" scoped>
	.box-card {
		width: 100%;
		height: 100vh;
		padding: 20px;
		box-sizing: border-box;
		.app-container {
			width: 100%;
			height: 100%;
			overflow-y: auto;
			border-radius: 4px;
			border: 1px solid #e4e7ed;
			background-color: #ffffff;
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
			display: flex;
			flex-flow: row nowrap;
			position: relative;
			/* 全屏折叠按钮样式 */
			.right-icon-box {
				position: absolute;
				left: 0;
				top: 50%;
				transform: translate(-50%, 0);
				z-index: 2;
				background: #fff;
				cursor: pointer;
				.icon {
					border-radius: 50%;
					padding: 4px;
					border: 1px solid #e4e7ed;
					box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
					color: rgba(0, 0, 0, 0.83);
				}
			}
			/* 左侧栏样式 */
			.left-content {
				width: 260px;
				// border-right: 1px solid rgba(0, 0, 0, 0.1);
				border-right: 1px solid #e4e7ed;
				background-color: #ffffff;
				box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				position: relative;
				.left-head {
					width: 100%;
					padding: 20px 20px 12px;
					box-sizing: border-box;
				}
				.left-center {
					flex: 1;
					width: 100%;
					// border: 1px solid red;
					box-sizing: border-box;
					overflow-y: auto;
					.chat-list {
						width: 100%;
						padding: 0 20px;
						box-sizing: border-box;
						.chat-item {
							width: 100%;
							height: 46px;
							display: flex;
							flex-flow: row nowrap;
							justify-content: space-between;
							padding: 0 10px;
							margin: 8px 0;
							box-sizing: border-box;
							border: 1px solid #dddfe5;
							border-radius: 4px;
							color: #353637;
							cursor: pointer;
							.chat-item-info {
								flex: 1;
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								span {
									font-size: 16px;
								}
							}
							.icon-style {
								padding-right: 5px;
							}
							::v-deep .el-input__wrapper.is-focus {
								box-shadow: 0 0 0 1px #619c65;
							}
							.chat-icon-box {
								margin-left: 10px;
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
							}
						}
						.chat-item-active {
							border: 1px solid #619c65;
							border-radius: 4px;
							color: #619c65;
						}
					}
				}
				.left-foot {
					width: 100%;
					border-top: 1px solid #dddfe5;
					padding: 10px 0;
					box-sizing: border-box;
					display: flex;
					flex-flow: row nowrap;
					justify-content: center;
					align-items: center;
					.avtar {
						margin-left: 20px;
						cursor: pointer;
					}
					.person-box {
						flex: 1;
						display: flex;
						flex-direction: column;
						margin-left: 10px;
						b {
							font-size: 16px;
							padding-bottom: 10px;
						}
						span {
							font-size: 12px;
							color: #999;
						}
					}
				}
				/* 左侧全屏按钮样式 */
				.left-icon-box {
					position: absolute;
					right: -28px;
					top: 50%;
					transform: translate(-50%, 0);
					z-index: 2;
					background: #fff;
					cursor: pointer;
					border-radius: 50%;
					.icon {
						border-radius: 50%;
						padding: 4px;
						border: 1px solid #e4e7ed;
						box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
						color: rgba(0, 0, 0, 0.83);
					}
				}
				.btn {
					width: 100%;
					border: 1px dashed #619c65;
					&:hover {
						color: #619c65;
						background: #fff;
					}
					&:focus {
						color: #619c65;
						background: #fff;
					}
				}
			}
			.right-content {
				flex: 1;
				padding: 10px;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.msg-content {
					flex: 1;
					// border: 1px solid red;
					margin-bottom: 30px;
					overflow-y: auto;
					position: relative;
					&::after {
						display: block;
						content: "";
						clear: both;
					}
					.prompt {
						width: 100%;
						margin-top: 20px;
						display: flex;
						flex-direction: column;
						align-items: center;
						.prompt-txt {
							color: #d4d4d4;
							font-size: 14px;
							line-height: 3;
						}
					}
					.stop-btn-box {
						display: flex;
						justify-content: center;
						align-items: center;
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 10;
						background: rgba(0,0,0,.5);
						.stop-btn {
							background: #f0a020;
							border: 1px solid #f0a020;
							color: #fff;
							font-size: 14px;
							&:hover {
								background: #ea9a1a;
								border: 1px solid #ea9a1a;
							}
							&:focus {
								border: 1px solid #ea9a1a;
								background: #ea9a1a;
							}
						}
						.stop-icon {
							color: #fff;
							font-size: 18px;
						}
					}
				}
				/* 右侧搜索栏样式 */
				.search-box {
					display: flex;
					align-items: center;
					padding: 0 100px;
					box-sizing: border-box;
					.search-btn-box {
						display: flex;
						align-items: center;
					}
					.search-btn {
						margin-right: 20px;
						border: 1px solid #99cdac;
						color: #99cdac;
						&:hover {
							color: #5baa70;
							border: 1px solid #5baa70;
							background: #fff;
						}
						&:focus {
							border: 1px solid #5baa70;
							color: #5baa70;
							background: #fff;
						}
					}
					.search-icon {
						color: #000;
						padding-right: 20px;
						cursor: pointer;
					}
					.search-input-box {
						flex: 1;
						display: flex;
						align-items: center;
						.int {
						}
						::v-deep .int .el-input__wrapper.is-focus {
							box-shadow: 0 0 0 1px #99cdac;
						}
						.search-input-btn {
							margin-left: 10px;
							background: #99cdac;
							border: 1px solid #99cdac;
							&:hover {
								background: #99cdac;
								border: 1px solid #99cdac;
							}
							&:focus {
								border: 1px solid #99cdac;
								background: #99cdac;
							}
						}
						.search-input-btn-active {
							background: #5baa70;
							border: 1px solid #5baa70;
							&:hover {
								background: #5baa70;
								border: 1px solid #5baa70;
							}
							&:focus {
								border: 1px solid #5baa70;
								background: #5baa70;
							}
						}
					}
				}
			}
		}
		/* 聊天信息界面样式 */
		.message-box {
			width: 100%;
			padding: 20px;
			box-sizing: border-box;
			.message-list {
				width: 100%;
				display: flex;
				flex-direction: column;
				margin-bottom: 20px;
				.message-item {
					width: 100%;
					margin-bottom: 20px;
					&:last-child {
						margin-bottom: 0;
					}
					.user-message-box {
						width: 100%;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						.message-txt {
							max-width: 60%;
							margin: 0 10px 0 0;
							background: #daf7d4;
							padding: 10px;
							font-size: 14px;
							border-radius: 5px;
							line-height: 24px;
							text-align: justify;
						}
					}
					.message-icon-box {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.message-icon {
							transform: rotate(90deg);
							cursor: pointer;
							color: #d4d4d4;
							&:hover {
								color: #000;
							}
							&:first-child {
								padding-right: 10px;
							}
						}
					}
					.message-icon-other {
						transform: rotate(90deg);
						cursor: pointer;
						padding: 10px;
						color: #d4d4d4;
						&:hover {
							color: #000;
						}
					}
					.chat-message-box {
						width: 100%;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.message-txt {
							max-width: 60%;
							margin: 0 10px 0 10px;
							background: #f4f6f8;
							padding: 10px;
							font-size: 14px;
							border-radius: 5px;
							line-height: 24px;
							text-align: justify;
						}
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	/* 全局popover 样式 */
	.user-message-info {
		padding: 2px !important;
		.keyboard-box {
			display: flex;
			flex-direction: column;
			.keyboard-info {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				cursor: pointer;
				padding: 8px;
				box-sizing: border-box;
				.keyboard-icon-box {
					width: 100%;
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
				}
				span {
					color: rgba(0, 0, 0, 0.8);
					padding-left: 15px;
				}
				&:hover {
					background: #f3f3f5;
				}
			}
		}
	}
</style>