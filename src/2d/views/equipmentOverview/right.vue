<template>
  <Right style="height: calc(100% - 6.21vh)">
    <card-chunk title="设备概览" class="chunk1">
      <div class="chunk1-body">
        <div v-for="(item, index) in equipmentOverviewList" :key="index" class="chunk1-item">
          <p class="chunk1-item-value">{{ item.value }}</p>
          <p class="chunk1-item-name">{{ item.name }}</p>
          <img class="chunk1-item-bg" :src="'./assets/2d/images/equipmentOverview/overview' + (index + 1) + '.png'" />
        </div>
      </div>
    </card-chunk>


    <card-chunk title="报警列表" class="chunk2">
      <div v-if="marqueenShow" class="chunk2-body">
        <marquee class="chunk2-body-marquee">
          <template v-slot:thead>
            <table class="table" cellspacing="0" style="margin-bottom: 0.1125rem">
              <colgroup>
                <col width="33%" />
                <col width="33%" />
                <col width="33%" />
              </colgroup>
              <thead>
                <tr class="th_tr">
                  <th class="th">时间</th>
                  <th class="th">报警设备</th>
                  <th class="th">备注</th>
                </tr>
              </thead>
            </table>
          </template>
          <template v-slot:tbody>
            <table class="table table_wrapper tbody" cellspacing="0">
              <colgroup>
                <col width="33%" />
                <col width="33%" />
                <col width="33%" />
              </colgroup>
              <tbody>
                <tr class="td_tr" v-for="(item, index) in alarmList" :key="index" @click="handleAbnormal(item)">
                  <td class="td">{{ item.date }}</td>
                  <td class="td">{{ item.equ }}</td>
                  <td class="td">{{ item.describe }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </marquee>
      </div>
    </card-chunk>

    <card-chunk title="故障Top5" class="chunk3">
      <div class="chunk3-body">
        <div class="chunk3-body-left">
          <div v-for="index in 5" :key="index" class="chunk3-body-left-item">
            <p>TOP<span :style="{ color: faultTop5Color[index - 1] }">{{ '0' + index }}</span></p>
            <Parallelogram class="parallelogram"></Parallelogram>
          </div>
        </div>
        <chart-view :chartOption="echart.faultTop5Option.value || {}" auto-tooltip></chart-view>
      </div>
    </card-chunk>
  </Right>
</template>

<script setup>
import axios from 'axios'
import Parallelogram from '@/2d/components/Parallelogram.vue'
import * as echarts from 'echarts'
import Right from "@/2d/components/Right.vue"
import Marquee from "@/2d/components/Marquee.vue"
import { ref, reactive, onMounted, nextTick } from "vue"
// import { cameraMove } from '@/3d/main.ts'

let equipmentOverviewList = ref([])
const equipmentOverviewName = ["机器人", "堆垛机", "入库线", "多品分拣线", "单品分拣线", "库位"]
function initEquipmentOverviewList () {
  axios.get('/api/GetEquipmentCount').then(res => {
    if (res.status === 200) {
      const tempArr = []
      for (let key in res.data.message) {
        if (key != "空箱补给线")
          tempArr.push({
            name: key,
            value: res.data.message[key]
          })
      }
      equipmentOverviewList.value = tempArr
    }
  }).catch(() => {
    const tempArr = []
    for (let i = 0; i < equipmentOverviewName.length; i++) {
      tempArr.push({
        name: equipmentOverviewName[i],
        value: 0
      })
    }
    equipmentOverviewList.value = tempArr
  })
}

function handleAbnormal (item) {
  console.log(item)
  cameraMove('jxsb1')
}

let alarmList = ref([])
let marqueenShow = ref(false)
function initAlarmListList () {
  axios.get('/api/GetAbnormal').then(res => {
    if (res.status === 200) {
      marqueenShow.value = false
      alarmList.value = res.data.message.data
      nextTick(() => {
        marqueenShow.value = true
      })
    }
  }).catch(() => {
    const tempArr = []
    for (let i = 0; i < 20; i++) {
      tempArr.push({
        equ: '设备1',
        describe: '异常1',
        date: '2023-01-01 00:00:01'
      })
    }
    alarmList.value = tempArr
    nextTick(() => {
      marqueenShow.value = true
    })
  })
}


const faultTop5Color = ['#FB255D', '#FF8C26', '#FFF601', '#29FF47', '#38F2D1']
function getFaultTop5List () {
  axios.get('/api/GetAbnormalRatio').then(res => {
    if (res.status === 200) {
      const tempArr = res.data.message
      tempArr.forEach(e => {
        e.total = e.total.toFixed(2)
      })
      for (let i = 0; i < 5 - tempArr.length + 2; i++) {
        tempArr.push({ equName: "", total: "0" })
      }
      echart.faultTop5List.value = tempArr.reverse()
      echart.faultTop5Chart()
    }
  }).catch(() => {
    echart.faultTop5List.value = []
    for (let i = 1; i < 6; i++) {
      echart.faultTop5List.value.push({ equName: '未知', total: '0.0' })
      echart.faultTop5Chart()
    }
  })
}

onMounted(() => {
  initAlarmListList()
  initEquipmentOverviewList()
  getFaultTop5List()
  echart.faultTop5Chart()

  // 30s update
  setInterval(() => {
    // initAlarmListList()
    // initEquipmentOverviewList()
    // getFaultTop5List()
  }, 30000)
})


const echart = {
  faultTop5List: ref([]),
  faultTop5Option: reactive({}),
  faultTop5Chart () {
    const datas = echart.faultTop5List.value
    const yData = datas.map((item) => item.total)
    const yName = datas.map((item) => item.equName)
    for (let i = 0; i < 5; i++) {
      yName.push()
    }

    const max = 100
    let maxData = []
    for (let i = 0; i < echart.faultTop5List.value.length; i++) {
      maxData.push(max)
    }


    let option = {
      grid: {
        left: "20%",
        right: "5%",
        bottom: "3%",
        top: "0%",
        containLabel: false,
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
          show: true,
          data: yName,
          offset: 0,
          align: 'left',
          axisLabel: {
            lineHeight: -6,
            verticalAlign: "bottom",
            fontWeight: "bold",
            fontSize: 12,
            padding: [0, -50, -8, 0],
            color: "#FFF",
            align: 'left',
            formatter: "设备 {value}"
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
        {
          show: true,
          data: yData,
          offset: 0,
          axisLabel: {
            lineHeight: -6,
            verticalAlign: "bottom",
            fontWeight: "bold",
            fontSize: 12,
            padding: [0, 0, -8, -30],
            // offset: [10, 0],
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
          const text = `设备 ${data[0].name}<br /> <span style="display:inline-block;margin-right:0.21vw;border-radius:0.52vw;width:0.52vw;height:1.03vh;background-color:rgba(239, 156, 0, 1);"></span> ${data[1].data}%`
          return text
        },
      },
      series: [
        {
          name: "满值",
          z: 1,
          show: true,
          type: "bar",
          xAxisIndex: 1,
          barWidth: 4,
          itemStyle: {
            color: "#56483c",
            borderColor: "#FFF",
            borderWidth: 0,
            borderRadius: 4
          },
          data: maxData,
        },
        {
          name: "储存率",
          show: true,
          type: "bar",
          xAxisIndex: 1,
          barWidth: 4,
          barGap: "-100%",
          itemStyle: {
            borderRadius: 4,
            color: function () {
              return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: 'rgba(239, 156, 0, 0)'
                },
                {
                  offset: 1,
                  color: 'rgba(239, 156, 0, 1)'
                }
              ])
            }
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
        }
      ],
    }

    echart.faultTop5Option.value = option
  },
}
</script>

<style lang="less" scoped>
.chunk1 {
  height: 24vh;
  background: url('./assets/2d/images/equipmentOverview/chartBG4.png') center / 100% 100% no-repeat;

  .chunk1-body {
    display: flex;
    height: 100%;
    justify-content: space-between;
    padding: 2.8vh 1.56vw 0 1.56vw;
    flex-wrap: wrap;
    align-content: flex-start;

    .chunk1-item {
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 4.69vw;
      height: 7vh;
      margin-bottom: 2vh;

      &-value {
        width: 4.38vw;
        text-align: center;
        font-size: 0.73vw;
        font-family: 'lianmengqiyilushuaizhengruiheiti';
        color: #FFF;
      }

      &-name {
        margin-top: 1.24vh;
        width: 4.38vw;
        text-align: center;
        font-size: 0.63vw;
        color: #FFF;
      }

      &-bg {
        position: absolute;
        bottom: 0;
        left: 0.21vw;
        height: 54;
        width: 4.38vw;
      }
    }
  }
}

.chunk2 {
  height: 40vh;
  margin-top: 1.04vh;
  background: url('./assets/2d/images/equipmentOverview/chartBG5.png') center / 100% 100% no-repeat;

  &-body {
    padding: 2.08vh 0.52vw 1.04vh 0.52vw;
    width: 100%;
    height: 36.5vh;
    color: #FFF;
    font-size: 0.63vw;

    &-marquee {
      ::v-deep .scroll_table {
        margin-top: 1.04vh;
      }

      .table {
        width: 100%;

        .th_tr {
          height: 3.73vh;
          width: 19.8vw;
          background: url('./assets/2d/images/equipmentOverview/alarm-head-bg.png') center / 100% 100% no-repeat;

          .th {
            background: url('./assets/2d/images/equipmentOverview/alert-button-bg.png') center / 4.69vw 2.48vh no-repeat;
          }
        }

        .td_tr {
          cursor: pointer;
          height: 4.14vh;
          width: 19.8vw;
          background: url('./assets/2d/images/equipmentOverview/alarm-raw-bg.png') center / 100% 9.73vh no-repeat;
        }

        .td {
          height: 0.3625rem;
          font-size: 0.15rem;
          color: #c5d0d4;
          text-align: center;

          .status {
            color: #26dbdd;
            line-height: 0.275rem;
            width: 0.75rem;
            height: 0.275rem;
            display: inline-block;
            text-align: center;

            &.red {
              color: #fe1934;
            }
          }
        }
      }

      .tbody {
        position: absolute;
      }
    }
  }

  th {
    font-weight: normal;
  }
}



.chunk3 {
  margin-top: 1.04vh;
  height: 24.6vh;
  background: url('./assets/2d/images/equipmentOverview/chartBG6.png') center / 100% 100% no-repeat;

  &-body {
    height: 100%;
    width: 100%;

    &-left {
      margin: 1.66vh 0 0 0.84vw;
      height: 18vh;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #FFF;
        font-weight: bold;
        font-style: italic;
        font-size: 0.63vw;

        .parallelogram {
          position: absolute;
          top: 1.86vh;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>