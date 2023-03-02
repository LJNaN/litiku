import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/2d/views/digitalReservoirArea/index.vue"),
  },
  {
    path: "/digitalreservoirarea",
    name: "digitalReservoirArea",
    component: () => import("@/2d/views/digitalReservoirArea/index.vue"),
  },
  {
    path: "/equipmentoverview",
    name: "equipmentOverview",
    component: () => import("@/2d/views/equipmentOverview/index.vue"),
  },
  {
    path: "/ordertask",
    name: "orderTask",
    component: () => import("@/2d/views/orderTask/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
