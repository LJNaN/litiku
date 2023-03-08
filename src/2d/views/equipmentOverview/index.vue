<template>
  <div class="main">
    <Left></Left>
    <Right></Right>
    <Bottom></Bottom>
  </div>
</template>

<script setup>
// 判断是否显示页面类容

import Left from "@/2d/views/equipmentOverview/left.vue"
import Right from "@/2d/views/equipmentOverview/right.vue"
import Bottom from "@/2d/views/equipmentOverview/bottom.vue"

</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;

  * {
    pointer-events: all;
  }
}
</style>