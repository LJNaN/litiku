<template>
  <Right>
    <card-chunk title="Pad库" class="chunk1">
      <div class="chunk1-body">
        <div class="chunk1-item" v-for="(item, index) in padStore" :key="index">
          <img :src="'./assets/2d/images/digitalReservoirArea/' + item.img" />
          <div class="chunk1-item-center">
            <p>{{ item.name }}</p>
            <p>存储率</p>
          </div>
          <p class="chunk1-item-rate">{{ item.value }}<span style="font-size: 0.73vw">%</span></p>
        </div>
      </div>
    </card-chunk>

    <card-chunk title="手机库储存率" class="chunk2">
      <chart-view :chartOption="echart.phoneRateOption.value || {}" auto-tooltip></chart-view>
    </card-chunk>
  </Right>
</template>

<script setup>
import Right from "@/2d/components/Right.vue"
import axios from "axios";
import { ref, reactive, onMounted } from "vue";

onMounted(() => {
  getStockRatio()
  // echart.phoneRateChart()
})

// 30s update
setInterval(() => {
  // getStockRatio()
}, 30000)


const padStore = ref([
  {
    name: "1号",
    value: 0,
    img: "pad1.png",
  },
  {
    name: "2号",
    value: 0,
    img: "pad2.png",
  },
])

function getStockRatio() {
  axios.get('/api/GetInventoryRatio').then(res => {
    echart.phoneRateList.value = []
    if (res.status === 200) {
      padStore.value[0].value = res.data.message.堆垛机1
      padStore.value[1].value = res.data.message.堆垛机2

      delete res.data.message.堆垛机1
      delete res.data.message.堆垛机2
      const newArr = []
      for (let key in res.data.message) {
        newArr.push({
          id: key.replace("堆垛机", ""),
          value: res.data.message[key]
        })
      }
      echart.phoneRateList.value = newArr
      echart.phoneRateChart()
    }
  }).catch(() => {
    padStore.value[0].value = '0.00'
    padStore.value[1].value = '0.00'

    const newArr = []
    for (let i = 1; i < 17; i++) {
      newArr.push({
        id: i,
        value: 17 - i
      })
    }
    echart.phoneRateList.value = newArr
    echart.phoneRateChart()
  })
}




const echart = {
  phoneRateList: ref([]),
  phoneRateOption: reactive({}),
  phoneRateChart() {
    const datas = echart.phoneRateList.value;

    const myColor = "#EF9C00";
    const xData = datas.map((item) => item.id);
    const yData = datas.map((item) => item.value);
    const yDataR = JSON.parse(JSON.stringify(yData)).reverse();

    const max = 100;
    let maxData = [];
    for (let i = 0; i < echart.phoneRateList.value.length; i++) {
      maxData.push(max);
    }

    let option = {
      grid: {
        left: "5%",
        right: "5%",
        bottom: "3%",
        top: "-3%",
        containLabel: true,
      },
      xAxis: [
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      yAxis: [
        {
          show: false,
          inverse: true,
          data: yData,
        },
        {
          show: true,
          data: yDataR,
          offset: 0,
          position: "right",
          axisLabel: {
            lineHeight: -6,
            verticalAlign: "bottom",
            fontWeight: "bold",
            fontSize: 12,
            offset: [10, 0],
            color: "#FFF",
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(150,150,150,0.1)",
          },
        },
        formatter: function (data) {
          const text = `${xData[data[0].dataIndex]} 号库<br /> ${data[1].marker
            } ${data[1].data}%`;
          return text;
        },
      },
      series: [
        {
          name: "满值",
          z: 1,
          show: true,
          type: "bar",
          xAxisIndex: 1,
          barGap: "-100%",
          barWidth: 14,
          itemStyle: {
            color: "none",
            borderColor: "#FFF",
            borderWidth: 0.5,
          },
          label: {
            show: true,
            position: "left",
            fontSize: 12,
            offset: [-15, 0],
            color: "#fff",
            fontWeight: "bold",
            formatter: function (data) {
              return xData[data.dataIndex];
            },
            align: "center",
            verticalAlign: "middle",
            backgroundColor: "#906e30",
            height: 20,
            width: 20,
            borderColor: "#a99d78",
            borderWidth: 1,
            borderRadius: 0.5,
          },
          data: maxData,
        },
        {
          name: "储存率",
          show: true,
          type: "bar",
          xAxisIndex: 1,
          barWidth: 4,
          barGap: "-65%",
          itemStyle: {
            borderRadius: 4,
            color: "#EF9C00",
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: yData,
          animationDelay: 1000,
          animationDuration: 1000,
        },
        {
          name: "外圆",
          type: "scatter",
          emphasis: {
            scale: false,
          },
          xAxisIndex: 1,
          symbolSize: 6,
          symbolOffset: [0, 2.5],
          itemStyle: {
            color: myColor,
            shadowColor: "rgba(255, 255, 255, 0.5)",
            shadowBlur: 5,
            borderWidth: 1,
            opacity: 1,
          },
          z: 2,
          data: yData,
          animationDelay: 1500,
          animationDuration: 1000,
        },
      ],
    };

    echart.phoneRateOption.value = option
  },
};

</script>

<style lang="less" scoped>
.chunk1 {
  height: 14.3vh;
  background: url("./assets/2d/images/digitalReservoirArea/chartBG3.png") no-repeat left top / 100% 100%;

  .chunk1-body {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.52vw;

    .chunk1-item {
      flex: 1;
      display: flex;
      color: #fff;

      img {
        width: 2.8vw;
        height: 5.59vh;
      }

      &-center {
        font-size: 0.2vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.62vh 0 1.04vh 0;
      }

      &-rate {
        margin: 1.2vh 0 0 0.2vw;
        font-size: 1.1vw;
        font-family: 'YouSheBiaoTiHei';
        font-weight: 400;
      }
    }
  }
}

.chunk2 {
  margin-top: 0.83vh;
  height: calc(100% - 14.3vh - 0.83vh);
  background: url("./assets/2d/images/digitalReservoirArea/chartBG2.png") no-repeat left top / 100% 100%;
}
</style>