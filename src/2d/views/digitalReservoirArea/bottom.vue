<template>
  <Bottom style="height: 20.7vh">
    <card-chunk title="日吞吐量" class="chunk1">
      <chart-view v-if="JSON.stringify(echart.cargoInfoOption.value) != '{}'"
        :chartOption="echart.cargoInfoOption.value || {}" auto-tooltip></chart-view>
    </card-chunk>

    <card-chunk title="推垛机" class="chunk2" :moreText="stackerStatus">
      <div class="chunk2-body">
        <div class="chunk2-row">
          <div class="chunk2-item" v-for="item in stackerList.slice(0, 9)" :key="item.name">
            <img :src="'./assets/2d/images/digitalReservoirArea/duiduoji' + item.status + '.png'">
            <img :src="'./assets/2d/images/digitalReservoirArea/duiduojibg' + item.status + '.png'">
            {{ item.name }}
          </div>
        </div>
        <div class="chunk2-row">
          <div class="chunk2-item" v-for="item in stackerList.slice(9, 18)" :key="item.name">
            <img :src="'./assets/2d/images/digitalReservoirArea/duiduoji' + item.status + '.png'">
            <img :src="'./assets/2d/images/digitalReservoirArea/duiduojibg' + item.status + '.png'">
            {{ item.name }}
          </div>
        </div>
      </div>
    </card-chunk>

    <card-chunk title="拣选机器人" class="chunk3" :moreText="pickRobotStatus">
      <div class="chunk3-body">
        <div class="chunk3-row">
          <div class="chunk3-item" v-for="item in pickRobotList.slice(0, 4)" :key="item.name">
            <img :src="'./assets/2d/images/digitalReservoirArea/jianxuan' + item.status + '.png'">
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="chunk3-row">
          <div class="chunk3-item" v-for="item in pickRobotList.slice(4, 8)" :key="item.name">
            <img :src="'./assets/2d/images/digitalReservoirArea/jianxuan' + item.status + '.png'">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </card-chunk>

    <card-chunk title="流量趋势" class="chunk4">
      <chart-view v-if="JSON.stringify(echart.flowTrendOption.value) != '{}'"
        :chartOption="echart.flowTrendOption.value || {}" auto-tooltip></chart-view>
    </card-chunk>
  </Bottom>
</template>

<script setup>
import Bottom from "@/2d/components/Bottom.vue"
import axios from "axios"
import { ref, reactive, onMounted, getCurrentInstance } from "vue"
import * as echarts from "echarts"
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()


onMounted(() => {
  initCargoInfoList()
  initFlowTrend()
  initStackerList()
  initpickRobotList()

  // echart.cargoInfo()
  // echart.flowTrend()
})


// 30s update
setInterval(() => {
  initCargoInfoList()
  initFlowTrend()
  initStackerList()
  initpickRobotList()
}, 30000)

