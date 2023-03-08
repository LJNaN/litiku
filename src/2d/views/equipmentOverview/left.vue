<template>
  <Left style="height: calc(100% - 6.21vh)">
    <card-chunk title="堆垛机" class="chunk1" :moreText="stackerStatus">
      <div class="chunk1-body">
        <div v-for="item in stackerList" :key="item.id" class="chunk1-item">

          <img class="chunk1-item-circular"
            :src="'./assets/2d/images/equipmentOverview/circular' + item.status + '.png'" />
          <p :style="{ color: item.status === 3 ? '#F16969' : item.status === 1 ? '#FFFFFF' : '#FF9C00' }">{{ item.name }}
          </p>
          <img class="chunk1-item-bg" :src="'./assets/2d/images/equipmentOverview/duiduoji' + item.status + '.png'" />
        </div>
      </div>
    </card-chunk>


    <card-chunk title="设备效率" class="chunk2">
      <div class="chunk2-body">
        <div class="chunk2-row">
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency4.png'" />
            <p>{{ efficiencyList[0].name }}</p>
            <p>{{ efficiencyList[0].value + '%' }}</p>
          </div>
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency1.png'" />
            <p>{{ efficiencyList[1].name }}</p>
            <p>{{ efficiencyList[1].value + '%' }}</p>
          </div>
        </div>

        <div class="chunk2-row">
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency2.png'" />
            <p>{{ efficiencyList[2].name }}</p>
            <p>{{ efficiencyList[2].value + '%' }}</p>
          </div>
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency3.png'" />
            <p>{{ efficiencyList[3].name }}</p>
            <p>{{ efficiencyList[3].value + '%' }}</p>
          </div>
        </div>

        <div class="chunk2-row">
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency4.png'" />
            <p>{{ efficiencyList[4].name }}</p>
            <p>{{ efficiencyList[4].value + '%' }}</p>
          </div>
          <div class="chunk2-item">
            <img class="chunk2-item-circular" :src="'./assets/2d/images/equipmentOverview/efficiency1.png'" />
            <p>{{ efficiencyList[5].name }}</p>
            <p>{{ efficiencyList[5].value + '%' }}</p>
          </div>
        </div>
      </div>
    </card-chunk>

    <card-chunk title="拣选机器人" class="chunk3">
      <div class="chunk3-body">
        <div v-for="item in pickRobotList" :key="item.id" class="chunk3-item">

          <img class="chunk3-item-textBG" :src="'./assets/2d/images/equipmentOverview/jianxuanbg.png'" />
          <p class="chunk3-item-statusText">{{ item.status === 1 ? '使用中' : item.status === 2 ? '空闲' : '故障' }}</p>
          <p class="chunk3-item-bigText">{{ item.name }}</p>
          <img class="chunk3-item-bg" :src="'./assets/2d/images/equipmentOverview/jianxuan' + item.status + '.png'" />
        </div>
      </div>
    </card-chunk>
  </Left>
</template>

<script setup>
import axios from 'axios'
import Left from "@/2d/components/Left.vue"
import { ref, onMounted, getCurrentInstance } from "vue"
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()


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


let efficiencyList = ref([{
  name: '机器人',
  value: '0'
}, {
  name: '堆垛机',
  value: '0'
}, {
  name: '入库线',
  value: '0'
}, {
  name: '多品分拣线',
  value: '0'
}, {
  name: '单品分拣线',
  value: '0'
}, {
  name: '空箱补给线',
  value: '0'
}])
function initEfficiencyList () {
  let res = {}
  axios.get('/api/GetEquipmentRatio').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": { "机器人": 0, "堆垛机": 0, "入库线": 0, "多品分拣线": 0, "单品分拣线": 0, "空箱补给线": 0 } } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": { "机器人": 100, "堆垛机": 100, "入库线": 100, "多品分拣线": 100, "单品分拣线": 100, "空箱补给线": 100 } } }
    }
    efficiencyList.value[0].value = res.data.message.机器人
    efficiencyList.value[1].value = res.data.message.堆垛机
    efficiencyList.value[2].value = res.data.message.入库线
    efficiencyList.value[3].value = res.data.message.多品分拣线
    efficiencyList.value[4].value = res.data.message.单品分拣线
    efficiencyList.value[5].value = res.data.message.空箱补给线
  })
}

