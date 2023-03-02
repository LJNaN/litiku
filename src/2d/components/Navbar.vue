<template>
  <Transition>
    <div v-if="navShow" class="main">
      <div class="left" :class="{ active: activeNavIndex === 0 }" @click="handleNav(0)">{{ navList[0].name }}</div>
      <div class="center" :class="{ active: activeNavIndex === 1 }" @click="handleNav(1)">{{ navList[1].name }}</div>
      <div class="right" :class="{ active: activeNavIndex === 2 }" @click="handleNav(2)">{{ navList[2].name }}</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import router from "@/2d/router/index"

const navShow = ref(false)

let activeNavIndex = ref(1)
const navList = [{
  index: 0,
  name: '设备概览',
  path: '/equipmentoverview'
}, {
  index: 1,
  name: '数字库区',
  path: '/digitalreservoirarea'
}, {
  index: 2,
  name: '订单任务',
  path: '/ordertask'
}]

function handleNav(index) {
  activeNavIndex.value = index
  router.push(navList[index].path)
}


// 首次跳转   获取到url所对应的页面  更新navbar
let watchFlag = true
watch(() => router.currentRoute.value.path, newValue => {
  if (watchFlag) {
    watchFlag = false
    if (newValue != '/') {
      const navIndex = navList.find(e => e.path === newValue)
      handleNav(navIndex.index)
    }
    navShow.value = true
  }
}, {
  deep: true
})

</script>

<style lang="less" scoped>
.main {
  position: relative;

  .left,
  .center,
  .right {
    position: absolute;
    color: #8C8C8C;
    font-size: 1.04vw;
    font-family: 'YouSheBiaoTiHei';
    font-weight: 400;
    width: 5.84vw;
    height: 4.24vh;
    line-height: 3.73vh;
    cursor: pointer;
  }

  .left {
    top: 0.62vh;
    left: 15%;
    transform: rotate(5deg);
  }

  .center {
    top: 1.66vh;
    left: 50%;
    transform: translateX(-50%);
  }

  .right {
    top: 0.62vh;
    right: 15%;
    transform: rotate(-5deg);
  }

  .active {
    color: #FFF;
    background: url('./assets/2d/images/navHighLight.png') center / 100% 100% no-repeat;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>