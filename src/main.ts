import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './2d/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/2d/assets/js/flexible.js'
import Chart from '@/2d/components/chart/Chart.vue'
import CardChunk from "@/2d/components/chart/CardChunk.vue";
import '@/2d/assets/font/font.css'
import {CACHE} from '@/3d/ktJS/CACHE'



const app = createApp(App)
const isOurSite = true  // 控制是否是官网数据
app.config.globalProperties.$isOurSite = isOurSite
CACHE.isOurSite = isOurSite


app.component(Chart.name, Chart);
app.component('CardChunk', CardChunk);
app.use(ElementPlus).use(router)

app.mount('#app')