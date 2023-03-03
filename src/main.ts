import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './2d/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/2d/assets/js/flexible.js'
import Chart from '@/2d/components/chart/Chart.vue'
import CardChunk from "@/2d/components/chart/CardChunk.vue";



const app = createApp(App)
app.config.globalProperties.$isOurSite = true  // 控制是否是官网数据


app.component(Chart.name, Chart);
app.component('CardChunk', CardChunk);
app.use(ElementPlus).use(router).mount('#app')
