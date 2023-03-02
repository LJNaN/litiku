<template>
  <div class="left">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
@keyframes left-in {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
}

.left {
  animation: left-in 0.5s ease;
  position: absolute;
  margin: 6.2vh 0 0 0.52vw;
  height: 71vh;
  width: 18%;
  z-index: 1;
}
</style>