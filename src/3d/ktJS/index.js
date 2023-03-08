import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import { DATA } from './DATA.js'
import '../asset/main.less'



let container

export const sceneOnLoad = ({ domElement, callback }) => {
  container = new Bol3D.Container({
    publicPath: STATE.PUBLIC_PATH,
    container: domElement,
    viewState: 'orbit',
    bloomEnabled: false,
    cameras: {
      orbitCamera: {
        position: [STATE.initialState.position.x, STATE.initialState.position.y, STATE.initialState.position.z],
        near: 1,
        far: 3000,
        fov: 45
      }
    },
    controls: {
      orbitControls: {
        autoRotate: false,
        autoRotateSpeed: 1,
        target: [STATE.initialState.target.x, STATE.initialState.target.y, STATE.initialState.target.z],
        // minDistance: 0,
        // maxDistance: 2500,
        maxPolarAngle: Math.PI * 0.44,
        minPolarAngle: Math.PI * 0.05,
        enableDamping: false,
        dampingFactor: 0
      }
    },
    lights: {
      directionLights: [{
        color: 0xffe3dc,
        intensity: 1.27,
        position: [380, 560, 40],
        mapSize: [4096, 4096],
        near: 0.001,
        far: 1100,
        bias: -0.0001,
        distance: 34.1,
        target: [0, 0, 0]
      }],
      ambientLight: {
        color: '#ffffff',
        intensity: 0.5
      }
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
    enableShadow: true,
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
    msaa: {
      supersampling: false
    },
    gammaEnabled: true,
    stats: true,
    // loadingBar: {
    //   show: true,
    //   type: 10
    // },
    onProgress: (model, evt) => {
      STATE.sceneModel[model.name] = model

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
        model.children.forEach((gChild) => {
          gChild.children.forEach((child) => {
            if (child.name.includes('dangban')) {
              // group里2个mesh
              if (!CACHE.instanceTransformInfo['rukuxian_' + child.name]) CACHE.instanceTransformInfo['rukuxian_' + child.name] = []
              CACHE.instanceTransformInfo['rukuxian_' + child.name].push({
                position: child.parent.position.clone(),
                quaternion: child.parent.quaternion.clone(),
                scale: child.parent.scale.clone()
              })
              if (!CACHE.instanceMeshInfo['rukuxian_' + child.name]) {
                CACHE.instanceMeshInfo['rukuxian_' + child.name] = {
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
              if (!CACHE.removed[child.parent.name]) CACHE.removed[child.parent.name] = child.parent
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            } else if (child.name.includes('cesaoji')) {
              // group里4个mesh
              if (!CACHE.instanceTransformInfo['rukuxian_' + child.name]) CACHE.instanceTransformInfo['rukuxian_' + child.name] = []
              CACHE.instanceTransformInfo['rukuxian_' + child.name].push({
                position: child.parent.position.clone(),
                quaternion: child.parent.quaternion.clone(),
                scale: child.parent.scale.clone()
              })
              if (!CACHE.instanceMeshInfo['rukuxian_' + child.name]) {
                CACHE.instanceMeshInfo['rukuxian_' + child.name] = {
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
              if (!CACHE.removed[child.parent.name]) CACHE.removed[child.parent.name] = child.parent
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
                child.material.map = null
              }
              child.material.dispose()
              child = null
            }
          })
        })
      } else if (model.name == 'jszhuaqu') {
        // mesh instance
        model.traverse((child) => {
          if (child.isMesh) {
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
            if (child.name.includes('Cylinder')) {
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
        // model.traverse((child) => {
        //   if (child.isMesh) {
        //     if (child.name.includes('Cylinder')) {
        //       if (!CACHE.instanceTransformInfo['huanxian_Cylinder']) CACHE.instanceTransformInfo['huanxian_Cylinder'] = []
        //       CACHE.instanceTransformInfo['huanxian_Cylinder'].push({
        //         position: child.position.clone(),
        //         quaternion: child.quaternion.clone(),
        //         scale: child.scale.clone()
        //       })
        //       if (!CACHE.instanceMeshInfo['huanxian_Cylinder']) {
        //         CACHE.instanceMeshInfo['huanxian_Cylinder'] = {
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
        //   }
        // })

        // group instance
        // model.children.forEach((gChild) => {
        //   if (gChild.name == 'xiaolunlun') {
        //     gChild.visible = false
        //   } else if (gChild.name.includes('Cylinder')) {
        //     gChild.visible = false
        //   }  else {
        //     gChild.visible = false
        //   }
        // })
        model.traverse(child => {
          // if (child.isMesh && child.name === 'NONE') csdObject.push(child);
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
            child.material.encoding = Bol3D.sRGBEncoding
            child.material.emissive.set('#141313')
            child.material.color.set('#141313')
            child.material.roughness = 0.5
            child.material.metalness = 0.5
            // child.material.transparent = true
            // child.material.opacity = 0.5
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
        model.position.set(1, 1, 1)
      } else if (model.name.includes('tuopan')) {
        container.remove(model)
      }

    },
    onLoad: (evt) => {
      CACHE.container = evt
      window.container = evt
      // API.addReflector()


      // remove unused obj3d
      for (const i in CACHE.removed) {
        const removed = CACHE.removed[i]
        removed.parent.remove(removed)
      }

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
        evt.scene.add(instanceMesh)
        // CACHE.outsideScene.push(instanceMesh);
      }

      API.loadGUI()
      API.getData()
      API.initEvent()
      container.clickObjects = STATE.tempClickObjects

      API.render()

      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => { }
  events.onhover = (e) => { }
  events.enabled.hover = false

  // window.events = events
}
