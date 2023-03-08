import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'

// 相机动画（传指定state）
const targetPos = new Bol3D.Vector3()
const pos = new Bol3D.Vector3()
function cameraAnimation ({ cameraState, callback, delayTime = 0, duration = 800 }) {
  targetPos.set(cameraState.target.x, cameraState.target.y, cameraState.target.z)
  pos.set(cameraState.position.x, cameraState.position.y, cameraState.position.z)

  if (targetPos.distanceTo(CACHE.container.orbitControls.target) < 0.1 && pos.distanceTo(CACHE.container.orbitControls.object.position) < 0.1) {
    callback && callback()
    return
  }

  if (STATE.isAnimating) return
  STATE.isAnimating = true

  CACHE.container.orbitControls.enabled = false

  let count = 0

  const t1 = new Bol3D.TWEEN.Tween(CACHE.container.orbitControls.object.position)
    .to(
      {
        x: cameraState.position.x,
        y: cameraState.position.y,
        z: cameraState.position.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++

      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  t1.delay(delayTime).start()

  const t2 = new Bol3D.TWEEN.Tween(CACHE.container.orbitControls.target)
    .to(
      {
        x: cameraState.target.x,
        y: cameraState.target.y,
        z: cameraState.target.z
      },
      duration
    )
    .onUpdate(() => { })
    .onComplete(() => {
      count++
      if (count == 2) {
        CACHE.container.orbitControls.enabled = true
        STATE.isAnimating = false
        callback && callback()
      }
    })

  t1.delay(delayTime).start()
  t2.delay(delayTime).start()

  return t1
}

function loadGUI () {
  // gui
  const gui = new dat.GUI()
  // default opts
  const deafultsScene = { distance: 8000, }
  // scenes
  const scenesFolder = gui.addFolder('场景')
  // toneMapping
  scenesFolder.add(CACHE.container.renderer, 'toneMappingExposure', 0, 10).step(0.001).name('exposure')
  scenesFolder.add(CACHE.container.ambientLight, 'intensity').step(0.1).min(0).max(10).name('环境光强度')
  scenesFolder.add(CACHE.container.gammaPass, 'enabled').name('gamma校正')
  scenesFolder
    .addColor(CACHE.container.attrs.lights.directionLights[0], 'color')
    .onChange((val) => {
      CACHE.container.directionLights[0].color.set(val)
    })
    .name('平行光颜色')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'x')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'y')
  scenesFolder.add(CACHE.container.directionLights[0].position, 'z')
  scenesFolder.add(deafultsScene, 'distance').step(0.1).onChange((val) => {
    CACHE.container.directionLights[0].shadow.camera.left = -val
    CACHE.container.directionLights[0].shadow.camera.right = val
    CACHE.container.directionLights[0].shadow.camera.top = val
    CACHE.container.directionLights[0].shadow.camera.bottom = -val
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'far').step(10).onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder.add(CACHE.container.directionLights[0].shadow.camera, 'near').onChange(() => {
    CACHE.container.directionLights[0].shadow.camera.updateProjectionMatrix()
    CACHE.container.directionLights[0].shadow.needsUpdate = true
  })
  scenesFolder
    .add(CACHE.container.directionLights[0].shadow, 'bias')
    .step(0.0001)
    .onChange(() => {
      CACHE.container.directionLights[0].shadow.needsUpdate = true
    })
  scenesFolder.add(CACHE.container.directionLights[0], 'intensity').step(0.01).min(0).max(3)


  // filter pass
  const filterFolder = gui.addFolder('滤镜')
  const defaultsFilter = {
    hue: 0,
    saturation: 1,
    vibrance: 0,
    brightness: 0,
    contrast: 1
  }
  filterFolder.add(CACHE.container.filterPass, 'enabled')
  filterFolder
    .add(defaultsFilter, 'hue')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.hue.value = val
    })
  filterFolder
    .add(defaultsFilter, 'saturation')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.saturation.value = val
    })
  filterFolder
    .add(defaultsFilter, 'vibrance')
    .min(0)
    .max(10)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.vibrance.value = val
    })

  filterFolder
    .add(defaultsFilter, 'brightness')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.brightness.value = val
    })
  filterFolder
    .add(defaultsFilter, 'contrast')
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((val) => {
      CACHE.container.filterPass.filterMaterial.uniforms.contrast.value = val
    })


}

// 入库扫描机   函数柯里化
function rkScan (prop, scan) {
  const popup = new InitPopup(prop)

  let timer = null
  if (scan) scan.add(popup)
  else container.attach(popup)
  return function (visible, lasting = false) {
    if (timer) clearTimeout(timer)
    if (visible && !lasting) timer = setTimeout(() => {
      clearTimeout(timer)
      popup.visible = false
    }, 10000)


    if (!popup.contentDom.innerHTML.replace(' ', '')) {
      popup.visible = visible
    }



    return function (obj) {
      let html = ''
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          html += `<div><span class="content-tit">${key}：</span>${obj[key]}</div>`
        }
      }
      popup.contentDom.innerHTML = html
    }
  }
}




