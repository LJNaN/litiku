<template>
  <div class="marquee_wrapper">
    <div>
      <slot name="thead"></slot>
    </div>
    <div class="scroll_table" ref="scroll">
        <slot name="tbody"></slot>
    </div>
  </div>
</template>

<script>
import Lamp from "../assets/js/marquee"
export default {
  mounted() {
    this.lamp = new Lamp(this.$refs.scroll,50)
  },
  updated() {
    this.lamp.Refresh()
  }
}
</script>

<style scoped>
.marquee_wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll_table {
  width: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;
}
.scroll_table .table_wrapper {
  width: 100%;
  position: absolute;
  margin: 0;
  top: 0;
}
.scroll_table::-webkit-scrollbar {
  display: none;
}
</style>