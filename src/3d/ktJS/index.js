import { API } from './API.js'
import { CACHE } from './CACHE.js'
import { STATE } from './STATE.js'
import { DATA } from './DATA.js'

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
        far: 300,
        fov: 30
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
        enableDamping: true,
        dampingFactor: 0.05
      }
    },
    lights: {
      directionLights: [
        {
          color: 0xedeacc,
          intensity: 1.0,
          position: [20.3, 70, 40.2],
          mapSize: [4096, 4096],
          near: 10,
          far: 15000,
          bias: -0.001,
          distance: 8000
        }
      ],
      ambientLight: {
        color: '#ffffff',
        intensity: 0
      }
    },
    background: {
      type: 'color',
      value: '#333333'
    },
    modelUrls: [
      '/model/dapmtuopan.glb',
      '/model/dipi-1.glb',
      '/model/dipi-22125.glb',
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
    msaa: {
      supersampling: false
    },
    gammaEnabled: true,
    stats: true,
    // loadingBar: {
    //   show: true,
    //   type: 10
    // }
    onProgress: (model, evt) => {
      if (model.name == 'rukuxian') {
        // mesh instance
        model.traverse((child) => {
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
        // console.log('model', model)

        // mesh instance
        model.traverse((child) => {
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
        console.log('model', model)

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
      } else if (model.name == 'dipi-1') {
        console.log('model: ', model);

      }
    },
    onLoad: (evt) => {
      CACHE.container = evt
      window.container = evt

      console.log('CACHE', CACHE.instanceTransformInfo, CACHE.instanceMeshInfo, CACHE.removed)

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
      callback && callback()
    }
  })

  const events = new Bol3D.Events(container)
  events.ondbclick = (e) => {}
  events.onhover = (e) => {}
  events.enabled.hover = false

  // window.events = events
}