// 创建弹窗
class InitPopup extends Bol3D.CSS3DSprite {
  contentDom
  constructor(prop) {

    const pop = document.createElement('div')
    pop.className = 'viewPopup'

    const header = document.createElement('div')
    header.className = 'viewPopup-head'
    header.textContent = prop.title

    const close = document.createElement('div')
    close.className = 'viewPopup-close'
    header.appendChild(close)
    pop.appendChild(header)

    const content = document.createElement('div')
    content.className = 'viewPopup-content'
    pop.appendChild(content)


    const footer = document.createElement('div')
    footer.className = 'viewPopup-footer'
    pop.appendChild(footer)

    super(pop)

    this.contentDom = content

    if (prop.position) this.position.set(...prop.position)
    this.scale.set(.008, .008, .008)
    const self = this
    close.onclick = function () {
      self.visible = false
      if (prop.close) prop.close()
    }
  }
}

// 实例化模型
function instance (model) {
  const returnObj = []

  let geometry = null
  let material = null

  const symbolModel = [] // length position长度  models 具有相同长度的模型          position长度相同视为同一模型
  model.traverse(child => {
    if (child && child.isMesh && child.name.includes('Cylinder') && child.name != "Cylinder6379" && child.parent.name != 'xiaolunlun') {
      // 把position长度相同的归一类
      const tempIndex = symbolModel.findIndex(e => e.length === child.geometry.getAttribute('position').array.length)
      if (tempIndex != '-1') {
        symbolModel[tempIndex].models.push(child)
      } else {
        symbolModel.push({
          length: child.geometry.getAttribute('position').array.length,
          models: [child],
          finalMeshArr: []
        })
      }
    }
  })

  function recursion (symbolModel) {
    for (let i = 0; i < symbolModel.models.length; i++) {
      const child = symbolModel.models[i]
      geometry = child.geometry.clone()
      material = child.material.clone()
      const position = new Bol3D.Vector3()
      const rotation = child.rotation.clone()
      const scale = new Bol3D.Vector3()
      child.getWorldPosition(position)
      child.getWorldScale(scale)
      if (child.name === 'Cylinder2729' || child.name === 'Cylinder1996') {


      }
      symbolModel.finalMeshArr.push({ position, rotation, scale })
      child.removeFromParent()
      child.geometry.dispose()
      child.material.dispose()
    }
  }



  for (let j = 0; j < symbolModel.length; j++) {
    recursion(symbolModel[j])
    //创建具有多个实例的实例化几何体
    const insMesh = new Bol3D.InstancedMesh(geometry, material, symbolModel[j].finalMeshArr.length)

    const transform = new Bol3D.Object3D()

    symbolModel[j].finalMeshArr.forEach((item, index) => {

      transform.position.copy(item.position)
      transform.scale.copy(item.scale)
      transform.rotation.copy(item.rotation)
      transform.updateMatrix()
      insMesh.setMatrixAt(index, transform.matrix)
    })
    container.attach(insMesh)
    // insMesh.visible = false
    returnObj.push(insMesh)
  }

  return returnObj
}

// 获取数据
function getData () {
  // websocket 推三维数据
  let wsMessage
  const ws = new WebSocket(
    // `ws://127.0.0.1:8001/`
    `ws://192.168.8.170:5443/null`
  )

  ws.onmessage = function (e) {
    wsMessage = JSON.parse(e.data)

    // EquValue: 托盘条码
    // EquValue2: 产品条码
    // Dest: 目的地


    // 有些没名字
    if (wsMessage.EquName) {
      if (wsMessage.EquName === '入库扫描') {
        const box = addMesh(wsMessage.EquValue2, wsMessage.EquValue)
        // const baffle = 0;
        const baffle = wsMessage.Dest
        box.userData.roadway = baffle
        box.userData.lineName = 'B1'
        box.userData.index = 0
        // box.userData.barCode = wsMessage.
        box.position.set(...STATE.lineObjects.B1[0])
        STATE.rkBoxArr.push(box)


      } else if (wsMessage.EquName.includes('堆垛机')) {
        let type = ''
        if (wsMessage.EquName.includes('上架')) type = '入库'
        else if (wsMessage.EquName.includes('下架')) type = '出库'

        const duiduojiNum = wsMessage.EquName.replace(/[^0-9]/ig, "")
        const baffle = STATE.roadway.findIndex(e => e.duiduojiNum == duiduojiNum)
        if (type === '入库') {
          if (STATE.roadway[baffle]?.boxArr?.length > 0 && !STATE.roadway[baffle].machine?.userData?.isruniing) {
            STATE.roadway[baffle].machine.isruniing = true
            ddjAnimetion(STATE.roadway[baffle].machine, 1, () => {
              let box1 = STATE.roadway[baffle]?.boxArr.shift()
              container.remove(box1)
              let index = STATE.rkBoxArr.findIndex(item => item == box1)
              STATE.rkBoxArr.splice(index, 1)
            }, () => {
              STATE.roadway[baffle].machine.isruniing = false
            })
          }
        } else if (type === '出库') {
          STATE.ckBoxArr.push({
            baffle: baffle, // 几号堆垛机出来
            EquValue: wsMessage.EquValue // 托盘编号
          })
        }
      } else if (wsMessage.EquName === '单品侧扫' || wsMessage.EquName.includes('多品侧扫')) {
        // 如果堆垛机出库到侧扫之间的临时数组有东西
        if (STATE.ckBoxArr.length) {
          const ckBox = STATE.ckBoxArr.find(e => e.EquValue === wsMessage.EquValue)
          const ckBoxIndex = STATE.ckBoxArr.findIndex(e => e.EquValue === wsMessage.EquValue)
          const baffle = ckBox.baffle
          STATE.ckBoxArr.splice(ckBoxIndex, 1)
          // const baffle = Math.round(Math.random() * 17);
          // const ckType = Math.round(Math.random()) + 2;
          const ckType = (wsMessage.EquName === '单品侧扫') ? 2 : 3

          if (STATE.roadway[baffle].machine.userData.isruniing) return
          STATE.roadway[baffle].machine.userData.isruniing = true

          ddjAnimetion(STATE.roadway[baffle].machine, ckType, () => {
            const mesh = addMesh()
            mesh.userData.lineName = ckType == 2 ? STATE.roadway[baffle].danLineName : STATE.roadway[baffle].duoLineName
            mesh.userData.roadway = baffle
            mesh.userData.index = 0

            // mesh.userData.has = Math.random() > .3;
            mesh.userData.has = true
            mesh.userData.baffle = Math.round(Math.random() * 15)
            mesh.userData.code = ckBox.EquValue
            const fjj = STATE.fjjArr.find(e => e.mapName == wsMessage.Dest)
            if (fjj) {
              mesh.userData.baffle = fjj.baffleName
            } else {
              mesh.userData.baffle = 15
            }

            mesh.userData.pack = Math.round(Math.random() * (ckType == 2 ? 2 : 7))
            mesh.position.set(...STATE.lineObjects[STATE.roadway[baffle].danLineName][0])
            if (ckType == 2) {
              STATE.danBoxArr.push(mesh)
            } else {
              STATE.duoBoxArr.push(mesh)
            }
          }, () => {
            STATE.roadway[baffle].machine.userData.isruniing = false
          })
        }
      } else if (wsMessage.EquName.includes('机器人') && wsMessage.EquValue === '抓取料箱') {
        STATE.thisBoxWSMessage = wsMessage
        STATE.thisBoxWSMessage.random = Math.random()
      }
    }
  }
}

