/*
 * @Date: 2023-05-10 15:37:54
 * @LastEditors: fyf fengyuefei12345@163.com
 * @LastEditTime: 2023-05-10 21:47:48
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import './styles/element/index.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import hevueImgPreview from 'hevue-img-preview'
const app = createApp(App)
app.use(hevueImgPreview).use(store).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}