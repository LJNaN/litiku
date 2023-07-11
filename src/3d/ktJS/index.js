import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import { DATA } from './DATA.js'
import { BufferGeometryUtils } from '../asset/BufferGeometryUtils'
import '../asset/main.less'



let container
const cookiePosition = document.cookie.replace(/(?:(?:^|.*;\s*)position\s*\=\s*([^;]*).*$)|^.*$/, "$1")
const cookieTarget = document.cookie.replace(/(?:(?:^|.*;\s*)target\s*\=\s*([^;]*).*$)|^.*$/, "$1")
let cookiePositionJson, cookieTargetJson
if (cookiePosition) cookiePositionJson = JSON.parse(cookiePosition)
if (cookieTarget) cookieTargetJson = JSON.parse(cookieTarget)

export const sceneOnLoad = ({ domElement, callback }) => {
  container = new Bol3D.Container({
    publicPath: STATE.PUBLIC_PATH,
    container: domElement,
    viewState: 'orbit',
    bloomEnabled: false,
    cameras: {
      orbitCamera: {
        position: cookiePositionJson ? [cookiePositionJson.x, cookiePositionJson.y, cookiePositionJson.z] : [STATE.initialState.position.x, STATE.initialState.position.y, STATE.initialState.position.z],
        near: 1,
        far: 1000,
        fov: 45
      }
    },
    controls: {
      orbitControls: {
        autoRotate: false,
        autoRotateSpeed: 1,
        target: cookieTargetJson ? [cookieTargetJson.x, cookieTargetJson.y, cookieTargetJson.z] : [STATE.initialState.target.x, STATE.initialState.target.y, STATE.initialState.target.z],
        // minDistance: 0,
        // maxDistance: 2500,
        maxPolarAngle: Math.PI * 0.44,
        minPolarAngle: Math.PI * 0.05,
        enableDamping: false,
        dampingFactor: 0.05
      }
    },
    lights: {
      pointLights: [{
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [-20, 15, 2],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [0, 15, 2],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [20, 15, 2],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [40, 15, 2],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [-20, 15, -10],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [0, 15, -10],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [20, 15, -10],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [40, 15, -10],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [-20, 15, -16],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [0, 15, -16],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [20, 15, -16],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }, {
        color: 0xffffff,
        intensity: 0.1,
        distance: 10000,
        decay: 2,
        position: [40, 15, -16],
        near: .5,
        far: 10000,
        bias: 0,
        size: 512,
      }],
      directionLights: [{
        color: 0xffffff,
        intensity: 0.1,
        position: [100, 400, 100],
        mapSize: [2048, 2048],
        near: 0.001,
        far: 10000,
        bias: -0.0004,
        distance: 10000,
        target: [0, 0, 0]
      }],
      // hemisphereLight: {  // 场景光
      //     skyColor: 0x363535, // sky color
      //     groundColor: 0x363535, // ground color
      //     intensity: .4, // 强度
      //     position: [0, 500, 10000] // 光位置，指向(0,0,0)
      // },
      ambientLight: {
        color: "#FFFFFF",
        intensity: 0.64,
      },
    },
    background: {
      type: 'color',
      value: '#2e2e30'
    },
    modelUrls: [
      '/model/dapmtuopan.glb',
      '/model/dipi.glb',
      '/model/huanxian.glb', // 4
      '/model/jshepda.glb', // 3
      '/model/jszhuaqu.glb', // 2
      '/model/jxsb.glb',
      '/model/pmtuopan.glb',
      '/model/ren.glb',
      '/model/rukuxian.glb', //1
      '/model/tuopan.glb',
      '/model/xian.glb'
    ],
    hdrUrls: ['/hdr/HDR.hdr'],
    enableShadow: false,
    antiShake: false,
    // fog: {
    //   color: '#2c4027',
    //   intensity: 0.00022
    // },
    toneMapping: {
      toneMappingExposure: 1
    },
    outlineEnabled: false,
    dofEnabled: false,
    filterEnabled: true, // 默认为关闭，关闭后filter pass 不生效
    filter: {
      hue: 0, // 色调
      sataturation: 1, // 饱和度
      vibrance: 0.3, //
      brightness: -0.05, // 亮度
      contrast: .9, //  对比度
    },
    msaa: {
      supersampling: false
    },
    gammaEnabled: true,
    stats: false,
    // loadingBar: {
    //   show: true,
    //   type: 10
    // },
    onProgress: (model, evt) => {
      if (!CACHE.container) CACHE.container = evt
      STATE.sceneModel[model.name] = model

      // 滚动棒调颜色
      model.traverse(child => {
        if (child.isMesh && child.name.includes('Cylinder')) {
          child.material.color = new Bol3D.Color(child.material.color.r * 0.8, child.material.color.g * 0.8, child.material.color.b * 0.8)
        }
      })

      if (model.name == 'rukuxian') {
        // mesh instance
        model.traverse((child) => {
          if (child.name === "yidongshangxiaban") {
            child.userData.state = true
            STATE.flapGate = child
          } else if (child.name.includes('dingsaoji') || child.name.includes('cesaoji') || child.name == "shijuesaomaoji") {
            child.userData.setScan = API.rkScan({
              title: '货物信息',
              position: [0, .5, 0]
            }, child)
            child.userData.setScan(false)
            child.userData.index = 330
            STATE.scan[child.name] = child
            if (child.name == "shijuesaomaoji") child.userData.index = 268
            if (child.name == "cesaoji005") child.userData.index = 698
            if (child.name == "cesaoji004") child.userData.index = 1233
            if (child.name == "cesaoji003") child.userData.index = 897
            if (child.name == "cesaoji002") child.userData.index = 565
          } else if (child.isGroup && child.name.includes('dangban')) {
            const num = +child.name.slice(7)
            if (num < 16) {
              const baffle = STATE.duoRoadway.find(item => item.baffle == child.name)
              API.dbAnimetion2(child, true)
              if (baffle) baffle.baffle = child
            } else {
              const baffle = STATE.roadway.find(item => item.baffle == child.name)
              API.dbAnimetion(child, true)
              if (baffle) baffle.baffle = child
            }
          }

          if (child.isMesh) {
            if (child.name.includes('Cylinder')) {
              // mesh
              // if (!CACHE.instanceTransformInfo['rukuxian_Cylinder']) CACHE.instanceTransformInfo['rukuxian_Cylinder'] = []
              // CACHE.instanceTransformInfo['rukuxian_Cylinder'].push({
              //   position: child.position.clone(),
              //   quaternion: child.quaternion.clone(),
              //   scale: child.scale.clone()
              // })
              // if (!CACHE.instanceMeshInfo['rukuxian_Cylinder']) {
              //   CACHE.instanceMeshInfo['rukuxian_Cylinder'] = {
              //     material: child.material.clone(),
              //     geometry: child.geometry.clone()
              //   }
              // }
              // let flag = -1
              // for (let i = 0; i < evt.clickObjects.length; i++) {
              //   if (evt.clickObjects[i].uuid == child.uuid) {
              //     flag = i
              //     break
              //   }
              // }
              // if (flag != -1) evt.clickObjects.splice(flag, 1)
              // if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              // child.geometry.dispose()
              // if (child.material.map) {
              //   child.material.map.dispose()
              //   child.material.map = null
              // }
              // child.material.dispose()
              // child = null
            } else if (child.name.includes('Box')) {
              // mesh
              if (!CACHE.instanceTransformInfo['rukuxian_Box']) CACHE.instanceTransformInfo['rukuxian_Box'] = []
              CACHE.instanceTransformInfo['rukuxian_Box'].push({
                position: child.position.clone(),
                quaternion: child.quaternion.clone(),
                scale: child.scale.clone()
              })
              if (!CACHE.instanceMeshInfo['rukuxian_Box']) {
                CACHE.instanceMeshInfo['rukuxian_Box'] = {
                  material: child.material.clone(),
                  geometry: child.geometry.clone()
                }
              }
              let flag = -1
              for (let i = 0; i < evt.clickObjects.length; i++) {
                if (evt.clickObjects[i].uuid == child.uuid) {
                  flag = i
                  break
                }
              }
              if (flag != -1) evt.clickObjects.splice(flag, 1)
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            }
          }
        })
        // group instance
        // model.children.forEach((gChild) => {
        //   gChild.children.forEach((child) => {
        //     if (child.name.includes('dangban')) {
        //       // group里2个mesh
        //       if (!CACHE.instanceTransformInfo['rukuxian_' + child.name]) CACHE.instanceTransformInfo['rukuxian_' + child.name] = []
        //       CACHE.instanceTransformInfo['rukuxian_' + child.name].push({
        //         position: child.parent.position.clone(),
        //         quaternion: child.parent.quaternion.clone(),
        //         scale: child.parent.scale.clone()
        //       })
        //       if (!CACHE.instanceMeshInfo['rukuxian_' + child.name]) {
        //         CACHE.instanceMeshInfo['rukuxian_' + child.name] = {
        //           material: child.material.clone(),
        //           geometry: child.geometry.clone()
        //         }
        //       }
        //       let flag = -1
        //       for (let i = 0; i < evt.clickObjects.length; i++) {
        //         if (evt.clickObjects[i].uuid == child.uuid) {
        //           flag = i
        //           break
        //         }
        //       }
        //       if (flag != -1) evt.clickObjects.splice(flag, 1)
        //       if (!CACHE.removed[child.parent.name]) CACHE.removed[child.parent.name] = child.parent
        //       child.geometry.dispose()
        //       if (child.material.map) {
        //         child.material.map.dispose()
        //         child.material.map = null
        //       }
        //       child.material.dispose()
        //       child = null
        //     }
        //     // else if (child.name.includes('cesaoji')) {
        //     //   // group里4个mesh
        //     //   if (!CACHE.instanceTransformInfo['rukuxian_' + child.name]) CACHE.instanceTransformInfo['rukuxian_' + child.name] = []
        //     //   CACHE.instanceTransformInfo['rukuxian_' + child.name].push({
        //     //     position: child.parent.position.clone(),
        //     //     quaternion: child.parent.quaternion.clone(),
        //     //     scale: child.parent.scale.clone()
        //     //   })
        //     //   if (!CACHE.instanceMeshInfo['rukuxian_' + child.name]) {
        //     //     CACHE.instanceMeshInfo['rukuxian_' + child.name] = {
        //     //       material: child.material.clone(),
        //     //       geometry: child.geometry.clone()
        //     //     }
        //     //   }
        //     //   let flag = -1
        //     //   for (let i = 0; i < evt.clickObjects.length; i++) {
        //     //     if (evt.clickObjects[i].uuid == child.uuid) {
        //     //       flag = i
        //     //       break
        //     //     }
        //     //   }
        //     //   if (flag != -1) evt.clickObjects.splice(flag, 1)
        //     //   if (!CACHE.removed[child.parent.name]) CACHE.removed[child.parent.name] = child.parent
        //     //   child.geometry.dispose()
        //     //   if (child.material.map) {
        //     //     child.material.map.dispose()
        //     //     child.material.map = null
        //     //   }
        //     //   child.material.dispose()
        //     //   child = null
        //     // }
        //   })
        // })
      } else if (model.name == 'jszhuaqu') {
        // mesh instance
        const removeList1 = ['Line4158', 'Line4150', 'Line4142', 'Line4134', 'Line4126', 'Line4118', 'Line4110', 'Line4102', 'Line4094', 'Line4086', 'Line4078', 'Line4070', 'Line4062', 'Line4054', 'Line4046_(1)', 'Line2073', 'Box1248', 'Box1254', 'Box1236', 'Box1242', 'Box1224', 'Box1230', 'Box1212', 'Box1218', 'Box1200', 'Box1206', 'Box1188', 'Box1194', 'Box1176', 'Box1182', 'Box1170', 'Box474']
        const removeList2 = ['Box1243', 'Box1249', 'Box1231', 'Box1237', 'Box1219', 'Box1225', 'Box1207', 'Box1213', 'Box1195', 'Box1201', 'Box1183', 'Box1189', 'Box1171', 'Box1177', 'Box1165', 'Box462']
        model.traverse((child) => {
          if (child.isMesh) {
            if (child && removeList1.includes(child.name)) {
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null

            } else if (child && removeList2.includes(child.name)) {
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            }
            //     if (child.name.includes('Box')) { // mesh
            //       if (!CACHE.instanceTransformInfo['jszhuaqu_Box']) CACHE.instanceTransformInfo['jszhuaqu_Box'] = []
            //       CACHE.instanceTransformInfo['jszhuaqu_Box'].push({
            //         position: child.position.clone(),
            //         quaternion: child.quaternion.clone(),
            //         scale: child.scale.clone()
            //       })
            //       if (!CACHE.instanceMeshInfo['jszhuaqu_Box']) {
            //         CACHE.instanceMeshInfo['jszhuaqu_Box'] = {
            //           material: child.material.clone(),
            //           geometry: child.geometry.clone()
            //         }
            //       }
            //       let flag = -1
            //       for (let i = 0; i < evt.clickObjects.length; i++) {
            //         if (evt.clickObjects[i].uuid == child.uuid) {
            //           flag = i
            //           break
            //         }
            //       }
            //       if (flag != -1) evt.clickObjects.splice(flag, 1)
            //       if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
            //       child.geometry.dispose()
            //       if (child.material.map) {
            //         child.material.map.dispose()
            //         child.material.map = null
            //       }
            //       child.material.dispose()
            //       child = null
            //     } else if (child.name.includes('Line')) { // mesh
            //       // if (!CACHE.instanceTransformInfo['jszhuaqu_Line']) CACHE.instanceTransformInfo['jszhuaqu_Line'] = []
            //       // CACHE.instanceTransformInfo['jszhuaqu_Line'].push({
            //       //   position: child.position.clone(),
            //       //   quaternion: child.quaternion.clone(),
            //       //   scale: child.scale.clone()
            //       // })
            //       // if (!CACHE.instanceMeshInfo['jszhuaqu_Line']) {
            //       //   CACHE.instanceMeshInfo['jszhuaqu_Line'] = {
            //       //     material: child.material.clone(),
            //       //     geometry: child.geometry.clone()
            //       //   }
            //       // }
            //       // let flag = -1
            //       // for (let i = 0; i < evt.clickObjects.length; i++) {
            //       //   if (evt.clickObjects[i].uuid == child.uuid) {
            //       //     flag = i
            //       //     break
            //       //   }
            //       // }
            //       // if (flag != -1) evt.clickObjects.splice(flag, 1)
            //       // if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
            //       // child.geometry.dispose()
            //       // if (child.material.map) {
            //       //   child.material.map.dispose()
            //       //   child.material.map = null
            //       // }
            //       // child.material.dispose()
            //       // child = null
            //     } else
            else if (child && child.name.includes('Cylinder')) {
              // mesh
              if (!CACHE.instanceTransformInfo['jszhuaqu_Cylinder']) CACHE.instanceTransformInfo['jszhuaqu_Cylinder'] = []
              CACHE.instanceTransformInfo['jszhuaqu_Cylinder'].push({
                position: child.position.clone(),
                quaternion: child.quaternion.clone(),
                scale: child.scale.clone()
              })
              if (!CACHE.instanceMeshInfo['jszhuaqu_Cylinder']) {
                CACHE.instanceMeshInfo['jszhuaqu_Cylinder'] = {
                  material: child.material.clone(),
                  geometry: child.geometry.clone()
                }
              }
              let flag = -1
              for (let i = 0; i < evt.clickObjects.length; i++) {
                if (evt.clickObjects[i].uuid == child.uuid) {
                  flag = i
                  break
                }
              }
              if (flag != -1) evt.clickObjects.splice(flag, 1)
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            }
            // else if (child.name.includes('Circle')) { // mesh
            //       if (!CACHE.instanceTransformInfo['jszhuaqu_Circle']) CACHE.instanceTransformInfo['jszhuaqu_Circle'] = []
            //       CACHE.instanceTransformInfo['jszhuaqu_Circle'].push({
            //         position: child.position.clone(),
            //         quaternion: child.quaternion.clone(),
            //         scale: child.scale.clone()
            //       })
            //       if (!CACHE.instanceMeshInfo['jszhuaqu_Circle']) {
            //         CACHE.instanceMeshInfo['jszhuaqu_Circle'] = {
            //           material: child.material.clone(),
            //           geometry: child.geometry.clone()
            //         }
            //       }
            //       let flag = -1
            //       for (let i = 0; i < evt.clickObjects.length; i++) {
            //         if (evt.clickObjects[i].uuid == child.uuid) {
            //           flag = i
            //           break
            //         }
            //       }
            //       if (flag != -1) evt.clickObjects.splice(flag, 1)
            //       if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
            //       child.geometry.dispose()
            //       if (child.material.map) {
            //         child.material.map.dispose()
            //         child.material.map = null
            //       }
            //       child.material.dispose()
            //       child = null
            //     }
          }
        })
      } else if (model.name == 'jshepda') {

        // mesh instance
        model.traverse((child) => {
          if (child.name.includes('dong')) {
            const machine = STATE.roadway.find(item => item.machine == child.name)
            if (machine) machine.machine = child
          }

          if (child.name.includes('Box1')) {
            child.visible = false
          }

          if (child.isMesh && child.name.includes('_1')) {
            STATE.tempClickObjects.push(child)
            child.userData.setScan = API.rkScan({
              title: "货架信息",
              position: [0, 0.5, 0]
            }, child)
            child.userData.type = 'huojia'
            child.userData.setScan(false)
          }

          if (child.name.includes('dong')) {
            child.traverse(child2 => {
              if (child2.isMesh) {
                STATE.tempClickObjects.push(child2)
                child2.userData.setScan = API.rkScan({
                  title: "堆垛机信息",
                  position: [0, 0.5, 0]
                }, child2)
                child2.userData.type = 'duiduoji'
                child2.userData.setScan(false)
              }
            })
          }


          if (child.isMesh) {
            if (child.name.includes('Line')) {
              // if (!CACHE.instanceTransformInfo['jshepda_Line']) CACHE.instanceTransformInfo['jshepda_Line'] = []
              // CACHE.instanceTransformInfo['jshepda_Line'].push({
              //   position: child.position.clone(),
              //   quaternion: child.quaternion.clone(),
              //   scale: child.scale.clone()
              // })
              // if (!CACHE.instanceMeshInfo['jshepda_Line']) {
              //   CACHE.instanceMeshInfo['jshepda_Line'] = {
              //     material: child.material.clone(),
              //     geometry: child.geometry.clone()
              //   }
              // }
              // let flag = -1
              // for (let i = 0; i < evt.clickObjects.length; i++) {
              //   if (evt.clickObjects[i].uuid == child.uuid) {
              //     flag = i
              //     break
              //   }
              // }
              // if (flag != -1) evt.clickObjects.splice(flag, 1)
              // if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              // child.geometry.dispose()
              // if (child.material.map) {
              //   child.material.map.dispose()
              //   child.material.map = null
              // }
              // child.material.dispose()
              // child = null
            } else if (child.name.includes('moxdg')) {
              if (!CACHE.instanceTransformInfo['jshepda_moxdg']) CACHE.instanceTransformInfo['jshepda_moxdg'] = []
              CACHE.instanceTransformInfo['jshepda_moxdg'].push({
                position: child.position.clone(),
                quaternion: child.quaternion.clone(),
                scale: child.scale.clone()
              })
              if (!CACHE.instanceMeshInfo['jshepda_moxdg']) {
                CACHE.instanceMeshInfo['jshepda_moxdg'] = {
                  material: child.material.clone(),
                  geometry: child.geometry.clone()
                }
              }
              let flag = -1
              for (let i = 0; i < evt.clickObjects.length; i++) {
                if (evt.clickObjects[i].uuid == child.uuid) {
                  flag = i
                  break
                }
              }
              if (flag != -1) evt.clickObjects.splice(flag, 1)
              if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            } else if (child.name.includes('对象')) {
              // if (!CACHE.instanceTransformInfo['jshepda_对象']) CACHE.instanceTransformInfo['jshepda_对象'] = []
              // CACHE.instanceTransformInfo['jshepda_对象'].push({
              //   position: child.position.clone(),
              //   quaternion: child.quaternion.clone(),
              //   scale: child.scale.clone()
              // })
              // if (!CACHE.instanceMeshInfo['jshepda_对象']) {
              //   CACHE.instanceMeshInfo['jshepda_对象'] = {
              //     material: child.material.clone(),
              //     geometry: child.geometry.clone()
              //   }
              // }
              // let flag = -1
              // for (let i = 0; i < evt.clickObjects.length; i++) {
              //   if (evt.clickObjects[i].uuid == child.uuid) {
              //     flag = i
              //     break
              //   }
              // }
              // if (flag != -1) evt.clickObjects.splice(flag, 1)
              // if (!CACHE.removed[child.name]) CACHE.removed[child.name] = child
              // child.geometry.dispose()
              // if (child.material.map) {
              //   child.material.map.dispose()
              //   child.material.map = null
              // }
              // child.material.dispose()
              // child = null
            }
          }
        })

        // group instance
        // model.children.forEach((gChild) => {
        //   if (gChild.name.includes('dong')) {
        //   }
        // })
      } else if (model.name == 'huanxian') {
        // mesh instance
        model.traverse((child) => {
          if (child.isMesh) {

            if (child.name === 'lianjie_2') {
              STATE.lianjie = child
            }

            // instance 上下板箱子
            const boxList = ['Line4526', 'Line4472', 'Line4339', 'Line4348', 'Line4357', 'Line4366', 'Line4375', 'Line4526', 'Line4384', 'Line4393', 'Line4402', 'Line4411', 'Line4420', 'Line4429', 'Line4438', 'Line4447', 'Line4456', 'Line4465']
            if (boxList.includes(child.name)) {
              API.instance(child, 'huanxian_Box')
            }


            // instance 特殊形状的钢管1 (826)
            const longCylinderList1 = ['Cylinder3768', 'Cylinder6446', 'Cylinder6367', 'Cylinder988', 'Cylinder989', 'Cylinder6366', 'Cylinder6364', 'Cylinder3824', 'Cylinder3817', 'Cylinder6365', 'Cylinder3442']
            if (child && longCylinderList1.includes(child.name)) {
              // API.instance(child, 'huanxian_LongCylinder1')
              API.instance(child, 'huanxian_LongCylinder1')
            }

            // instance 特殊形状的钢管2 (810)
            const longCylinderList2 = ['Cylinder3111', 'Cylinder3128', 'Cylinder3145', 'Cylinder3485', 'Cylinder3162', 'Cylinder3505', 'Cylinder3179', 'Cylinder3196', 'Cylinder3505', 'Cylinder3525', 'Cylinder3545', 'Cylinder3213', 'Cylinder3565', 'Cylinder6326', 'Cylinder3247', 'Cylinder3585', 'Cylinder3263', 'Cylinder3605', 'Cylinder3280', 'Cylinder3625', 'Cylinder3297', 'Cylinder3645', 'Cylinder3314', 'Cylinder3665', 'Cylinder3331', 'Cylinder3685', 'Cylinder3348', 'Cylinder3705', 'Cylinder3365', 'Cylinder3725', 'Cylinder3382', 'Cylinder3745', 'Cylinder3402', 'Cylinder3419', 'Cylinder3765', 'Cylinder3436']
            if (child && longCylinderList2.includes(child.name)) {
              API.instance(child, 'huanxian_LongCylinder2')
            }

            // merge 小滚轮
            const smallCylinder = ['Cylinder1196', 'Cylinder1194', 'Cylinder1192', 'Cylinder1190', 'Cylinder1188', 'Cylinder1186', 'Cylinder1184', 'Cylinder1182', 'Cylinder1180', 'Cylinder1178', 'Cylinder1176', 'Cylinder1174', 'Cylinder1172', 'Cylinder1170', 'Cylinder1168', 'Cylinder1166', 'Cylinder1164', 'Cylinder1162', 'Cylinder1160', 'Cylinder1158', 'Cylinder1156', 'Cylinder1154', 'Cylinder1152', 'Cylinder1150', 'Cylinder1148', 'Cylinder1146', 'Cylinder1144', 'Cylinder1142', 'Cylinder1140', 'Cylinder1138', 'Cylinder6447', 'Cylinder6448', 'Cylinder6449', 'Cylinder6450', 'Cylinder6451', 'Cylinder6452', 'Cylinder6453', 'Cylinder6454', 'Cylinder6455', 'Cylinder6456', 'Cylinder6457', 'Cylinder6458', 'Cylinder6459', 'Cylinder6460', 'Cylinder6461', 'Cylinder6462', 'Cylinder6463', 'Cylinder6464', 'Cylinder6465', 'Cylinder6466', 'Cylinder6467', 'Cylinder6468', 'Cylinder6469', 'Cylinder6470', 'Cylinder6471', 'Cylinder6472', 'Cylinder6472', 'Cylinder6473', 'Cylinder6474', 'Cylinder6475', 'Cylinder6476', 'Cylinder2411', 'Cylinder2409', 'Cylinder2407', 'Cylinder2405', 'Cylinder2403', 'Cylinder2401', 'Cylinder2399', 'Cylinder2397', 'Cylinder2395', 'Cylinder2393', 'Cylinder2391', 'Cylinder2389', 'Cylinder2387', 'Cylinder2385', 'Cylinder2383', 'Cylinder2381', 'Cylinder2379', 'Cylinder2377', 'Cylinder2375', 'Cylinder2373', 'Cylinder2371', 'Cylinder2369', 'Cylinder2367', 'Cylinder2365', 'Cylinder2363', 'Cylinder2361', 'Cylinder2359', 'Cylinder2357', 'Cylinder2355', 'Cylinder2353', 'Cylinder4510', 'Cylinder4508', 'Cylinder4506', 'Cylinder4504', 'Cylinder4502', 'Cylinder4500', 'Cylinder4498', 'Cylinder4496', 'Cylinder4494', 'Cylinder4492', 'Cylinder4490', 'Cylinder4488', 'Cylinder4486', 'Cylinder4484', 'Cylinder4482', 'Cylinder4480', 'Cylinder4478', 'Cylinder4476', 'Cylinder4474', 'Cylinder4472', 'Cylinder4470', 'Cylinder4468', 'Cylinder4466', 'Cylinder4464', 'Cylinder4462', 'Cylinder4460', 'Cylinder4458', 'Cylinder4456', 'Cylinder4454', 'Cylinder4452']
            if (child && smallCylinder.includes(child.name)) {
              API.mergedMesh(child, 'huanxian_smallCylinder')
            }
          }
        })

        // group instance
        // model.children.forEach((gChild) => {
        //   if (gChild.name == 'xiaolunlun') {
        //     gChild.visible = false
        //   } else if (gChild.name.includes('Cylinder')) {
        //     gChild.visible = false
        //   } else {
        //     gChild.visible = false
        //   }
        // })

        // scan弹窗
        model.traverse(child => {
          if (child.isMesh && child.name === 'tishengji') STATE.tishengji = child
          if (child.isMesh && (child.name === '对象157' || child.name === '对象158' || child.name === '对象159')) {
            STATE.tempClickObjects.push(child)
            child.userData.setScan = API.rkScan({
              title: "提升机信息",
              position: [0, 0.5, 0]
            }, child)
            child.userData.setScan(false)
            child.userData.type = 'tishengji'
          }
        })
      } else if (model.name == 'dipi') {
        model.traverse(child => {
          if (child.name == "dipi" && child.isMesh) {
            CACHE.dipi = child
            child.material.encoding = Bol3D.sRGBEncoding
            child.material.color.set('#0d2121')
            child.material.emissive.set('#0a5643')
            child.material.roughness = 0.48
            child.material.metalness = 0.1
            child.material.transparent = false
            child.material.opacity = 0.8
          }
          if (child.name == "Line001" && child.isMesh) {
            child.material.encoding = Bol3D.sRGBEncoding
            child.material.emissive.set('#5e491b')
            child.material.color.set('#5e491b')
            child.castShadow = false
          }
        })

      } else if (model.name == 'xian') {
        model.traverse(child => {
          if (child.isMesh) {
            child.visible = false
            const { array } = child.geometry.attributes.position
            const arr = []
            for (let index = 0; index < array.length - 19; index = index + 18) {
              if (!STATE.lineObjects[child.name]) STATE.lineObjects[child.name] = []
              const point = array.slice(index, index + 3)
              point[0] += child.position.x
              point[1] += child.position.y
              point[2] += child.position.z
              arr.push(point)
            }
            // 除了这几个线，其他的线的index要翻转一下
            const noReverseNameList = ["F3", "F459", "F462", "F465", "F468", "F471", "F474", "F477", "F480", "F483", "F486", "F489", "F492", "F495", "F498", "F501", "F504", "F507"]
            if (child.name.includes('F') && !noReverseNameList.includes(child.name)) {
              STATE.lineObjects[child.name] = arr.reverse()
            }
            STATE.lineObjects[child.name] = arr
          }
        })

      } else if (model.name == 'jxsb') {
        for (const key in STATE.jxsbObject) {
          const modelClone = Bol3D.SkeletonUtils.clone(model)
          modelClone.traverse(child => {
            if (child.isMesh && (child.name === 'huo' || child.name === 'huo001')) {
              child.visible = false
            }
          })
          modelClone.name = key
          modelClone.position.set(...STATE.jxsbObject[key].position)
          const mixer1 = new Bol3D.AnimationMixer(modelClone)
          const move = mixer1.clipAction(container.sceneAnimations.jxsb[0].clone()) // start
          const move1 = mixer1.clipAction(container.sceneAnimations.jxsb[1].clone()) // start
          container.mixers.push(mixer1)
          move.loop = Bol3D.LoopOnce
          move.clampWhenFinished = true

          move1.loop = Bol3D.LoopOnce
          move1.clampWhenFinished = true

          modelClone.userData.Animation = move
          modelClone.userData.Animation1 = move1
          mixer1.stopAllAction()
          STATE.jxsbObject[key].model = modelClone
          STATE.sceneModel[key] = modelClone
          container.attach(modelClone)

          modelClone.traverse(child => {
            if (child.isMesh) {
              STATE.tempClickObjects.push(child)
              child.userData.setScan = API.rkScan({
                title: "机器人信息",
                position: [0, 0.5, 0]
              }, child)
              child.userData.setScan(false)
              child.userData.type = 'jiqiren'
            }
          })
        }
        container.remove(model)
      } else if (model.name === 'tuopan') {
        model.parent.remove(model)
      } else if (model.name === 'pmtuopan') {
        const shouji = model.children.find(e => e.name === 'shouji')
        shouji.parent.remove(shouji)
      }
      if (model.name.includes('tuopan')) {
        container.remove(model)
      }

    },
    onLoad: (evt) => {
      window.container = evt
      window.CACHE = CACHE
      // API.addReflector()



      // 初始化料箱
      for (let i = 0, j = STATE.loopRoadway.length; i < j; i++) {
        const liaoxiang = i < 2 ? STATE.sceneModel['dapmtuopan'].clone() : STATE.sceneModel['pmtuopan'].clone()
        STATE.loopRoadway[i].liaoxiang = liaoxiang
        CACHE.container.attach(STATE.loopRoadway[i].liaoxiang)
        liaoxiang.position.set(...STATE.loopRoadway[i].position)
      }
      // D3上的料箱
      for (let i = 0; i < STATE.lineObjects.D3.length / 25; i++) {
        const liaoxiang = STATE.sceneModel['pmtuopan'].clone()
        for (let j = 0; j < liaoxiang.children.length; j++) {
          if (liaoxiang.children[j].name != 'pmtuopan001') {
            liaoxiang.remove(liaoxiang.children[j])
            j--
          }
        }
        STATE.D3RunArr.push(liaoxiang)
        CACHE.container.attach(liaoxiang)
        if (i % 2 != 0) liaoxiang.visible = false
        liaoxiang.position.set(...STATE.lineObjects.D3[i * 25])
        liaoxiang.userData.index = 25 * i
        liaoxiang.userData.lineName = 'D3'
        liaoxiang.rotation.y = -Math.PI / 2
      }

      // remove unused obj3d
      for (const i in CACHE.removed) {
        const removed = CACHE.removed[i]
        removed.parent.remove(removed)
      }
      delete CACHE.removed

      // instance
      for (const key in CACHE.instanceMeshInfo) {
        const { geometry, material } = CACHE.instanceMeshInfo[key]
        const count = CACHE.instanceTransformInfo[key].length
        const instanceMesh = new Bol3D.InstancedMesh(geometry, material, count)
        // instanceMesh.castShadow = true
        const matrix = new Bol3D.Matrix4()
        for (let i = 0; i < count; i++) {
          const { position, quaternion, scale } = CACHE.instanceTransformInfo[key][i]
          matrix.compose(position, quaternion, scale)
          instanceMesh.setMatrixAt(i, matrix)
        }
        instanceMesh.name = key
        evt.scene.add(instanceMesh)

        STATE.sceneModel[key] = instanceMesh
        // CACHE.outsideScene.push(instanceMesh);
      }

      // mergeMesh
      for (const key in CACHE.mergeMeshInfo) {
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(CACHE.mergeMeshInfo[key])
        const merged = new Bol3D.Mesh(mergedGeometry, CACHE.mergeMeshMaterialInfo[key])
        merged.name = key

        if (key === 'huanxian_smallCylinder') {
          merged.material.aoMap = null
          merged.material.color = new Bol3D.Color(0.4, 0.4, 0.4)
        }
        container.attach(merged)
        STATE.sceneModel[key] = merged
      }

      window.STATE = STATE




      // API.loadGUI()
      setTimeout(() => {
        API.getData()
      }, 2000)
      API.initEvent()
      container.clickObjects = STATE.tempClickObjects
      API.reload()

      API.render()

      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => {
    if (e.objects.length) {
      console.log(e.objects[0].object)

    }
  }
  events.onhover = (e) => { }
  events.enabled.hover = false

  // window.events = events
}