// 提升机动画
function tsjAnimetion (status, callback) {
  let y = 1.19099915
  if (status) y = 0.75
  new Bol3D.TWEEN.Tween(tishengji.position).to({
    y: y
  }, 1000).start().onComplete(() => {
    if (callback) callback()
  })
}

// 挡板动画
function dbAnimetion (model, status, callback) {


  let posY = 0
  if (status) {
    posY = 0.85958
  } else {
    posY = model.position.y - 0.08
  }
  model.userData.status = status
  new Bol3D.TWEEN.Tween(model.position).to({
    y: posY
  }, 600).start().onComplete(() => {
    if (callback) callback()
  })
}

// 挡板动画
function dbAnimetion2 (model, status, callback) {
  // status ? 禁止 : 激活
  let posY = 0
  if (status) {
    posY = 0.85958
  } else {
    posY = model.position.y - 0.08
  }
  model.userData.status = status

  new Bol3D.TWEEN.Tween(model.position).to({
    y: posY
  }, 600).start().onComplete(() => {
    if (callback) callback()
  })
}

// 堆垛机动画 status 1 => 入库，2 => 单品出库， 3 => 多品出库
function ddjAnimetion (model, status, removeOrAdd, callback) {
  if (!model.userData.chengzhua && !model.userData.zhua) {

    model.traverse(child => {
      if (/^zhua/.test(child.name)) {
        if (child.isMesh) model.userData.zhua = child
        else if (child.isObject3D) model.userData.chengzhua = child
      }
      if (/^chengzhua/.test(child.name)) {
        model.userData.chengzhua = child
      }
    })
  }
  const { chengzhua, zhua } = model.userData

  if (zhua.children.length === 0) {
    const box = STATE.sceneModel['tuopan'].clone()
    box.position.set(0.184, -1.96, -0.75)
    box.visible = false
    zhua.add(box)
  }
  let z = -9.8,
    y = -4.55,
    x = -0.68

  if (status != 1) {
    z = -6.6
    y = -4.25
    if (status == 3) {
      z = -7.7
      y = -4.55
    }
    ddjDong(model, -9.4).then(() => {
      return ddjChengZhua(chengzhua, 0)
    }).then(() => {
      return ddjZhua(zhua, -.1)
    }).then(() => {
      // zhua.children[0].visible = true;
      return ddjZhua(zhua, x)
    }).then(() => {
      return ddjDong(model, z)
    }).then(() => {
      return ddjChengZhua(chengzhua, y)
    }).then(() => {
      if (removeOrAdd) removeOrAdd()
      // zhua.children[0].visible = false;
      return ddjZhua(zhua, x - .3)
    }).then(() => {
      return ddjChengZhua(chengzhua, -1)
    }).then(() => {
      if (callback) callback()
    })
    return
  }

  ddjDong(model, z).then(() => {
    return ddjChengZhua(chengzhua, y)
  }).then(() => {
    return ddjZhua(zhua, x)
  }).then(() => {
    if (removeOrAdd) removeOrAdd()
    // zhua.children[0].visible = true;
    return ddjChengZhua(chengzhua, 0)
  }).then(() => {
    return ddjDong(model, -9.4)
  }).then(() => {
    return ddjZhua(zhua, -.1)
  }).then(() => {
    // zhua.children[0].visible = false;
    return ddjZhua(zhua, x - .3)
  }).then(() => {
    return ddjChengZhua(chengzhua, -1)
  }).then(() => {
    if (callback) callback()
  })
}

