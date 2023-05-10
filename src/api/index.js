/*
 * @Date: 2023-05-10 15:40:11
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-10 15:45:02
 */
import request from '@/utils/myRequest'

export function getRanImAccount() {
    return request({
        url: 'freed-pcs/pcs/im/getRanImAccount',
        method: 'get'
    })
}

export function createImTextMessage(params) {
    return request({
        url: 'freed-pcs/pcs/intf/im/createImTextMessage',
        method: 'post',
        data: params
    })
}

export function listMedinsDict(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientRecipel/listMedinsDict?hospitalId='+params,
        method: 'get',
    })
}

export function getListHospitalDiagnosis(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientRecipel/listHospitalDiagnosis?hospitalId='+params,
        method: 'get',
    })
}

export function retailServiceGoods(params) {
    return request({
        url: 'freed-erp/retail/service/goods/listRetailShopStcokGoods?goodsWhere='+params.goodsWhere+'&retailShopId='+params.retailShopId+'&ypFlag='+params.ypFlag,
        method: 'get',
    })
}

export function commitAndSaveRecipel(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientRecipel/commitRecipelByDoctor',
        method: 'post',
        data: params
    })
}

export function listWaitConsultPatient(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientConsult/listWaitConsultPatient?doctorId='+params,
        method: 'get'
    })
}

export function startOpenRpToPatient(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientConsult/startOpenRpToPatient?doctorId='+params.doctorId+'&consultId='+params.consultId,
        method: 'get'
    })
}

export function listImHistoryMessage(params) {
    return request({
        url: 'freed-pcs/pcs/hospital/pcsPatientConsult/listImHistoryMessage?consultId='+params,
        method: 'get'
    })
}

// 云端录制开始
export function agoraStart(params) {
    return request({
        url: 'freed-open/tss/im/video/agoraStart',
        method: 'post',
        data: params
    })
}

// 云端录制结束
export function agoraStop(params) {
    return request({
        url: 'freed-open/tss/im/video/agoraStop',
        method: 'post',
        data: params
    })
}

// 生成视频token数据
export function buildToken(params) {
    return request({
        url: 'freed-open/tss/im/video/buildToken',
        method: 'post',
        data: params
    })
}
