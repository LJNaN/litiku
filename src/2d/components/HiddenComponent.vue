<template>
  <div class="hideenIcon" id="hideenIcon" :style="{
    background: `url(/assets/2d/images/${hidden ? '1' : '2'}.png) center / 100% 100%`
  }" @click="handleHidden">
  </div>
</template>

<script setup>
import router from "@/2d/router/index"
import { ref, watch } from 'vue'
let hidden = ref(false)
console.log('router: ', router)

watch(
  () => router.currentRoute.value.path,
  () => {
    const hideenIcon = document.getElementById('hideenIcon')
    hideenIcon.style.animation = ''
    setTimeout(() => {
      hideenIcon.style.animation = `0.5s ease 0s 1 normal both running icon-in`
    }, 0)
  }
)

function handleHidden () {
  const left = document.getElementById('leftBar')
  const right = document.getElementById('rightBar')
  const bottom = document.getElementById('bottomBar')
  const hideenIcon = document.getElementById('hideenIcon')
  if (left && right && bottom) {
    hidden.value = !hidden.value
    left.style.animation = ''
    right.style.animation = ''
    bottom.style.animation = ''
    hideenIcon.style.animation = ''
    setTimeout(() => {
      left.style.animation = `0.5s ease 0s 1 ${hidden.value ? 'reverse' : 'normal'} both running left-in`
      right.style.animation = `0.5s ease 0s 1 ${hidden.value ? 'reverse' : 'normal'} both running right-in`
      bottom.style.animation = `0.5s ease 0s 1 ${hidden.value ? 'reverse' : 'normal'} both running bottom-in`
      hideenIcon.style.animation = `0.5s ease 0s 1 ${hidden.value ? 'reverse' : 'normal'} both running icon-in`
    }, 0)
  }
}
</script>

<style lang="less" scoped>
.hideenIcon {
  position: absolute;
  z-index: 2;
  pointer-events: all;
  cursor: pointer;
  top: 6.4%;
  right: 19%;
  width: 2vw;
  height: 2vw;
}
</style>