function ddjDong (model, num) {
  return new Promise((reslove, reject) => [
    new Bol3D.TWEEN.Tween(model.position).to({
      z: num
    }, 800)
      .start().onComplete(() => {
        reslove(null)
      })
  ])
}

function ddjZhua (model, num) {
  // model.position.distanceToSquared(new Bol3D.Vector3(num, model.position.y, model.position.z)) * 500
  return new Promise((reslove) => {
    new Bol3D.TWEEN.Tween(model.position).to({
      x: num
    }, 800)
      .start().onComplete(() => {
        reslove(null)
      })
  })
}

function ddjChengZhua (model, num) {
  return new Promise((reslove) => {
    new Bol3D.TWEEN.Tween(model.position).to({
      y: num
    }, 800)
      .start().onComplete(() => {
        reslove(null)
      })
  })
}

// 翻转板动画
function sxbAnimetion () {
  let rotation = 0
  if (STATE.flapGate.userData.state) {
    rotation = .42
  }
  STATE.flapGate.userData.state = !STATE.flapGate.userData.state
  STATE.slow = true
  new Bol3D.TWEEN.Tween(STATE.flapGate.rotation).to({
    y: rotation
  }, 500).start().onComplete(() => {
    STATE.slow = false
  })
}

function sceneMove (target, camera, callback) {
  let time1 = container.orbitControls.target.distanceToSquared(new Bol3D.Vector3(...target)) * 40
  let time2 = container.orbitControls.target.distanceToSquared(new Bol3D.Vector3(...target)) * 40
  time1 = time1 > 2000 ? 2000 : time1 < 1000 ? 1000 : time1
  time2 = time2 > 2000 ? 2000 : time2 < 1000 ? 1000 : time2;;
  new Bol3D.TWEEN.Tween(container.orbitControls.target).to({
    x: target[0],
    y: target[1],
    z: target[2]
  }, time1).start()

  new Bol3D.TWEEN.Tween(container.orbitCamera.position).to({
    x: camera[0],
    y: camera[1],
    z: camera[2]
  }, time2).start().onComplete(() => {
    if (callback) callback()
  })
}


// 添加产品
function addMesh (code, barCode) {
  const box = STATE.sceneModel.tuopan.clone()
  box.userData.code = code ? code : 0
  box.userData.barCode = barCode ? barCode : 0
  container.attach(box)
  return box
}


// 单品出库动画 
/**
 * userData[lineName] 当前线路
 * userData[index] 当前线路索引
 * userData[barCode] 产品条码
 * userData[code] 托盘编码
 * userData[roadway] 巷道
 * userData[pack] 打包口
 * userData[has] 是否有产品（用于回收线）
 */
function danCkBoxMove () {

  for (let i = 0; i < STATE.danBoxArr.length; i++) {
    let { userData } = STATE.danBoxArr[i]
    if (!userData.lineName) continue
    if (userData.lineName == 'A1' || userData.lineName == 'A2') {
      userData.index--

      if (userData.index < 0) {
        container.remove(STATE.danBoxArr[i])
        STATE.danBoxArr.splice(i, 1)
        i--
        continue
      }
    }
    else {
      userData.index++
    }

    STATE.danBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
    STATE.danBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])

    if (userData.lineName.includes('F') && userData.index >= STATE.lineObjects[userData.lineName].length - 2) {
      userData.lineName = 'C1'
      userData.index = STATE.roadway[userData.roadway].danIndex
    } else if (userData.lineName == 'C1') {
      if (userData.index == STATE.scan['cesaoji005'].userData.index) {
        STATE.scan['cesaoji005'].userData.setScan(true)({ '编码': userData.code })
      } else if (userData.index >= STATE.danPack[userData.pack].index) {
        userData.lineName = 'A1'
        userData.index = STATE.danPack[userData.pack].index2
      }
    } else if (userData.lineName == 'A1' || userData.lineName == 'A2') {
      tpRecycle(userData, STATE.danBoxArr, i)
    }
  }
}