// 日吞吐量
function initCargoInfoList () {
  let res = {}
  echart.cargoInfoList.value = {}
  axios.get('/api/GetHourTrend').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": { "out": [{ "hour": 0, "total": 0 }, { "hour": 1, "total": 0 }, { "hour": 2, "total": 0 }, { "hour": 3, "total": 0 }, { "hour": 4, "total": 0 }, { "hour": 5, "total": 0 }, { "hour": 6, "total": 0 }, { "hour": 7, "total": 0 }, { "hour": 8, "total": 0 }, { "hour": 9, "total": 0 }, { "hour": 10, "total": 0 }, { "hour": 11, "total": 0 }, { "hour": 12, "total": 0 }, { "hour": 13, "total": 0 }, { "hour": 14, "total": 0 }, { "hour": 15, "total": 0 }, { "hour": 16, "total": 0 }, { "hour": 17, "total": 0 }, { "hour": 18, "total": 0 }, { "hour": 19, "total": 0 }, { "hour": 20, "total": 0 }, { "hour": 21, "total": 0 }, { "hour": 22, "total": 0 }, { "hour": 23, "total": 0 }], "in": [{ "hour": 0, "total": 0 }, { "hour": 1, "total": 0 }, { "hour": 2, "total": 0 }, { "hour": 3, "total": 0 }, { "hour": 4, "total": 0 }, { "hour": 5, "total": 0 }, { "hour": 6, "total": 0 }, { "hour": 7, "total": 0 }, { "hour": 8, "total": 0 }, { "hour": 9, "total": 0 }, { "hour": 10, "total": 0 }, { "hour": 11, "total": 0 }, { "hour": 12, "total": 0 }, { "hour": 13, "total": 0 }, { "hour": 14, "total": 0 }, { "hour": 15, "total": 0 }, { "hour": 16, "total": 0 }, { "hour": 17, "total": 0 }, { "hour": 18, "total": 0 }, { "hour": 19, "total": 0 }, { "hour": 20, "total": 0 }, { "hour": 21, "total": 0 }, { "hour": 22, "total": 0 }, { "hour": 23, "total": 0 }] } } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": { "out": [{ "hour": 0, "total": 0 }, { "hour": 1, "total": 0 }, { "hour": 2, "total": 0 }, { "hour": 3, "total": 0 }, { "hour": 4, "total": 0 }, { "hour": 5, "total": 0 }, { "hour": 6, "total": 0 }, { "hour": 7, "total": 0 }, { "hour": 8, "total": 873 }, { "hour": 9, "total": 1255 }, { "hour": 10, "total": 751 }, { "hour": 11, "total": 0 }, { "hour": 12, "total": 0 }, { "hour": 13, "total": 0 }, { "hour": 14, "total": 0 }, { "hour": 15, "total": 0 }, { "hour": 16, "total": 0 }, { "hour": 17, "total": 0 }, { "hour": 18, "total": 0 }, { "hour": 19, "total": 0 }, { "hour": 20, "total": 0 }, { "hour": 21, "total": 0 }, { "hour": 22, "total": 0 }, { "hour": 23, "total": 0 }], "in": [{ "hour": 0, "total": 0 }, { "hour": 1, "total": 0 }, { "hour": 2, "total": 0 }, { "hour": 3, "total": 0 }, { "hour": 4, "total": 0 }, { "hour": 5, "total": 0 }, { "hour": 6, "total": 0 }, { "hour": 7, "total": 0 }, { "hour": 8, "total": 0 }, { "hour": 9, "total": 4 }, { "hour": 10, "total": 341 }, { "hour": 11, "total": 0 }, { "hour": 12, "total": 0 }, { "hour": 13, "total": 0 }, { "hour": 14, "total": 0 }, { "hour": 15, "total": 0 }, { "hour": 16, "total": 0 }, { "hour": 17, "total": 0 }, { "hour": 18, "total": 0 }, { "hour": 19, "total": 0 }, { "hour": 20, "total": 0 }, { "hour": 21, "total": 0 }, { "hour": 22, "total": 0 }, { "hour": 23, "total": 0 }] } } }
    }
    echart.cargoInfoList.value = res.data.message
    echart.cargoInfo()
  })
}

// 流量趋势
function initFlowTrend () {
  let res = {}
  echart.flowTrend1.value = []
  echart.flowTrend2.value = []
  axios.get('/api/GetDayTrend').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": { "out": [{ "date": "2023-02-25", "total": 0 }, { "date": "2023-02-26", "total": 0 }, { "date": "2023-02-27", "total": 0 }, { "date": "2023-02-28", "total": 0 }, { "date": "2023-03-01", "total": 0 }, { "date": "2023-03-02", "total": 0 }, { "date": "2023-03-03", "total": 0 }], "in": [{ "date": "2023-02-25", "total": 0 }, { "date": "2023-02-26", "total": 0 }, { "date": "2023-02-27", "total": 0 }, { "date": "2023-02-28", "total": 0 }, { "date": "2023-03-01", "total": 0 }, { "date": "2023-03-02", "total": 0 }, { "date": "2023-03-03", "total": 0 }] } } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": { "out": [{ "date": "2023-02-25", "total": 9401 }, { "date": "2023-02-26", "total": 9028 }, { "date": "2023-02-27", "total": 10066 }, { "date": "2023-02-28", "total": 9558 }, { "date": "2023-03-01", "total": 8591 }, { "date": "2023-03-02", "total": 9522 }, { "date": "2023-03-03", "total": 3023 }], "in": [{ "date": "2023-02-25", "total": 9112 }, { "date": "2023-02-26", "total": 7931 }, { "date": "2023-02-27", "total": 8172 }, { "date": "2023-02-28", "total": 6271 }, { "date": "2023-03-01", "total": 7698 }, { "date": "2023-03-02", "total": 8413 }, { "date": "2023-03-03", "total": 394 }] } } }
    }
    echart.flowTrend1.value = res.data.message.in
    echart.flowTrend2.value = res.data.message.out
    echart.flowTrend()
  })
}

