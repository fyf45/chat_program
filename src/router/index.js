/*
 * @Date: 2023-05-10 15:41:59
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-10 16:13:10
 */
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    /* 聊天页 */
    {
        path: '/',
        name: 'Chat',
        component: () => import('../views/Chat'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