// 空托盘回收
function tpRecycle (userData, arr, i) {
  if (userData.lineName == 'A1') {
    if (userData.index == 638) {
      if (userData.has) { if (STATE.flapGate.userData.state) sxbAnimetion() }
      else { if (!STATE.flapGate.userData.state) sxbAnimetion() }
    } else if (userData.index == 614 && !userData.has) {
      userData.lineName = ''
      userData.index = STATE.lineObjects.A2.length - 2
      arr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects['A2'][userData.index]))
      new Bol3D.TWEEN.Tween(arr[i].position).to({
        x: STATE.lineObjects['A2'][userData.index][0],
        y: STATE.lineObjects['A2'][userData.index][1],
        z: STATE.lineObjects['A2'][userData.index][2],
      }, 1000).start().onComplete(() => {
        userData.lineName = 'A2'
      })
    } else if (userData.index == STATE.scan["shijuesaomaoji"].userData.index) {
      if (userData.barCode) STATE.scan["shijuesaomaoji"].userData.setScan(true)({
        '产品条码': userData.barCode
      })
    } else if (userData.index == 250) {
      userData.index--

      // 往左走的
      // userData.lineName = '';
      // if (userData.barCode) new Bol3D.TWEEN.Tween(arr[i].position).to({
      //     x: -4.371861834715999,
      //     z: -5.348889236666201
      // }, 2000).start().onComplete(() => {
      //     container.remove(arr[i])
      //     arr.splice(i, 1);
      //     i--
      // })
    } else if (userData.index <= 0) {
      container.remove(arr[i])
      arr.splice(i, 1)
      i--
    }
  } else if (userData.lineName == 'A2' && userData.index == 0) {
    userData.lineName = 'A1'
    userData.index = 127
  }
}

// 多品出库动画
/**
* userData[lineName] 当前线路
* userData[index] 当前线路索引
* userData[barCode] 产品条码
* userData[code] 托盘编码
* userData[baffle] 分拣机
* userData[roadway] 巷道
* userData[pack] 打包口
*/
function duoCkBoxMove () {
  for (let i = 0; i < STATE.duoBoxArr.length; i++) {
    let { userData } = STATE.duoBoxArr[i]
    if (!userData.lineName) continue
    if (userData.lineName == 'C2' || userData.lineName == 'A1' || userData.lineName == 'A2') {
      userData.index--
      if (userData.index < 0) {
        container.remove(STATE.duoBoxArr[i])
        STATE.duoBoxArr.splice(i, 1)
        i--
        continue
      }
    } else userData.index++
    const machine = STATE.duoRoadway[userData?.baffle ?? 0]
    try {
      STATE.duoBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
      STATE.duoBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])
    } catch (err) {

      // debugger
    }

    // 简易监听程序，判断是不是同一个箱子
    if (STATE.thisBoxWSMessage?.random != STATE.tempThisBoxWSMessage?.random) {
      if (!STATE.thisBoxWSMessage?.random) return
      else {
        STATE.tempThisBoxWSMessage = JSON.parse(JSON.stringify(STATE.thisBoxWSMessage))
        // const animation = jxsbObject['jxsb' + Math.ceil((userData.baffle + 1) / 2)].model.userData[dir ? 'Animation1' : 'Animation'];
        // animation._mixer.removeEventListener('finished', finished);
        let baffle = 0
        if (STATE.thisBoxWSMessage.EquValue2 == 3) {
          baffle = 16 - Number(STATE.thisBoxWSMessage.EquName.replace(/[^0-9]/ig, "") * 2)
        } else if (STATE.thisBoxWSMessage.EquValue2 == 4) {
          baffle = 17 - Number(STATE.thisBoxWSMessage.EquName.replace(/[^0-9]/ig, "") * 2)
        }
        // userData.lineName = machine.lineName;
        const index = STATE.loopRoadway[baffle].index
        let tuopan = STATE.loopRoadway[baffle].tuopan

        if (!tuopan) {
          tuopan = baffle < 2 ? STATE.sceneModel['dapmtuopan'].clone() : STATE.sceneModel['pmtuopan'].clone()
          STATE.loopRoadway[baffle].tuopan = tuopan
          container.attach(tuopan)
        }
        if (!tuopan.userData.boxArr) tuopan.userData.boxArr = []
        tuopan.position.set(...STATE.loopRoadway[baffle].position)
        for (let i = 0; i < 8; i++) {
          tuopan.userData.boxArr.push(Math.random())
          if (tuopan.userData.boxArr.length === (baffle < 2) ? 2 : 8) break
        }


        STATE.loopRoadway[baffle].tuopan = null
        STATE.loopRoadway[baffle].boxArr = []
        new Bol3D.TWEEN.Tween(tuopan.position).to({
          x: STATE.lineObjects['D1'][index][0],
          y: STATE.lineObjects['D1'][index][1],
          z: STATE.lineObjects['D1'][index][2]
        }, 800).start().onComplete(() => {
          tuopan.userData.type = baffle < 2 ? 1 : 2
          tuopan.userData.lineName = 'D1'
          tuopan.userData.index = index
          STATE.loopBoxArr.push(tuopan)
        })
      }
    }

    // 出库
    if (userData.lineName.includes('F') && userData.index >= STATE.lineObjects[userData.lineName].length - 2) {
      userData.lineName = 'C3'
      userData.index = STATE.roadway[userData.roadway].duoIndex
    } else if (userData.lineName == 'C3') {// 经过扫码器并移动到C2线
      let duoScan
      let index2
      if (userData.baffle < 6) {
        duoScan = STATE.scan['cesaoji002']
        index2 = 596
      } else if (userData.baffle < 12) {
        duoScan = STATE.scan['cesaoji003']
        index2 = 927
      } else {
        duoScan = STATE.scan['cesaoji004']
        index2 = 1263
      }
      // 扫码器弹窗
      if (userData.index == duoScan.userData.index) {
        duoScan.userData.setScan(true)({ '托盘码': userData.code })
      } else
        // 移动到C2线
        if (userData.index >= duoScan.userData.index + 30) {
          userData.lineName = ''
          new Bol3D.TWEEN.Tween(STATE.duoBoxArr[i].position)
            .to({
              x: STATE.lineObjects['C2'][index2][0],
              y: STATE.lineObjects['C2'][index2][1],
              z: STATE.lineObjects['C2'][index2][2]
            }, 500).start().onComplete(() => {
              userData.index = index2
              userData.lineName = 'C2'
            })
        }
    } else if (userData.lineName == 'C2') { // 移动到机器人站台，打开挡板
      if (userData.index == machine.index + 20) {

        if (machine.baffle?.userData.status) dbAnimetion2(machine.baffle, false)
      } else if (userData.index == machine.index) {
        userData.lineName = machine.lineName
        userData.index = 0
      }
    } else if (userData.lineName.includes('G')) {// 进入机器人站台，机器人动画后进入A1线
      if (userData.index == 10) {
        if (!machine.baffle?.userData.status) dbAnimetion2(machine.baffle, true)
      } else if (userData.index == STATE.lineObjects[userData.lineName].length - 10) {
        userData.lineName = ''
        const dir = (userData.baffle + 1) % 2

        const animation = STATE.jxsbObject['jxsb' + Math.ceil((userData.baffle + 1) / 2)].model.userData[dir ? 'Animation1' : 'Animation']

        // 装满箱子
        const finished = function () {
          animation._mixer.removeEventListener('finished', finished)
          userData.lineName = machine.lineName
          const index = STATE.loopRoadway[userData.baffle].index
          let tuopan = STATE.loopRoadway[userData.baffle].tuopan
          if (!tuopan) {
            tuopan = userData.baffle < 2 ? STATE.sceneModel['dapmtuopan'].clone() : STATE.sceneModel['pmtuopan'].clone()
            STATE.loopRoadway[userData.baffle].tuopan = tuopan
            container.attach(tuopan)
          }
          if (!tuopan.userData.boxArr) tuopan.userData.boxArr = []
          tuopan.position.set(...STATE.loopRoadway[userData.baffle].position)
          tuopan.userData.boxArr.push(userData.barCode)



          if ((userData.baffle < 2 && tuopan.userData.boxArr.length == 2) || tuopan.userData.boxArr.length == 8) {
            STATE.loopRoadway[userData.baffle].tuopan = null
            STATE.loopRoadway[userData.baffle].boxArr = []
            new Bol3D.TWEEN.Tween(tuopan.position).to({
              x: STATE.lineObjects['D1'][index][0],
              y: STATE.lineObjects['D1'][index][1],
              z: STATE.lineObjects['D1'][index][2]
            }, 800).start().onComplete(() => {
              tuopan.userData.type = userData.baffle < 2 ? 1 : 2
              tuopan.userData.lineName = 'D1'
              tuopan.userData.index = index
              loopBoxArr.push(tuopan)
            })

          }
          animation.stop()
        }
        animation._mixer.addEventListener('finished', finished)
        animation.play()
      } else if (userData.index == STATE.lineObjects[userData.lineName].length - 2) {
        userData.lineName = 'A1'
        userData.index = machine.index2
      }
    }
    if (userData.lineName == 'A1' || userData.lineName == 'A2') {
      tpRecycle(userData, STATE.duoBoxArr, i)
    }

    if (userData.index == 0 && userData.lineName == 'C2') {
      container.remove(STATE.duoBoxArr[i])
      STATE.duoBoxArr.splice(i, 1)
      i--
    }
  }
}

