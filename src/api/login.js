import request from '@/utils/request'

//新获取用户登录token v2
export function fetchUserLoginToken(params) {
    return request({
        url: '1127230306170961/qianzizhilian/token',
        method: 'post',
        data: params
    })
}

