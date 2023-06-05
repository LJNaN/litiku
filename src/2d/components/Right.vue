<template>
  <div class="right" id="rightBar" style="animation: right-in 0.5s ease;">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.right {
  position: absolute;
  right: 0;
  margin: 6.21vh 0.52vw 0 0;
  height: 71vh;
  width: 18%;
  z-index: 1;
}
</style>