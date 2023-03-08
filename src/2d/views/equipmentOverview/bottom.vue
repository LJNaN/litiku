<template>
  <Bottom>
    <div class="main">
      <div v-for="(item, index) in navList" :key="index" class="item" :class="{ active: activeIndex === index }"
        @click="handleNav(index)">
        {{ item }}
      </div>
    </div>
  </Bottom>
</template>

<script setup>
import Bottom from "@/2d/components/Bottom.vue"
import { showModel } from '@/3d/ktJS/API.js'
import { ref } from "vue"

let activeIndex = ref(-1)
const navList = ['入库分拣线', '立体库', '出库分拣线', '拣选机器人', '循环投料线']

function handleNav (index) {
  if (index === activeIndex.value) index = -1
  activeIndex.value = index
  showModel(index)
}

</script>

<style lang="less" scoped>
.main {
  position: absolute;
  bottom: 7.45vh;
  display: flex;

  .item {
    cursor: pointer;
    width: 8.34vw;
    height: 5.8vh;
    background: url('./assets/2d/images/equipmentOverview/bottombg.png') center / 100% 100% no-repeat;
    color: #FFF;
    font-family: 'YouSheBiaoTiHei';
    font-size: 1.15vw;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
  }

  .active {
    background: url('./assets/2d/images/equipmentOverview/bottombg-active.png') center / 100% 100% no-repeat;
  }
}
</style>