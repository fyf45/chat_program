import { EaseChatSDK, EaseChatClient } from '@/IM/initwebsdk'
import { setMessageKey, createMessage } from '@/utils/handleSomeData'
import _ from 'lodash'
// import { ref, toRaw } from 'vue';
import { messageType } from '@/constant'
import { usePlayRing } from '@/hooks'
const { ALL_MESSAGE_TYPE } = messageType
import { createImTextMessage } from '@/api/index'
const Message = {
    state: {
        messageList: {}
    },
    mutations: {
        UPDATE_MESSAGE_LIST: (state, msgBody) => {
            const toUpdateMsgList = _.assign({}, state.messageList)
            const listKey = setMessageKey(msgBody)
            if (!toUpdateMsgList[listKey]) {
                toUpdateMsgList[listKey] = []
                _.unionBy(toUpdateMsgList[listKey].push(msgBody), (m) => m.id)
            } else {
                _.unionBy(toUpdateMsgList[listKey].push(msgBody), (m) => m.id)
            }
            state.messageList = toUpdateMsgList
        },
        UPDATE_HISTORY_MESSAGE: (state, payload) => {
            const { listKey, historyMessage } = payload
            const toUpdateMsgList = _.assign({}, state.messageList)
            if (!toUpdateMsgList[listKey]) {
                toUpdateMsgList[listKey] = []
                _.unionBy(
                    toUpdateMsgList[listKey].push(...historyMessage),
                    (m) => m.id
                )
            } else {
                _.unionBy(
                    toUpdateMsgList[listKey].unshift(...historyMessage),
                    (m) => m.id
                )
            }
            state.messageList = toUpdateMsgList
        },
        //清除某条会话消息
        CLEAR_SOMEONE_MESSAGE: (state, payload) => {
            state.messageList[payload] = []
        },
        //撤回删除消息
        CHANGE_MESSAGE_BODAY: (state, payload) => {
            const { type, key, mid } = payload
            if (type === 'recall') {
                if (state.messageList[key]) {
                    const res = _.find(
                        state.messageList[key],
                        (o) => o.id === mid
                    )
                    res.isRecall = true
                }
            }
            if (type === 'deleteMsg') {
                if (state.messageList[key]) {
                    const sourceData = state.messageList[key]
                    const index = _.findIndex(
                        state.messageList[key],
                        (o) => o.id === mid
                    )
                    sourceData.splice(index, 1)
                    state.messageList[key] = _.assign([], sourceData)
                }
            }
        }
    },
    actions: {
        //添加新消息
        createNewMessage: ({ dispatch, commit }, params) => {
            const { isOpenPlayRing, playRing } = usePlayRing()
            const key = setMessageKey(params)
            commit('UPDATE_MESSAGE_LIST', params)
            //目前根据全局配置进行新消息声音提示，后续计划根据会话级别可进行设置是否声音提示，比如设定免打扰。
            if (isOpenPlayRing.value) playRing()
            dispatch('gatherConversation', key)
        },
        //获取历史消息
        getHistoryMessage: async ({ dispatch, commit }, params) => {
            const { id, chatType, cursor } = params
            return new Promise((resolve, reject) => {
                const options = {
                    targetId: id,
                    pageSize: 10,
                    cursor: cursor,
                    chatType: chatType,
                    searchDirection: 'up'
                }
                EaseChatClient.getHistoryMessages(options)
                    .then((res) => {
                        const { cursor, messages } = res
                        messages.length > 0 &&
                            messages.forEach((item) => {
                                item.read = true
                            })
                        resolve({ messages, cursor })
                        commit('UPDATE_HISTORY_MESSAGE', {
                            listKey: id,
                            historyMessage: _.reverse(messages)
                        })
                        //提示会话列表更新
                        dispatch('gatherConversation', id)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        //发送展示类型消息
        sendShowTypeMessage: async ({ dispatch, commit }, params) => {
            return new Promise((resolve, reject) => {
                //主要作用为创建消息Options中附件会有上传失败的回调函数。
                //传入errorCallback，让附件类型消息在上传失败时调用reject抛出error
                const errorCallback = (error) => {
                    reject(error)
                }
                const options = createMessage.createOptions(
                    params,
                    errorCallback
                )
                const msg = EaseChatSDK.message.create(options)
                EaseChatClient.send(msg)
                    .then((res) => {
                        const { serverMsgId } = res
                        console.log('>>>>发送成功', res)
                        msg.id = serverMsgId
                        msg.from = EaseChatClient.user
                        const msgBody = createMessage.createMsgBody(msg)
                        commit('UPDATE_MESSAGE_LIST', msgBody)
                        // 提示会话列表更新
                        dispatch('gatherConversation', msgBody.to)
                        if(window.sysGlbInfo){
                            let param = {
                                "appId": window.sysGlbInfo.imAccInfo.imAppId,
                                "appUserId": window.sysGlbInfo.imAccInfo.imUserId,
                                "busiCode": window.selectConsult.consultId,
                                "busiType": "PCS",
                                "busiUserId": window.sysGlbInfo.doctorId,
                                "busiUserType": "1041",
                                "message": msg.msg,
                                "msgType": "1",
                                "thirdContent": JSON.stringify(msgBody)
                            }
                            if(msg.type == 'custom'){
                                param.msgType = "5"
                                param.message = JSON.stringify(msg.ext.msg)
                            }else if(msg.type == 'img'){
                                param.msgType = "2"
                                param.message = msg.url
                            }else if(msg.type == 'audio'){
                                param.msgType = "3"
                                param.message = msg.url
                            }
                            createImTextMessage(param)
                        }
                        resolve('OK')
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        //添加通知类消息
        createInformMessage: ({ dispatch, commit }, params) => {
            /** 
               const params = {
                    from: '',
                    to: '',
                    chatType: '',
                    msg:''
                }
            */
            const msgBody = _.cloneDeep(params)
            msgBody.type = ALL_MESSAGE_TYPE.INFORM
            const key = setMessageKey(params)
            console.log('>>>>>>添加系统消息', params)
            commit('UPDATE_MESSAGE_LIST', msgBody)
            dispatch('gatherConversation', key)
        },
        //撤回消息
        recallMessage: async ({ dispatch, commit }, params) => {
            const { mid, to, chatType } = params
            return new Promise((resolve, reject) => {
                EaseChatClient.recallMessage({ mid, to, chatType })
                    .then(() => {
                        commit('CHANGE_MESSAGE_BODAY', {
                            type: 'recall',
                            key: to,
                            mid
                        })
                        dispatch('gatherConversation', to)
                        resolve('OK')
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
}
export default Message
