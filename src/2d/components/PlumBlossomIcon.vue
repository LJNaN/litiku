<template>
  <div class="main">
    <div class="circular circular1"></div>
    <div class="circular circular2"></div>
    <div class="circular circular3"></div>
    <div class="circular circular4"></div>
    <div class="circular circular5"></div>
  </div>
</template>

<script setup>
const circularList = [
  "rgba(206, 177, 156, 0.3)",
  "rgba(206, 177, 156, 0.5)",
  "rgba(239, 156, 0, 1)",
  "rgba(206, 177, 156, 0.5)",
  "rgba(206, 177, 156, 1)",
];
</script>

<style lang="less" scoped>
.main {
  position: absolute;
  top: 0.62vh;
  left: 0.94vw;
  .circular {
    position: absolute;
    height: 0.52vh;
    width: 0.26vw;
    // border: 1px solid #ceb19c;
    border-radius: 2px;
  }
  .circular1 { 
    border: 1px solid rgba(206, 177, 156, 0.3);
  }
  .circular2 { 
    top: 0.62vh;
    left: -0.31vw;
    border: 1px solid rgba(206, 177, 156, 0.5);
  }
  .circular3 { 
    top: 0.62vh;
    background-color: rgba(239, 156, 0, 1);
  }
  .circular4 { 
    top: 0.62vh;
    left: 0.31vw;
    border: 1px solid rgba(206, 177, 156, 0.5);
  }
  .circular5 { 
    top: 1.14vh;
    border: 1px solid rgba(206, 177, 156, 1);
  }

}
</style>