// 堆垛机
let stackerList = ref([])
const stackerStatus = [{
  color: '#FF9C00',
  text: '使用'
}, {
  color: '#FFFFFF',
  text: '空闲'
}, {
  color: '#FF0404',
  text: '故障'
}]
function initStackerList () {
  let res = {}
  axios.get('/api/GetStacker').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": [{ "D_Name": "堆垛机17", "D_Status": "使用" }, { "D_Name": "堆垛机10", "D_Status": "使用" }, { "D_Name": "堆垛机11", "D_Status": "使用" }, { "D_Name": "堆垛机12", "D_Status": "使用" }, { "D_Name": "堆垛机13", "D_Status": "使用" }, { "D_Name": "堆垛机14", "D_Status": "使用" }, { "D_Name": "堆垛机15", "D_Status": "使用" }, { "D_Name": "堆垛机16", "D_Status": "使用" }, { "D_Name": "堆垛机18", "D_Status": "使用" }, { "D_Name": "堆垛机1", "D_Status": "使用" }, { "D_Name": "堆垛机2", "D_Status": "使用" }, { "D_Name": "堆垛机3", "D_Status": "使用" }, { "D_Name": "堆垛机4", "D_Status": "使用" }, { "D_Name": "堆垛机5", "D_Status": "使用" }, { "D_Name": "堆垛机6", "D_Status": "使用" }, { "D_Name": "堆垛机7", "D_Status": "使用" }, { "D_Name": "堆垛机8", "D_Status": "使用" }, { "D_Name": "堆垛机9", "D_Status": "使用" }] } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": [{ "D_Name": "堆垛机17", "D_Status": "使用" }, { "D_Name": "堆垛机10", "D_Status": "使用" }, { "D_Name": "堆垛机11", "D_Status": "使用" }, { "D_Name": "堆垛机12", "D_Status": "使用" }, { "D_Name": "堆垛机13", "D_Status": "使用" }, { "D_Name": "堆垛机14", "D_Status": "使用" }, { "D_Name": "堆垛机15", "D_Status": "使用" }, { "D_Name": "堆垛机16", "D_Status": "使用" }, { "D_Name": "堆垛机18", "D_Status": "使用" }, { "D_Name": "堆垛机1", "D_Status": "使用" }, { "D_Name": "堆垛机2", "D_Status": "使用" }, { "D_Name": "堆垛机3", "D_Status": "使用" }, { "D_Name": "堆垛机4", "D_Status": "使用" }, { "D_Name": "堆垛机5", "D_Status": "使用" }, { "D_Name": "堆垛机6", "D_Status": "使用" }, { "D_Name": "堆垛机7", "D_Status": "使用" }, { "D_Name": "堆垛机8", "D_Status": "使用" }, { "D_Name": "堆垛机9", "D_Status": "使用" }] } }
    }
    stackerList.value = res.data.message.map(item => {
      let status = ""
      if (item.D_Status === '使用') {
        status = 2
      }
      return { name: item.D_Name, status }
    })
  })
}

// 拣选机器人
let pickRobotList = ref([])
const pickRobotStatus = [{
  color: '#44FFA9',
  text: '使用'
}, {
  color: '#FFFFFF',
  text: '空闲'
}, {
  color: '#FF0404',
  text: '故障'
}]
function initpickRobotList () {
  let res = {}
  axios.get('/api/GetRobot').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": [{ "D_Name": "机器人6", "D_Status": "使用" }, { "D_Name": "机器人4", "D_Status": "使用" }, { "D_Name": "机器人5", "D_Status": "使用" }, { "D_Name": "机器人7", "D_Status": "使用" }, { "D_Name": "机器人8", "D_Status": "使用" }, { "D_Name": "机器人3", "D_Status": "使用" }, { "D_Name": "机器人2", "D_Status": "使用" }, { "D_Name": "机器人1", "D_Status": "使用" }] } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": [{ "D_Name": "机器人6", "D_Status": "使用" }, { "D_Name": "机器人4", "D_Status": "使用" }, { "D_Name": "机器人5", "D_Status": "使用" }, { "D_Name": "机器人7", "D_Status": "使用" }, { "D_Name": "机器人8", "D_Status": "使用" }, { "D_Name": "机器人3", "D_Status": "使用" }, { "D_Name": "机器人2", "D_Status": "使用" }, { "D_Name": "机器人1", "D_Status": "使用" }] } }
    }
    pickRobotList.value = res.data.message.map(item => {
      let status = ""
      if (item.D_Status === '使用') {
        status = 2
      }
      return { name: item.D_Name, status }
    })
  })
}


