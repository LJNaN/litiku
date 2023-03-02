<template>
  <div class="bottom">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
@keyframes bottom-in {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateX(0);
  }
}

.bottom {
  animation: bottom-in 0.5s ease;
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  bottom: 0;
  margin: 0 0.52vw 1.04vh 0.52vw;
  width: calc(100% - 1.04vw);
}
</style>