<template>
  <div class="main">
    <Left></Left>
    <Right></Right>
    <Bottom></Bottom>
  </div>
</template>

<script setup>
// 判断是否显示页面类容

</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  * {
    pointer-events: all;
  }
}

</style>