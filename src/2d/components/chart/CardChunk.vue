<template>
  <div class="chunk">
    <div class="chunk_head">
      <PlumBlossomIcon></PlumBlossomIcon>
      <span class="tit">{{ title }}</span>
      <div class="more-content">
        <div class="more" v-for="(item, index) in moreText" :key="index">
          <div :style="{ backgroundColor: item.color }" class="circular"></div>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="chunk_body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import PlumBlossomIcon from '@/2d/components/PlumBlossomIcon.vue'
import { defineProps } from "vue";
const props = defineProps({
  title: String,
  moreText: Object,
  moreColor: {
    type: String,
    default: "#999999",
  },
});
</script>
<style lang="less" scoped>
.chunk {
  display: flex;
  flex-direction: column;

  .chunk_head {
    width: 100%;
    height: 3.5rem;
    font-size: 0.2rem;
    color: #FFF;
    line-height: 3.5rem;
    align-items: center;
    padding-left: 4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;

    .tit {
      padding: 0 0.125rem;
    }

    .more-content {
      display: flex;
      margin-right: 1.04vw;
      .more {
        display: flex;
        align-items: center;
        margin-left: 0.42vw;
        span {
          margin-left: 0.21vw;
        }
      }

      .circular {
        height: 0.52vh;
        width: 0.26vw;
        border-radius: 0.13vw;
      }
    }
  }

  .chunk_body {
    flex: 1;
  }
}
</style>
