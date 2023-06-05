<template>
  <div class="bottom" id="bottomBar" style="animation: bottom-in 0.5s ease;">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.bottom {
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  bottom: 0;
  margin: 0 0.52vw 1.04vh 0.52vw;
  width: calc(100% - 1.04vw);
}
</style>