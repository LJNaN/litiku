<template>
  <div class="left" id="leftBar" style="animation: left-in 0.5s ease;">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.left {
  position: absolute;
  margin: 6.2vh 0 0 0.52vw;
  height: 71vh;
  width: 18%;
  z-index: 1;
}
</style>