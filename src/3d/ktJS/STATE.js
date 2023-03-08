import { API } from './API.js'
import { CACHE } from './CACHE.js'

const PUBLIC_PATH = './assets/3d'
const initialState = {
  position: { x: -14.5, y: 16, z: 4.7 },
  target: { x: 0, y: 8, z: 0 }
}

let rkPasue = false,
  flapGate = null,
  tishengji = null,
  tempClickObjects = [],
  thisBoxWSMessage = {},
  tempThisBoxWSMessage = {},
  times = 0,
  slow = false

const lineObjects = {},
  rkBoxArr = [], // 入库线上的产品
  danBoxArr = [], // 单品出库数组
  duoBoxArr = [], // 多品出库
  loopBoxArr = [], // 循环线
  ckBoxArr = [], // 堆垛机读取到出库指令之后，还没到侧扫的时候的临时数组
  scan = {},
  sceneModel = {},
  // 单品打包台
  danPack = [{
    index: 825,
    index2: 860
  }, {
    index: 890,
    index2: 905
  }, {
    index: 950,
    index2: 947
  }],
  // 多品打包台
  duoPack = [{
    index: 60,
    index2: 40
  }, {
    index: 190,
    index2: 170
  }, {
    index: 315,
    index2: 295
  }, {
    index: 445,
    index2: 427
  }, {
    index: 575,
    index2: 557
  }, {
    index: 700,
    index2: 685
  }, {
    index: 830,
    index2: 817
  }, {
    index: 960,
    index2: 945
  }],
  rkEliminate = {
    boxArr: [],
    lineName: 'F456',
    index: 357,
    name: '1008',
    baffle: 'dangban016',
    baffleStatus: true
  },
  rkAbnormal = {
    boxArr: [],
  },
  // 入库巷道
  roadway = [{
    boxArr: [],
    lineName: 'F3',
    duiduojiNum: 71,
    danLineName: 'F1',
    duoLineName: 'F2',
    index: 394,
    danIndex: 12,
    duoIndex: 27,
    name: '1009',
    machine: "dong",
    baffle: 'dangban017',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F459',
    duiduojiNum: 72,
    danLineName: 'F457',
    duoLineName: 'F458',
    index: 437,
    danIndex: 43,
    duoIndex: 87,
    name: '1011',
    machine: 'dong001',
    baffle: 'dangban018',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F462',
    duiduojiNum: 73,
    danLineName: 'F460',
    duoLineName: 'F461',
    index: 490,
    danIndex: 81,
    duoIndex: 159,
    name: '1013',
    machine: 'dong002',
    baffle: 'dangban019',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F465',
    duiduojiNum: 74,
    danLineName: 'F463',
    duoLineName: 'F464',
    index: 591,
    danIndex: 151,
    duoIndex: 296,
    name: '1017',
    machine: 'dong003',
    baffle: 'dangban020',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F468',
    danLineName: 'F466',
    duoLineName: 'F467',
    duiduojiNum: 75,
    index: 636,
    danIndex: 178,
    duoIndex: 348,
    name: '1019',
    machine: 'dong004',
    baffle: 'dangban021',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F471',
    danLineName: 'F469',
    duoLineName: 'F470',
    duiduojiNum: 76,
    index: 675,
    danIndex: 205,
    duoIndex: 400,
    name: '1021',
    machine: 'dong005',
    baffle: 'dangban022',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F474',
    danLineName: 'F472',
    duoLineName: 'F473',
    duiduojiNum: 77,
    index: 714,
    danIndex: 232,
    duoIndex: 452,
    name: '1023',
    machine: 'dong007',
    baffle: 'dangban023',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F477',
    danLineName: 'F475',
    duoLineName: 'F476',
    duiduojiNum: 78,
    index: 750,
    danIndex: 259,
    duoIndex: 504,
    name: '1025',
    machine: 'dong008',
    baffle: 'dangban024',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F480',
    danLineName: 'F478',
    duoLineName: 'F479',
    duiduojiNum: 79,
    index: 835,
    danIndex: 319,
    duoIndex: 622,
    name: '1028',
    machine: 'dong009',
    baffle: 'dangban025',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F483',
    danLineName: 'F481',
    duoLineName: 'F482',
    duiduojiNum: 80,
    index: 873,
    danIndex: 346,
    duoIndex: 674,
    name: '1030',
    machine: 'dong010',
    baffle: 'dangban026',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F486',
    danLineName: 'F484',
    duoLineName: 'F485',
    duiduojiNum: 81,
    index: 912,
    danIndex: 373,
    duoIndex: 726,
    name: '1032',
    machine: 'dong012',
    baffle: 'dangban027',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F489',
    danLineName: 'F487',
    duoLineName: 'F488',
    duiduojiNum: 82,
    index: 951,
    danIndex: 400,
    duoIndex: 778,
    name: '1034',
    machine: 'dong013',
    baffle: 'dangban028',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F492',
    danLineName: 'F490',
    duoLineName: 'F491',
    duiduojiNum: 83,
    index: 988,
    danIndex: 494,
    duoIndex: 830,
    name: '1036',
    machine: 'dong014',
    baffle: 'dangban029',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F495',
    danLineName: 'F493',
    duoLineName: 'F494',
    duiduojiNum: 84,
    index: 1080,
    danIndex: 427,
    duoIndex: 959,
    name: '1040',
    machine: 'dong015',
    baffle: 'dangban030',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F498',
    danLineName: 'F496',
    duoLineName: 'F497',
    duiduojiNum: 85,
    index: 1127,
    danIndex: 521,
    duoIndex: 1011,
    name: '1042',
    machine: 'dong016',
    baffle: 'dangban031',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F501',
    danLineName: 'F499',
    duoLineName: 'F500',
    duiduojiNum: 86,
    index: 1162,
    danIndex: 548,
    duoIndex: 1064,
    name: '1044',
    machine: 'dong017',
    baffle: 'dangban032',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F504',
    danLineName: 'F502',
    duoLineName: 'F503',
    duiduojiNum: 87,
    index: 1201,
    danIndex: 575,
    duoIndex: 1116,
    name: '1046',
    machine: 'dong018_(1)',
    baffle: 'dangban033',
    machineStatus: true,
    baffleStatus: true
  }, {
    boxArr: [],
    lineName: 'F507',
    danLineName: 'F505',
    duoLineName: 'F506',
    duiduojiNum: 88,
    index: 1234,
    danIndex: 602,
    duoIndex: 1168,
    name: '1048',
    machine: 'dong019',
    baffle: 'dangban034',
    machineStatus: true,
    baffleStatus: true
  }],
  duoRoadway = [{
    lineName: 'G001',
    baffle: "dangban00",
    index: 337,
    index2: 430
  }, {
    lineName: 'G002',
    baffle: "dangban01",
    index: 377,
    index2: 444
  }, {
    lineName: 'G003',
    baffle: "dangban02",
    index: 432,
    index2: 465
  }, {
    lineName: 'G004',
    baffle: "dangban03",
    index: 472,
    index2: 480
  }, {
    lineName: 'G005',
    baffle: "dangban04",
    index: 530,
    index2: 501
  }, {
    lineName: 'G006',
    baffle: "dangban05",
    index: 570,
    index2: 516
  }, {
    lineName: 'G007',
    baffle: "dangban06",
    index: 648,
    index2: 544
  }, {
    lineName: 'G008',
    baffle: "dangban07",
    index: 688,
    index2: 559
  }, {
    lineName: 'G009',
    baffle: "dangban08",
    index: 754,
    index2: 584
  }, {
    lineName: 'G010',
    baffle: "dangban09",
    index: 794,
    index2: 598
  }, {
    lineName: 'G011',
    baffle: "dangban10",
    index: 861,
    index2: 630
  }, {
    lineName: 'G012',
    baffle: "dangban11",
    index: 901,
    index2: 644
  }, {
    lineName: 'G013',
    baffle: "dangban12",
    index: 993,
    index2: 679
  }, {
    lineName: 'G014',
    baffle: "dangban13",
    index: 1033,
    index2: 691
  }, {
    lineName: 'G015',
    baffle: "dangban14",
    index: 1100,
    index2: 715
  }, {
    lineName: 'G016',
    baffle: "dangban15",
    index: 1140,
    index2: 729
  }],
  loopRoadway = [{
    tuopan: null,
    boxArr: [],
    position: [7.71920729, 0.825012267, -2.11484385],
    index: 193
  }, {
    tuopan: null,
    boxArr: [],
    position: [9.449254, 0.825012267, -2.11484385],
    index: 247
  }, {
    tuopan: null,
    boxArr: [],
    position: [10.5863562, 0.825012267, -2.11484385],
    index: 283
  }, {
    tuopan: null,
    boxArr: [],
    position: [12.3164034, 0.825012267, -2.11484385],
    index: 338
  }, {
    tuopan: null,
    boxArr: [],
    position: [13.5302858, 0.825012267, -2.11484385],
    index: 376
  }, {
    tuopan: null,
    boxArr: [],
    position: [15.2603331, 0.825012267, -2.11484385],
    index: 430
  }, {
    tuopan: null,
    boxArr: [],
    position: [17.0665665, 0.825012267, -2.11484385],
    index: 486
  }, {
    tuopan: null,
    boxArr: [],
    position: [18.7966137, 0.825012267, -2.11484385],
    index: 542
  }, {
    tuopan: null,
    boxArr: [],
    position: [20.2598171, 0.825012267, -2.11484385],
    index: 587
  }, {
    tuopan: null,
    boxArr: [],
    position: [21.98986, 0.825012267, -2.11484385],
    index: 642
  }, {
    tuopan: null,
    boxArr: [],
    position: [23.4733028, 0.825012267, -2.11484385],
    index: 689
  }, {
    tuopan: null,
    boxArr: [],
    position: [25.2033443, 0.825012267, -2.11484385],
    index: 743
  }, {
    tuopan: null,
    boxArr: [],
    position: [27.4407387, 0.825012267, -2.11484385],
    index: 814
  }, {
    tuopan: null,
    boxArr: [],
    position: [29.1707821, 0.825012267, -2.11484385],
    index: 868
  }, {
    tuopan: null,
    boxArr: [],
    position: [30.6276722, 0.825012267, -2.11484385],
    index: 913
  }, {
    tuopan: null,
    boxArr: [],
    position: [32.35771, 0.825012267, -2.11484385],
    index: 969
  }],
  // 分拣机
  fjjArr = [{
    baffleName: 0,
    mapName: '2201'
  }, {
    baffleName: 1,
    mapName: '2202'
  }, {
    baffleName: 2,
    mapName: '2203'
  }, {
    baffleName: 3,
    mapName: '2204'
  }, {
    baffleName: 4,
    mapName: '2205'
  }, {
    baffleName: 5,
    mapName: '2206'
  }, {
    baffleName: 6,
    mapName: '2207'
  }, {
    baffleName: 7,
    mapName: '2208'
  }, {
    baffleName: 8,
    mapName: '2209'
  }, {
    baffleName: 9,
    mapName: '2210'
  }, {
    baffleName: 10,
    mapName: '2211'
  }, {
    baffleName: 11,
    mapName: '2212'
  }, {
    baffleName: 12,
    mapName: '2213'
  }, {
    baffleName: 13,
    mapName: '2214'
  }, {
    baffleName: 14,
    mapName: '2215'
  }, {
    baffleName: 15,
    mapName: '2216'
  }],
  // 机械手臂
  jxsbObject = {
    jxsb1: {
      position: [8.625, 0, -2]
    },
    jxsb2: {
      position: [11.49, 0, -2]
    },
    jxsb3: {
      position: [14.435, 0, -2]
    },
    jxsb4: {
      position: [17.97, 0, -2]
    },
    jxsb5: {
      position: [21.17, 0, -2]
    },
    jxsb6: {
      position: [24.38, 0, -2]
    },
    jxsb7: {
      position: [28.35, 0, -2]
    },
    jxsb8: {
      position: [31.53, 0, -2]
    },
  },
  clock = new Bol3D.Clock(true),
  renderT = 1 / 20

export const STATE = {
  initialState,
  PUBLIC_PATH,
  rkPasue,
  flapGate,
  tishengji,
  slow,
  tempClickObjects,
  thisBoxWSMessage,
  tempThisBoxWSMessage,
  lineObjects,
  rkBoxArr,
  danBoxArr,
  duoBoxArr,
  loopBoxArr,
  ckBoxArr,
  scan,
  sceneModel,
  danPack,
  duoPack,
  rkEliminate,
  rkAbnormal,
  roadway,
  duoRoadway,
  loopRoadway,
  fjjArr,
  jxsbObject,
  clock,
  renderT,
  times
}
