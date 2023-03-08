
<template>
  <div class="body-box">
    <Header></Header>
    <router-view></router-view>
  </div>
  <canvas ref="sceneEl" class="sceneEl"></canvas>
</template>

<script setup>
// import DevicePixelRatio from '@/2d/assets/js/DevicePixelRatio.js';
import Header from "@/2d/components/Header.vue"
import { onMounted, ref } from 'vue'
import { sceneOnLoad } from '@/3d/ktJS/index.js'

const sceneEl = ref(null)

onMounted(() => {
  sceneOnLoad({ domElement: sceneEl.value })
  // new DevicePixelRatio().init();
})
</script>

<style lang="less" scoped>
.body-box {
  overflow: hidden;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  background: url("./assets/2d/images/mask.png") center / 100% 100% no-repeat;
}

.sceneEl {
  z-index: 0;
  pointer-events: all;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
}
</style>