let pickRobotList = ref([])
function initPickRobotList () {
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

onMounted(() => {
  initStackerList()
  initEfficiencyList()
  initPickRobotList()

  // 30s update
  setInterval(() => {
    initStackerList()
    initEfficiencyList()
    initPickRobotList()
  }, 30000)
})
</script>

<style lang="less" scoped>
.chunk1 {
  height: 43vh;
  background: url('/assets/2d/images/equipmentOverview/chartBG1.png') center / 100% 100% no-repeat;

  .chunk1-body {
    display: flex;
    height: 100%;
    justify-content: space-between;
    padding: 3.11vh 0.4vw 0 0.4vw;
    flex-wrap: wrap;
    align-content: flex-start;

    .chunk1-item {
      cursor: pointer;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      // min-width: 30%;
      width: 32%;
      height: 5vh;
      margin-bottom: 1.2vh;

      &-circular {
        position: absolute;
        top: 1.35vh;
        left: 0.63vw;
        height: 1.55vh;
        width: 0.78vw;
      }

      p {
        position: absolute;
        top: 1vh;
        left: 1.56vw;
        font-size: 0.73vw;
        color: #FFF;
      }

      &-bg {
        height: 100%;
        width: 100%;
      }
    }
  }


  .chunk1-item:last-child:nth-child(3n - 1) {
    margin-right: 7.14vw;
  }
}

.chunk2 {
  margin-top: 1.04vh;
  height: 16vh;
  background: url('/assets/2d/images/equipmentOverview/chartBG2.png') center / 100% 100% no-repeat;

  .chunk2-body {
    display: flex;
    flex-direction: column;
    height: 70%;
    justify-content: space-between;
    padding: 0 0.52vw 0 0.52vw;
    margin-top: 1.04vh;
    overflow-y: scroll;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */

    .chunk2-row {
      display: flex;
      margin-bottom: 1vh;

      .chunk2-item {
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 9.74vw;
        height: 4.14vh;
        background: url('/assets/2d/images/equipmentOverview/efficiency-bg.png') center / 100% 100% no-repeat;

        &-circular {
          position: absolute;
          top: 1.86vh;
          left: 1.04vw;
          height: 1.03vh;
          width: 0.52vw;
        }

        p {
          position: absolute;
          top: 1.14vh;
          color: #FFF;
        }

        p:nth-child(2) {
          left: 1.83vw;
          font-size: 0.73vw;
        }

        p:nth-child(3) {
          top: 1.45vh;
          right: 0.52vw;
          font-size: 0.52vw;
          font-family: 'lianmengqiyilushuaizhengruiheiti';
        }
      }
    }
  }

  .chunk2-body::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}

.chunk3 {
  margin-top: 1.04vh;
  height: 29vh;
  background: url('/assets/2d/images/equipmentOverview/chartBG3.png') center / 100% 100% no-repeat;

  .chunk3-body {
    display: flex;
    height: 100%;
    justify-content: space-between;
    padding: 2.48vh 0.52vw 0 0.52vw;
    flex-wrap: wrap;
    align-content: flex-start;

    .chunk3-item {
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 24%;
      height: 11vh;
      margin-bottom: 1vh;

      img {
        width: 93%;
      }

      &-textBG {
        height: 3.31vh;
        width: 4.79vw;
      }

      &-statusText {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 0.62vh;
        font-size: 0.63vw;
        color: #FFF;
      }

      &-bigText {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 3.93vh;
        font-size: 0.9vw;
        font-family: 'YouSheBiaoTiHei';
        color: #FFF;
        text-shadow: 0 3px 3px rgba(0, 0, 0, 0.47);
      }

      &-bg {
        height: 5vh;
        width: 100%;
      }
    }
  }


  .chunk3-item:last-child:nth-child(4n - 1) {
    margin-right: 5.05vw;
  }

  .chunk3-item:last-child:nth-child(4n - 2) {
    margin-right: 10.06vw;
  }
}
</style>