// 入库箱子移动动画
/**
* userData[lineName] 当前线路
* userData[index] 当前线路索引
* userData[barCode] 产品条码
* userData[code] 托盘编码
* userData[roadway] 入库巷道
*/

function rkBoxMove () {
  for (let i = 0; i < STATE.rkBoxArr.length; i++) {

    const { userData } = STATE.rkBoxArr[i]
    const machine = STATE.roadway[userData.roadway]

    if (userData.lineName && machine) {
      userData.index++
      STATE.rkBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
      STATE.rkBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])


      if (userData.lineName == 'B1') {
        if (userData.index == STATE.scan['dingsaoji_1'].userData.index) {
          STATE.scan['dingsaoji_1'].userData.setScan(true)({ '产品条码': userData.code, '托盘码': userData.barCode })
        } else if (machine.baffleStatus && machine.machineStatus) {
          // 控制挡板是否拦截


          if (userData.index == machine.index - 20) {

            if (machine.baffle?.userData.status) dbAnimetion(machine.baffle, false)
          } else if (userData.index == machine.index) {
            userData.lineName = machine.lineName
            userData.index = 0
            machine.boxArr.push(STATE.rkBoxArr[i])
            if (machine.boxArr.length >= 10) {
              STATE.rkPasue = true
              setTimeout(() => {
                container.remove(machine.boxArr[0])
                machine.boxArr.shift()
              }, 1000)
            }
          }
        } else if (userData.index == STATE.lineObjects[userData.lineName].length - 1) {
          // 移动到B1尽头
          userData.lineName = ''
        }
      } else {
        const j = machine.boxArr.findIndex(item => item == STATE.rkBoxArr[i]) + 1
        userData.endIndex = STATE.lineObjects[userData.lineName].length - 1 - 10 * j
        if (userData.lineName == 'F456') {
          userData.endIndex = STATE.lineObjects[userData.lineName].length - 1
        }
        if (userData.index == 20 && STATE.rkBoxArr[i + 1]?.userData?.roadway != userData.roadway) {
          if (!machine.baffle?.userData.status) dbAnimetion(machine.baffle, true)
        } else if (userData.index == userData.endIndex - 1) {
          if (userData.lineName == 'F456') {
            container.remove(STATE.rkBoxArr[i])
            STATE.rkBoxArr.splice(i, 1)
            i--
          } else {
            userData.index--
          }
        }
      }
    } else if (machine) {
      machine.boxArr.push(STATE.rkBoxArr[i])
      new Bol3D.TWEEN.Tween(STATE.rkBoxArr[i].position).to({
        z: -14 + .2 * (machine.boxArr.length - 1)
      }, 2000).start()
      STATE.rkBoxArr.splice(i, 1)
      i--
      if (machine.boxArr.length >= 10) STATE.rkPasue = false
    }
  }
}

