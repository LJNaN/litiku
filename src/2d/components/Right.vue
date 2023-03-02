<template>
  <div class="right">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
@keyframes right-in {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(0);
  }
}

.right {
  animation: right-in 0.5s ease;
  position: absolute;
  right: 0;
  margin: 6.21vh 0.52vw 0 0;
  height: 71vh;
  width: 18%;
  z-index: 1;
}


</style>