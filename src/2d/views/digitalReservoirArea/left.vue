<template>
  <Left class="left">
    <div class="left-status">
      <div class="left-status-item" v-for="(item, index) in stockStatus" :key="index">
        <img :src="'./assets/2d/images/digitalReservoirArea/' + item.img" />
        <div class="left-status-item-right">
          <p class="left-status-item-right-name">{{ item.name }}</p>
          <p class="left-status-item-right-number">{{ item.value }}</p>
        </div>
      </div>
    </div>
  </Left>
</template>

<script setup>
import Left from "@/2d/components/Left.vue"
import axios from 'axios'
import { ref, onMounted, getCurrentInstance } from "vue"
const { appContext: { app: { config: { globalProperties: { $isOurSite } } } } } = getCurrentInstance()


let stockStatus = ref([
  {
    name: "今日已出库",
    value: 0,
    img: "left_icon1.png",
  },
  {
    name: "今日已入库",
    value: 0,
    img: "left_icon1.png",
  },
  {
    name: "今日库存",
    value: 0,
    img: "left_icon2.png",
  },
  {
    name: "剩余货位数",
    value: 0,
    img: "left_icon3.png",
  },
])

onMounted(() => {
  getStockStatus()
})

// 30s update
setInterval(() => {
  // getStockStatus()
}, 30000)

// 库存状态
function getStockStatus () {
  let res = {}
  axios.get('/api/GetInventory').then(res1 => {
    res = res1
  }).catch(() => {
    res = { data: { "code": 200, "message": { "stock": 0, "surplus": 0, "in": 0, "out": 0 } } }
  }).finally(() => {
    if ($isOurSite) {
      res = { data: { "code": 200, "message": { "stock": 29494, "surplus": 15768, "in": 267, "out": 2879 } } }
    }
    stockStatus.value[0].value = res.data.message.out
    stockStatus.value[1].value = res.data.message.in
    stockStatus.value[2].value = res.data.message.stock
    stockStatus.value[3].value = res.data.message.surplus
  })
}
</script>

<style lang="less" scoped>
.left {
  background: url("./assets/2d/images/digitalReservoirArea/cebian.png") left / 0.21vw 100% no-repeat,
    url("./assets/2d/images/digitalReservoirArea/yuandian.png") left center / 0.21vw 2.59vh no-repeat;
}

.left-status {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 50%;
  transform: translateY(-25%);
  margin-left: 1.04vw;
  height: 41.41vh;

  &-item {
    display: flex;
    height: 5.59vh;
    color: #fff;

    img {
      width: 2.81vw;
      height: 5.59vh;
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.21vw;
      padding: 0.27vh 0 0.83vh 0;

      &-name {
        font-size: 0.73vw;
        font-family: "Source Han Sans SC";
      }

      &-number {
        font-size: 0.83vw;
        font-family: "lianmengqiyilushuaizhengruiheiti";
      }
    }
  }
}
</style>