const echart = {
  cargoInfoList: reactive({}),
  cargoInfoOption: reactive({}),
  cargoInfo () {
    let xLabelTemp = echart.cargoInfoList.value.out.map((item) => item.hour)
    let xLabel = []
    let outValue = echart.cargoInfoList.value.out.map((item) => item.total)
    let inValue = echart.cargoInfoList.value.in.map((item) => item.total)
    // 把这个逼后端传的 0 1 2改成00:00  01:00  02:00
    xLabelTemp.forEach(item => {
      if (JSON.stringify(item).length === 1) {
        xLabel.push('0' + item + ':00')
      } else {
        xLabel.push(item + ':00')
      }
    })

    let option = {
      legend: {
        align: "left",
        right: "10%",
        top: "10%",
        textStyle: {
          color: "#B3B3B3",
          fontSize: 12,
        },
        icon: "rect",
        itemGap: 20,
        itemWidth: 15,
        itemHeight: 5,
        itemStyle: {
          borderWidth: 0,
        },
        data: ["出库", "入库"],
      },
      grid: {
        top: "25%",
        left: "5%",
        right: "8%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#696B72",
            },
          },
          axisLabel: {
            //坐标轴刻度标签的相关设置
            textStyle: {
              color: "#B3B3B3",
              fontSize: 12,
            },
            formatter: function (data) {
              return data
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: xLabel,
        },
      ],
      yAxis: [
        {
          name: "单位：只",
          nameTextStyle: {
            color: "#B3B3B3",
            fontSize: 12,
            padding: [0, 0, 0, 20],
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#696B72",
              type: "dashed",
            },
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#B3B3B3",
              fontSize: 12,
            },
            formatter: function (value) {
              if (value === 0) {
                return value
              }
              return value
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      tooltip: {
        trigger: "axis",
      },
      series: [
        {
          name: "出库",
          type: "line",
          symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbolSize: 10,
          smooth: false,
          lineStyle: {
            normal: {
              width: 2,
              color: "#90702e", // 线条颜色
            },
            borderColor: "rgba(0,0,0,.4)",
          },
          itemStyle: {
            color: "#90702e",
            borderColor: "#ffffff",
            borderWidth: 2,
          },

          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(239, 156, 0,.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(239, 156, 0, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(239, 156, 0, 0.5)", //阴影颜色
              shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
          },
          data: outValue,
        },
        {
          name: "入库",
          type: "line",
          symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbolSize: 10,
          smooth: false,
          lineStyle: {
            normal: {
              width: 2,
              color: "#ef9c00", // 线条颜色
            },
            borderColor: "rgba(0,0,0,.4)",
          },
          itemStyle: {
            color: "#ef9c00",
            borderColor: "#ffffff",
            borderWidth: 2,
          },

          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(239, 156, 0,.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(239, 156, 0, 0)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(239, 156, 0, 0.5)", //阴影颜色
              shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
          },
          data: inValue,
        },
      ],
    }



    echart.cargoInfoOption.value = option
  },


  flowTrend1: ref([]),
  flowTrend2: ref([]),
  flowTrendOption: reactive({}),
  flowTrend () {
    let data1 = echart.flowTrend1.value
    let data2 = echart.flowTrend2.value
    let xAxisData = []
    let seriesData1 = []
    let seriesData2 = []
    let maxData = []
    for (let i = 0; i < data1.length; i++) {
      maxData.push(100)
    }
    data1.forEach((item) => {
      xAxisData.push(item.date)
      seriesData1.push(item.total)
    })
    seriesData2 = data2.map(e => e.total)
    let option = {
      grid: {
        top: "24%",
        bottom: "4%",
        left: "3%",
        right: "4%",
        containLabel: true,
      },
      tooltip: {
        show: true,
        trigger: "axis",
        formatter: function (data) {
          const text = `${data[0].seriesName}&nbsp;&nbsp;&nbsp;${data[0].value} <br /> ${data[1].seriesName}&nbsp;&nbsp;&nbsp;${data[1].value}`
          return text
        },
      },
      legend: {
        align: "left",
        right: "4%",
        top: "4%",
        textStyle: {
          color: "#B3B3B3",
          fontSize: 12,
        },
        itemGap: 20,
        itemStyle: {
          borderWidth: 0,
        },
        data: ["出库", "入库"],
      },
      xAxis: {
        data: xAxisData,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          align: "center",
          textStyle: {
            fontSize: 12,
            color: "#B3B3B3",
          },
        },
        interval: 0,
      },
      yAxis: {
        minInterval: 5000,
        type: "value",
        name: "单位： 只",
        nameTextStyle: {
          color: "#B3B3B3",
          fontSize: 12,
          padding: [0, 0, 0, 20],
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 12,
            color: "#B3B3B3",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#696B72",
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "出库",
          type: "line",
          symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbolSize: 8,
          smooth: false,
          lineStyle: {
            width: 1,
            color: "#ffffff", // 线条颜色
          },
          itemStyle: {
            color: "#ffffff",
            borderColor: "#ffffff",
            borderWidth: 1,
          },
          data: seriesData2,
          z: 13,
        },
        {
          name: "入库",
          type: "pictorialBar",
          symbolSize: [14, 8],
          symbolOffset: [0, -5],
          z: 12,
          itemStyle: {
            color: "#ef9c00",
          },
          label: {
            show: false,
            position: "top",
            fontSize: 16,
          },
          symbolPosition: "end",
          data: seriesData1,
        },
        {
          type: "bar",
          itemStyle: {
            normal: {
              color: function () {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#ef9c00ff",
                  },
                  {
                    offset: 1,
                    color: "#ef9c0000",
                  },
                ])
              },
              opacity: 0.8,
            },
          },
          z: 16,
          silent: true,
          barWidth: 14,
          data: seriesData1,
        },
        {
          type: "bar",
          itemStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          z: 16,
          silent: true,
          barWidth: 14,
          data: maxData,
          barGap: "-100%", // Make series be overlap
        },
      ],
    }
    echart.flowTrendOption.value = option
  },
}
</script>

