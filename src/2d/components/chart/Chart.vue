<template>
  <div class="chart">
    <div ref="chart" :style="{ height: height, width: width }" @mouseover="chartMouseover" @mouseout="chartMouseout" />
  </div>
</template>
<script>
// 全局引入
import * as echarts from "echarts";
import {debounce} from "@/2d/assets/js/debounce"
import { toRaw, markRaw } from "vue";
// 按需引入
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// import * as echarts from "echarts/core";
// // 引入柱状图图表，图表后缀都为 Chart
// import { BarChart } from "echarts/charts";
// // 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
// import { TitleComponent,LegendComponent, TooltipComponent, GridComponent } from "echarts/components";
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import { CanvasRenderer } from "echarts/renderers";
// // 注册必须的组件
// echarts.use([TitleComponent,LegendComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

export default {
  name: "ChartView",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    gap: {
      type: Number,
      default: 1
    },
    autoTooltip: {
      type: Boolean,
      default: false,
    },
    autoSelect: {
      type: Boolean,
      default: false,
    },
    chartOption: {
      type: [Object, null],
      required: true,
    },
    type: {
      type: String,
      default: "canvas",
    },
  },
  data() {
    return {
      chart: null,
      dataLen: 0,
      tooltip: {
      }
    };
  },
  watch: {
    chartOption: {
      deep: true,
      handler(newVal) {
        if (newVal?.hasOwnProperty && newVal.hasOwnProperty('series')) {
          this.$nextTick(() => {
            this.setOptions(toRaw(newVal));
          })
        }
      },
    },
  },
  mounted() {
    if (this.chartOption?.hasOwnProperty && this.chartOption.hasOwnProperty('series')) {
      this.initChart();
      if (this.autoResize) {
        window.addEventListener("resize", this.resizeHandler);
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalTick);
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    this.chart.dispose();
    this.chart = null;
  },
  activated() {
    this.resizeHandler()
  },
  methods: {
    resizeHandler() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    initChart(option) {
      if (!option) option = toRaw(this.chartOption);
      if (!option) return;
      this.dataLen = option.series[0].data.length; //数据长度
      this.chart = markRaw(echarts.init(this.$refs.chart, "", {
        renderer: this.type,
      }));
      
    if (option?.hasOwnProperty && option.hasOwnProperty('tooltip')) {
      option.tooltip = Object.assign({},option.tooltip,this.tooltip)
    }
      this.chart.setOption(option);
      this.chart.on("click", this.handleClick);
      // 执行自动播放
      if (this.dataLen > 0) this.setTimer()
    },
    chartMouseover: debounce(function() {
        if(this.intervalTick) {
          if(this.currentIndex > -1){
            this.chart.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: this.currentIndex,
            });
            this.chart.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: this.downIndex,
            });
          }
          clearInterval(this.intervalTick);
        }
    }),
      //图表的鼠标移出事件，继续轮播图表
    chartMouseout: debounce(function() {
      this.setTimer();
    }),
    setTimer() {
      clearInterval(this.intervalTick)
      if (!this.autoTooltip && !this.autoSelect) return;
      this.currentIndex = -1; // 默认为-1
      this.downIndex = this.dataLen - this.gap;
      this.intervalTick = setInterval(() => {
        if (this.currentIndex < this.dataLen - this.gap) {
          this.currentIndex += this.gap
        } else {
          this.currentIndex = 0
        } // 高亮当前图形
        this.downIndex = this.currentIndex == 0 ? this.dataLen - this.gap : this.currentIndex - this.gap;
        // 显示 tooltip
        if(this.autoTooltip)this.chart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: this.currentIndex,
        });
        // 切换选中状态
        if(this.autoSelect){
          this.chart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: this.currentIndex,
          });
          this.chart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: this.downIndex,
          });
        }
      }, 3000);
    },
    handleClick(params) {
      this.$emit("click", params);
    },
    setOptions(option) {
      if (!this.chart) {
        this.initChart()
        return
      }
      // this.clearChart();
      this.resizeHandler();
      if (this.chart) {
        this.dataLen = option.series[0].data.length; //数据长度
        if (option?.hasOwnProperty && option.hasOwnProperty('tooltip')) {
          option.tooltip = Object.assign({},option.tooltip,this.tooltip)
        }
        this.chart.setOption(option);
        // 执行自动播放
        this.setTimer()
      }
    },
    clearChart() {
      this.chart && this.chart.clear();
    },
  },
};
</script>
<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>