// 环线
/**
* userData[lineName] 当前线路
* userData[index] 当前线路索引
* userData[boxArr] 产品数组
* userData[code] 托盘编码
* userData[pack] 打包台
* userData[type] 托盘类型1 => ipad，2 => 手机
*/
function loopBoxMove () {
  for (let i = 0; i < STATE.loopBoxArr.length; i++) {
    let { userData } = STATE.loopBoxArr[i]
    if (!userData.lineName) continue
    if (userData.lineName == 'D1' || userData.lineName == 'D3' || userData.lineName == 'E1') userData.index--
    else userData.index++
    STATE.loopBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
    STATE.loopBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])
    if (userData.lineName == 'D1') {
      if (!userData?.boxArr?.length) {
        const baffle = STATE.loopRoadway.find(r => r.index == userData.index && !r.tuopan)
        if (baffle) {
          userData.lineName = ''
          userData.boxArr = []
          STATE.loopBoxArr.splice(i, 1)
          i--
          new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
            x: baffle.position[0],
            y: baffle.position[1],
            z: baffle.position[2],
          }, 800).start()
        }
      } else
        if (userData.index == 50) {
          userData.lineName = ''
          new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
            x: STATE.lineObjects['D4'][21][0],
            y: STATE.lineObjects['D4'][21][1],
            z: STATE.lineObjects['D4'][21][2],
          }, 2000).start().onComplete(() => {
            userData.lineName = 'D4'
            userData.index = 21
          })
        }
    } else if (userData.lineName == 'D4') {
      if (typeof userData.pack != 'number') userData.pack = Math.round(Math.random() * 7)
      if (userData.index == STATE.duoPack[userData.pack].index) {
        userData.lineName = 'D3'
        userData.index = STATE.duoPack[userData.pack].index2
        userData.pack = null
        userData.boxArr = null
      }
    } else if (userData.lineName == 'D3' && userData.index == 0) {
      userData.lineName = 'E1'
      userData.index = STATE.lineObjects['E1'].length - 2
    } else if (userData.lineName == 'E1') {
      if (userData.index == 69 && userData.type == 2) {
        userData.lineName = 'D2'
        userData.index = 0
      } else if (userData.index == 15) {
        userData.lineName = ''
        new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
          x: 6.55921422283932
        }, 3000).start().onComplete(() => {

        })
        STATE.loopBoxArr.splice(i, 1)
        i--
      }
    } else if (userData.lineName == 'D2' && userData.index == STATE.lineObjects['D2'].length - 3) {
      STATE.lineObjects['D2'].visible = false
      userData.lineName = ''
      tsjAnimetion(true, () => {
        STATE.lineObjects['D2'].visible = true
        userData.lineName = 'D1'
        userData.index = userData.index == STATE.lineObjects['D1'].length - 2
        tsjAnimetion(false)
      })
    }
  }
}

// 计算支线的起点在主线的索引
function countLineIndex (main, branch) {
  const mainArr = STATE.lineObjects[main]
  let branchArr = branch
  if (typeof branch == 'string') {
    branchArr = STATE.lineObjects[branch][STATE.lineObjects[branch].length - 2]
  }

  return mainArr.findIndex((arr, index) => {
    if (index < mainArr.length - 1) {
      if (main == 'A1' && branch == 'A2') {
        const z = [arr[2], branchArr[2], mainArr[index + 1][2]].sort((a, b) => a - b)
        return z[1] == branchArr[2]
      } else {
        const x = [arr[0], branchArr[0], mainArr[index + 1][0]].sort((a, b) => a - b)
        return x[1] == branchArr[0]
      }
    }
    return false
  })
}