<style lang="less" scoped>
.chunk1,
.chunk2,
.chunk3,
.chunk4 {
  height: 100%;
}

.chunk1 {
  width: 20.84vw;
  background: url("./assets/2d/images/digitalReservoirArea/chartBG4.png") no-repeat left top / 100% 100%;
}

.chunk2 {
  width: 32.31vw;
  background: url("./assets/2d/images/digitalReservoirArea/chartBG5.png") no-repeat left top / 100% 100%;

  &-body {
    height: 100%;
    width: 100%;
    padding: 2.2vh 0.52vw 1.6vh 0.52vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &-item {
    cursor: pointer;
    position: relative;
    height: 5.38vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ;
    align-items: center;
    color: #FFF;
    font-size: 0.63vw;
  }

  &-item img:nth-child(1) {
    animation: ups-and-downs 3s linear infinite;
    position: absolute;
    top: -0.83vh;
    width: 0.73vw;
    height: 2.48vh;
  }

  &-item img:nth-child(2) {
    width: 2.81vw;
    height: 4.14vh;
  }
}

.chunk3 {
  width: 20.01vw;
  background: url("./assets/2d/images/digitalReservoirArea/chartBG6.png") no-repeat left top / 100% 100%;

  &-body {
    height: 96%;
    width: 100%;
    padding: 1.6vh 0.5vw 0.8vh 0.5vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &-row {
    // border: 1px solid red;
    height: 45%;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &-item {
    height: 100%;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    font-size: 0.63vw;
    // border: 1px solid red;
    width: 25%;

    img {
      height: 100%;
      width: 2.5vw;
    }

    p {
      position: absolute;
      bottom: 5%;
    }
  }
}

.chunk4 {
  width: 24.18vw;
  background: url("./assets/2d/images/digitalReservoirArea/chartBG7.png") no-repeat left top / 100% 100%;
}

@keyframes ups-and-downs {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(30%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>