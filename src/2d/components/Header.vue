<template>
  <div class="app-header">
    <div class="app-header-left">
      <p>{{ (dataTime.year || "-") + "/" + (dataTime.month || "-") + "/" + (dataTime.date || "-") }}</p>
      <p>{{ (dataTime.day || "-") }}</p>
      <p>
        {{ (dataTime.hour || "-") + ": " + (dataTime.minute || "-") + ": " + (dataTime.second || "-") }}
      </p>
    </div>
    <div class="app-header-center">
      <p>合益智能</p>
      <Navbar></Navbar>
    </div>
    <div class="app-header-right">
      <img :src="'./assets/2d/images/duoyun.png'" />
      <p>{{ weather.weather || "-" }}</p>
      <p>{{ (weather.min || "-") + "℃~" + (weather.max || "-") + "℃" }}</p>
      <p>PM2.5 · 良好</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getDate } from "@/2d/assets/js/dateTimeWeater";
import Navbar from "./Navbar.vue"

let timer = "";
const weather = {
  city: '重庆',
  weather: "多云",
  min: "10",
  max: "18",
};
let dataTime = ref("");

onMounted(() => {
  timer = setInterval(async () => {
    dataTime.value = await getDate();
  }, 1000);
});

onUnmounted(() => {
  console.log("页面/组件退出，触发了onUnmounted钩子函数");
  clearInterval(timer);
});
</script>

<style lang="less" scoped>
.app-header {
  pointer-events: all;
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 11.8vh;
  background: url("./assets/2d/images/top.png") top / 100% 6vh no-repeat,
    url("./assets/2d/images/dingbu.png") top / 38.46vw 11.8vh no-repeat;
  color: #ffffff;

  &-left {
    flex: 1;
    margin: 1.24vh 0 0 2.5vw;
    font-size: 0.625vw;
    display: flex;

    p {
      font-size: 0.625vw;
      margin-right: 0.83vw;
    }
  }

  &-center {
    flex: 1;
    text-align: center;

    p {
      font-size: 1.67vw;
      font-family: 'YouSheBiaoTiHei';
      font-weight: 400;
    }
  }

  &-right {
    flex: 1;
    display: flex;
    justify-content: end;
    margin: 1.24vh 2.5vw 0 0;
    font-size: 0.625vw;
    
    p {
      font-size: 0.625vw;
      margin-left: 0.83vw;
    }

    img {
      width: 0.89vw;
      height: 1.55vh;
    }
  }
}
</style>