export function cameraMove (name) {
  const model = container.scene.children.find(e => e.name === name)

  if (model) {
    const camera = container.orbitCamera
    const controls = container.orbitControls

    new Bol3D.TWEEN.Tween(camera.position).to({
      x: model.position.x,
      y: model.position.y + 5,
      z: model.position.z + 3
    }, 1000).start()
    new Bol3D.TWEEN.Tween(controls.target).to({
      x: model.position.x,
      y: model.position.y,
      z: model.position.z - 1
    }, 1000).start()

    const firstChild = model.children.find(e => e.type === 'Mesh')

    firstChild.userData.setScan(true)({
      '机器人状态': '异常',
      '异常原因': '过热'
    })

    // model.userData.isRed = false

    // abnormalTimer = setInterval(() => {
    //     if(model.userData.isRed) {
    //         model.traverse((child: any) => {
    //             if (child.isMesh) {
    //                 new Bol3D.TWEEN.Tween(child.material.color).to({
    //                     r: child.userData.color.r
    //                 }, 300).start()
    //             }
    //         })
    //         model.userData.isRed = false
    //     } else {
    //         model.traverse((child: any) => {
    //             if (child.isMesh) {
    //                 child.userData.color = child.material.color.clone()
    //                 new Bol3D.TWEEN.Tween(child.material.color).to({
    //                     r: 1
    //                 }, 300).start()
    //             }
    //         })
    //         model.userData.isRed = true
    //     }
    // }, 300)

  }
}

export function showModel (index) {
  if (index == 0) {
    sceneMove([5.0222726502322566, -6, -9.9383768281469], [-15.150251499050743, 14.528244032161933, -28.328587278060894])
  } else if (index == -1) {
    sceneMove([10.2, -6, -17.5], [-14.5, 16, 4.7])
  } else if (index == 3) {
    // sceneMove([23.46902174032292, -6, -8.039477544326], [4.542086648333012, 4.108964264274309, -0.7590202748713448])
    sceneMove([24.544415940932108, -6, -6.3146214586813345], [4.746691096324145, 3.3125594806498864, -0.4195883441280319])
  } else {
    sceneMove([18.36771200230325, -6, -8.041836196863256], [17.80061058303368, 29.520704264582747, 18.155333389155047])
  }
  for (const key in STATE.sceneModel) {
    if (key == 'dipi') continue
    switch (true) {
      case index == 0 && key == 'rukuxian':
      case index == 1 && key == "jshepda":
      case index == 2 && (key == "huanxian" || key == 'rukuxian'):
      case index == 3 && key.includes('jxsb'):
      case index == 4 && key == "huanxian":
      case index == -1:
        STATE.sceneModel[key].traverse(child => {
          switch (true) {
            case index == 0 && (child.name.includes('yidongshangxiaban') || child.name.includes('shijuesaomaoji') || child.name.includes('cesaoji_')):
            case index == 4 && child.parent.name !== "xuyingchang" && child.name !== "对象158" && child.name !== "tishengji":
            case index == 2 && key === 'rukuxian' && !child.name.includes('yidongshangxiaban'):
              if (child.isMesh) {
                child.material.transparent = true
                child.material.opacity = 0.1
              }
              break
            default:
              if (child.isMesh) {
                child.material.transparent = false
                child.material.opacity = 1
              }
              break
          }
        })
        break
      default:
        STATE.sceneModel[key].traverse(child => {
          if (child.isMesh) {
            child.material.transparent = true
            child.material.opacity = 0.1
          }
        })
    }
  }
}

function initEvent () {
  const event = new Bol3D.Events(container)
  event.onclick = function (e) {
    const { object, point } = e?.objects?.[0] ?? {}
    if (object) {
      if (object.userData.type === 'huojia') {
        object.userData.setScan(true)({
          '占用': '20%',
          '未占用': '80%'
        })
      } else if (object.userData.type === 'duiduoji') {
        object.userData.setScan(true)({
          '堆垛机状态': '正常'
        })
      } else if (object.userData.type === 'tishengji') {
        object.userData.setScan(true)({
          '提升机状态': '正常'
        })
      } else if (object.userData.type === 'jiqiren') {
        object.userData.setScan(true)({
          '机器人状态': '正常'
        })
      }
    }
  }
}

function addReflector () {
  // const geometry = new Bol3D.PlaneGeometry(600, 600)
  const geometry = new Bol3D.PlaneGeometry(59.383, 31.197)
  const options = {
    clipBias: 0.01,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x999999
  }
  const mirro = new Bol3D.Reflector(geometry, options)
  mirro.rotation.x = -Math.PI / 2
  mirro.position.set(13.8, -0.1, -3.7)
  // mirro.position.set(20, -2, -25)
  container.attach(mirro)

}


function render () {
  requestAnimationFrame(render)
  const t = STATE.clock.getDelta()
  STATE.times = STATE.times + t
  if (STATE.times > STATE.renderT) {
    // 控制帧率低于20
    if (STATE.rkPasue) {
      let status = false
      for (let index = 0; index < STATE.roadway.length; index++) {
        if (!status) status = STATE.roadway[index].boxArr.length >= 10
      }
      STATE.rkPasue = status
    } else rkBoxMove()
    danCkBoxMove()
    duoCkBoxMove()
    loopBoxMove()
    STATE.times = 0
  }
}


export const API = {
  cameraAnimation,
  loadGUI,
  rkScan,
  instance,
  addMesh,
  sceneMove,
  sxbAnimetion,
  getData,
  tsjAnimetion,
  dbAnimetion,
  dbAnimetion2,
  ddjAnimetion,
  ddjDong,
  ddjZhua,
  ddjChengZhua,
  initEvent,
  addReflector,
  render
}
