<!--
 * @Date: 2023-05-10 15:42:00
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-10 21:56:54
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
								<el-input v-model="item.keyword" size="small" @blur="handleIntBlur" placeholder="请输入" v-if="isInt && index == currentIndex" />
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
				<div class="msg-content">
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
						<div class="message-list">
							<div class="message-item" v-for="(item,index) in messageList" :key="index">
								<!-- 用户消息 start -->
								<div class="user-message-box" v-if="item.type == '0'">
									<el-icon>
										<MoreFilled />
									</el-icon>
									<div class="message-txt">{{item.message}}</div>
									<el-avatar :size="40" :src="avtar1" class="avtar" />
								</div>
								<!-- 用户消息 end -->
								<!-- 机器消息 start -->
								<div class="chat-message-box" v-else>

								</div>
								<!-- 机器消息 end -->
							</div>
						</div>
					</div>
					<!-- 聊天内容 end -->
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
						<el-input v-model="keyword" clearable autofocus class="int" @input="handleSearchIntChange" placeholder="仅供学习交流使用，请勿滥用～～" />
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
	import { ref } from 'vue'
	import { InfoFilled } from '@element-plus/icons-vue'
	import { ElMessageBox } from 'element-plus'
	const currentIndex = ref(0);
	const keyword = ref("");
	const isInt = ref(false);
	const isDisabled = ref(true);
	const isFullScreen = ref(false);
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
	const messageList = ref([]);
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
		messageList.value[messageList.value.length] = { type: '0', message: keyword.value };
		keyword.value = "";
		console.log(messageList.value)
	}
	const handleClearMessage = () => {
		ElMessageBox.confirm('是否清空会话?', '清空会话', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {

		}).catch(() => {

		})
	}
	const handleDownLoadMessage = () => {
		ElMessageBox.confirm('是否将会话保存为图片?', '保存会话到图片', { confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {

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
					margin-bottom: 10px;
					overflow-y: auto;
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
				}
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
		
	}
</style>