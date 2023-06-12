import { STATE } from './STATE.js'
import { CACHE } from './CACHE.js'
import { Reflector } from '../asset/Reflector'
import mockData from '@/3d/asset/mock.json'

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
function instance (model, name) {
  if (!CACHE.instanceTransformInfo[name]) CACHE.instanceTransformInfo[name] = []
  let position = new Bol3D.Vector3()
  let scale = new Bol3D.Vector3()
  let quaternion = new Bol3D.Quaternion()
  model.getWorldPosition(position)
  model.getWorldScale(scale)
  model.getWorldQuaternion(quaternion)
  CACHE.instanceTransformInfo[name].push({
    position,
    quaternion,
    scale
  })
  if (!CACHE.instanceMeshInfo[name]) {
    CACHE.instanceMeshInfo[name] = {
      material: model.material.clone(),
      geometry: model.geometry.clone()
    }
  }

  clearClick(model)
}

// 静态合批(网格合并)
function mergedMesh (model, name) {
  model.updateWorldMatrix(true, false)

  if (!CACHE.mergeMeshInfo[name]) CACHE.mergeMeshInfo[name] = []

  const matrixWorldGeometry = model.geometry.clone().applyMatrix4(model.matrixWorld)
  CACHE.mergeMeshInfo[name].push(matrixWorldGeometry)
  if (!CACHE.mergeMeshMaterialInfo[name]) {
    CACHE.mergeMeshMaterialInfo[name] = model.material.clone()
  }

  clearClick(model)
}

// 清除点击 删除模型
function clearClick (model) {
  let flag = -1
  for (let i = 0; i < CACHE.container.clickObjects.length; i++) {
    if (CACHE.container.clickObjects[i].uuid == model.uuid) {
      flag = i
      break
    }
  }
  if (flag != -1) CACHE.container.clickObjects.splice(flag, 1)
  if (!CACHE.removed[model.name]) CACHE.removed[model.name] = model
  model.geometry.dispose()
  if (model.material.map) {
    model.material.map.dispose()
    model.material.map = null
  }
  model.material.dispose()
  model = null
}


// 获取数据
function getData () {
  // websocket 推三维数据
  let wsMessage = null

  // ====================线上真实的=====================
  const ws = new WebSocket(
    // `ws://127.0.0.1:8001/`
    `ws://192.168.8.170:5443/null`
  )
  ws.onmessage = function (e) {
    wsMessage = JSON.parse(e.data)
    driver(wsMessage)
  }
  // ===================================================


  // ===================线下模拟的=======================
  // let mockIndex = 0
  // setInterval(() => {
  //   driver(mockData[mockIndex])
  //   
  //   mockIndex++
  //   if (mockIndex === mockData.length - 1) mockIndex = 0
  // }, 100)
  // ===================================================

  function driver (wsMessage) {


    // 有些没名字
    if (wsMessage.EquName) {

      if (wsMessage.EquName === '入库扫描') {
        const box = addMesh(wsMessage.EquValue2, wsMessage.EquValue)
        const baffle = wsMessage.Dest
        box.userData.roadway = baffle
        box.userData.lineName = 'B1'
        box.userData.index = 0
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
          if (wsMessage.EquName.includes('单品')) {
            STATE.danCkBoxArr.push({
              baffle: baffle, // 几号堆垛机出来
              EquValue: wsMessage.EquValue // 托盘编号
            })
          } else { // 多品出库
            ddjAnimetion(STATE.roadway[baffle].machine, 3, () => {
              const mesh = addMesh()
              mesh.userData.lineName = STATE.roadway[baffle].duoLineName
              mesh.userData.index = 0
              mesh.userData.has = false
              mesh.userData.catch = false // 是否收到机器人指令
              mesh.userData.roadway = baffle // 巷道，从哪个巷道出来
              mesh.userData.baffle = -1 // 机器人站台，暂时不知道
              mesh.userData.code = wsMessage.EquValue // 托盘编码
              mesh.userData.pack = -1 // 打包口，暂时也不知道
              mesh.position.set(...STATE.lineObjects[STATE.roadway[baffle].danLineName][0])
              STATE.duoBoxArr.push(mesh)
            }, () => {
              STATE.roadway[baffle].machine.userData.isruniing = false
            })
          }
        }
      } else if (wsMessage.EquName === '单品侧扫') {
        // 如果堆垛机出库到侧扫之间的临时数组有东西
        if (STATE.danCkBoxArr.length) {
          const ckBox = STATE.danCkBoxArr.find(e => e.EquValue === wsMessage.EquValue)
          const ckBoxIndex = STATE.danCkBoxArr.findIndex(e => e.EquValue === wsMessage.EquValue)
          if (ckBox) {
            const baffle = ckBox.baffle
            STATE.danCkBoxArr.splice(ckBoxIndex, 1)
            const pack = STATE.danPack.findIndex(e => e.destName == Number(wsMessage.Dest))
            let packIndex = 0
            if (pack != -1) packIndex = pack


            if (STATE.roadway[baffle].machine.userData.isruniing) return
            STATE.roadway[baffle].machine.userData.isruniing = true

            ddjAnimetion(STATE.roadway[baffle].machine, 2, () => {
              const mesh = addMesh()
              mesh.userData.lineName = STATE.roadway[baffle].danLineName
              mesh.userData.roadway = baffle // 从哪儿出来的
              mesh.userData.index = 0
              mesh.userData.has = false
              mesh.userData.code = ckBox.EquValue // 托盘编号
              mesh.userData.pack = packIndex // 打包口
              mesh.position.set(...STATE.lineObjects[STATE.roadway[baffle].danLineName][0])
              STATE.danBoxArr.push(mesh)
            }, () => {
              STATE.roadway[baffle].machine.userData.isruniing = false
            })
          }
        }
      } else if (wsMessage.EquName.includes('多品侧扫')) {
        // 甲方那边的数据不完整，这里不需要了，直接读取机器人的数据
        // const baseDest = 2201
        // const wsDest = Number(wsMessage.Dest)
        // const baffle = wsDest - baseDest // 本地的进入机器人抓取的巷道
        // const duoBox = STATE.duoBoxArr.find(e => e.userData.code == wsMessage.EquValue)
        // if (duoBox) duoBox.userData.baffle = baffle
      } else if (wsMessage.EquName.includes('机器人')) {
        if (wsMessage.EquValue.includes('抓取物品')) {
          const code = wsMessage.EquValue.replace('抓取物品', '') // 托盘编码
          const machineCode = Number(wsMessage.EquName.match(/(?<=R).*(?=机器人)/)[0]) // 机器人编号
          const direction = Number(wsMessage.EquValue2)
          const baffle = [8, 7, 6, 5, 4, 3, 2, 1].findIndex(e => e === machineCode) * 2 + direction - 1
          const mesh = STATE.duoBoxArr.find(e => e.userData.code == code)
          if (mesh) {
            mesh.userData.catch = true
            mesh.userData.baffle = baffle
          }
        } else if (wsMessage.EquValue === '抓取料箱') { // 还没做
          STATE.thisBoxWSMessage = wsMessage
          STATE.thisBoxWSMessage.random = Math.random()
        }
      } else if (wsMessage.EquName.includes('空箱线最终站台')) {
        const dest = wsMessage.EquValue2 // 目标打包台
        const baffle = wsMessage.EquName.replace('空箱线最终站台', '').replace('料箱送走', '') // 从哪个机器人巷道出来

        lxBoxMove({ dest: Number(dest), baffle: Number(baffle) })
      } else if (wsMessage.EquName === '空箱线手机检测有无') {

      } else if (wsMessage.EquName === '料箱分类站台') {
        if (STATE.D3RunArr.length) {
          if (!STATE.D3RunArr[0].visible) {
            STATE.D3RunArr[0].parent.remove(STATE.D3RunArr[0])
            STATE.D3RunArr.splice(0, 1)
          }
          for (let i = 0; i < STATE.D3RunArr.length; i++) {
            if (STATE.D3RunArr[i].visible && !STATE.D3RunArr[i].userData.type) {
              if (wsMessage.Dest === '手机料箱') STATE.D3RunArr[i].userData.type = 'phone'
              else STATE.D3RunArr[i].userData.type = 'ipad'
              STATE.D3RunArr[i].userData.back = true
              break
            }
          }
        }
      }
    }
  }
}

// 提升机动画
function tsjAnimetion (status, callback) {
  let y = 1.19099915
  if (status) y = 0.75
  new Bol3D.TWEEN.Tween(STATE.tishengji.position).to({
    y: y
  }, 1000).start().onComplete(() => {
    if (callback) callback()
  })
}

// 挡板动画
function dbAnimetion (model, status, callback) {


  let posY = 0
  if (status) {
    posY = -0.3
  } else {
    posY = -0.35
  }
  if (model) {
    model.userData.status = status
    new Bol3D.TWEEN.Tween(model.position).to({
      y: posY
    }, 600).start().onComplete(() => {
      if (callback) callback()
    })
  }
}

// 挡板动画
function dbAnimetion2 (model, status, callback) {

  // status ? 禁止 : 激活
  let posY = 0
  if (status) {
    posY = -0.3
  } else {
    posY = -0.35
  }

  if (model) {
    model.userData.status = status

    new Bol3D.TWEEN.Tween(model.position).to({
      y: posY
    }, 600).start().onComplete(() => {
      if (callback) callback()
    })
  }
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

  if (zhua.children.length === 1) {
    const box = STATE.sceneModel['tuopan'].clone()
    box.position.set(0.184, -1.96, -0.75)
    box.visible = false
    zhua.add(box)
  }
  let z = -10.2,
    y = -4.325,
    x = -0.68

  if (status != 1) {
    z = -6.6
    y = -4.25
    if (status == 3) {
      z = -7.7
      y = -4.55
    }
    // after
    ddjDong(model, -9.7).then(() => {
      return ddjChengZhua([chengzhua, zhua], 0)
    }).then(() => {
      return ddjZhua(zhua, -.1)
    }).then(() => {
      zhua.children[1].visible = true
      return ddjZhua(zhua, x)
    }).then(() => {
      return ddjDong(model, z)
    }).then(() => {
      return ddjChengZhua([chengzhua, zhua], y)
    }).then(() => {
      if (removeOrAdd) removeOrAdd()
      zhua.children[1].visible = false
      return ddjZhua(zhua, x - .3)
    }).then(() => {
      return ddjChengZhua([chengzhua, zhua], -1)
    }).then(() => {
      if (callback) callback()
    })
    return
  }

  // before
  ddjDong(model, z).then(() => {
    return ddjChengZhua([chengzhua, zhua], y)
  }).then(() => {
    return ddjZhua(zhua, x)
  }).then(() => {
    if (removeOrAdd) removeOrAdd()
    zhua.children[1].visible = true
    return ddjChengZhua([chengzhua, zhua], 0)
  }).then(() => {
    return ddjDong(model, -9.4)
  }).then(() => {
    return ddjZhua(zhua, -.1)
  }).then(() => {
    zhua.children[1].visible = false
    return ddjZhua(zhua, x - .3)
  }).then(() => {
    return ddjChengZhua([chengzhua, zhua], -1)
  }).then(() => {
    if (callback) callback()
  })
}

function ddjDong (model, num) {
  if (model) {
    return new Promise((reslove, reject) => [
      new Bol3D.TWEEN.Tween(model.position).to({
        z: num
      }, 800)
        .start().onComplete(() => {
          reslove(null)
        })
    ])
  }
}

function ddjZhua (model, num) {
  if (model) {
    model.position.distanceToSquared(new Bol3D.Vector3(num, model.position.y, model.position.z)) * 500
    return new Promise((reslove) => {
      new Bol3D.TWEEN.Tween(model.position).to({
        x: num
      }, 800)
        .start().onComplete(() => {
          reslove(null)
        })
    })
  }
}

function ddjChengZhua (model, num) {
  if (model) {
    return new Promise((reslove) => {
      model.forEach(e => {
        new Bol3D.TWEEN.Tween(e.position).to({
          y: num
        }, 800)
          .start().onComplete(() => {
            reslove(null)
          })
      })
    })
  }
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
    window.aaa = userData.index
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
      if (arr[i]) {
        arr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects['A2'][userData.index]))
        new Bol3D.TWEEN.Tween(arr[i].position).to({
          x: STATE.lineObjects['A2'][userData.index][0],
          y: STATE.lineObjects['A2'][userData.index][1],
          z: STATE.lineObjects['A2'][userData.index][2],
        }, 1000).start().onComplete(() => {
          userData.lineName = 'A2'
        })
      }
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
      //     // i--
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
* userData[catch] 是否收到机器人抓取指令
*/
function duoCkBoxMove () {
  for (let i = 0; i < STATE.duoBoxArr.length; i++) {
    let { userData } = STATE.duoBoxArr[i]

    if (!userData.lineName) continue
    if (userData.lineName == 'C2' || userData.lineName == 'A1' || userData.lineName == 'A2') {
      userData.index--
      if (userData.index < 0) {
        // container.remove(STATE.duoBoxArr[i])
        // STATE.duoBoxArr.splice(i, 1)
        // i--


        continue
      }
    } else userData.index++

    let machine = null
    if (userData.baffle != -1) {
      machine = STATE.duoRoadway[userData.baffle]
    }
    try {
      STATE.duoBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
      STATE.duoBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])
    } catch (err) {

    }


    // 出库
    if (userData.lineName.includes('F') && userData.index >= STATE.lineObjects[userData.lineName].length - 2) {
      userData.lineName = 'C3'
      userData.isFirstLoop = true
      userData.index = STATE.roadway[userData.roadway].duoIndex
    } else if (userData.lineName == 'C3') {// 经过扫码器并移动到C2线
      let duoScan
      let index2
      if (userData.isFirstLoop && userData.roadway <= 7) {
        duoScan = STATE.scan['cesaoji002']
        index2 = 596
      } else if (userData.isFirstLoop && userData.roadway <= 12) {
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
          if (STATE.duoBoxArr[i]) {
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
        }
    } else if (userData.lineName == 'C2') { // 移动到机器人站台，打开挡板
      if (!userData.catch || userData.index < machine?.index) {
        if (userData.index < 6) {

          if (STATE.duoBoxArr[i] && STATE.lianjie) {

            // 循环回去，移动到c3
            userData.lineName = ''
            userData.isFirstLoop = false

            // 动画嵌套
            if (STATE.duoBoxArr[i]) {
              new Bol3D.TWEEN.Tween(STATE.duoBoxArr[i].position)
                .to({
                  y: STATE.duoBoxArr[i].position.y + 0.02
                }, 500).start()

              new Bol3D.TWEEN.Tween(STATE.lianjie.position)
                .to({
                  y: 0.02
                }, 500).start().onComplete(() => {

                  if (STATE.duoBoxArr[i]) {
                    new Bol3D.TWEEN.Tween(STATE.duoBoxArr[i].position)
                      .to({
                        x: -1.25,
                        z: STATE.lineObjects['C3'][0][2]
                      }, 500).start().onComplete(() => {

                        if (STATE.duoBoxArr[i]) {
                          new Bol3D.TWEEN.Tween(STATE.duoBoxArr[i].position)
                            .to({
                              y: STATE.duoBoxArr[i].position.y - 0.02
                            }, 500).start()

                          new Bol3D.TWEEN.Tween(STATE.lianjie.position)
                            .to({
                              y: 0
                            }, 500).start().onComplete(() => {
                              userData.index = 0
                              userData.lineName = 'C3'
                            })
                        }
                      })
                  }
                })
            }

          }
        }
      } else if (userData.index == machine.index + 20) {
        if (machine.baffle?.userData.status) dbAnimetion2(machine.baffle, false)
      } else if (userData.index <= machine.index) {
        userData.lineName = machine.lineName
        userData.index = 0
      }
    } else if (userData.lineName.includes('G')) {// 进入机器人站台，机器人动画后进入A1线
      if (userData.index == 10) {
        if (!machine.baffle?.userData.status) dbAnimetion2(machine.baffle, true)
      } else if (userData.index == STATE.lineObjects[userData.lineName].length - 10) {
        userData.lineName = ''
        const dir = (userData.baffle + 1) % 2
        const jxsbMesh = STATE.jxsbObject['jxsb' + Math.ceil((userData.baffle + 1) / 2)].model
        const targetName = dir ? 'huo001' : 'huo'
        jxsbMesh.children.forEach(e => {
          if (e.name === targetName) {
            e.visible = true
          }
        })
        const animation = jxsbMesh.userData[dir ? 'Animation1' : 'Animation']


        const finished = () => {
          jxsbMesh.children.forEach(e => {
            if (e.name === targetName) {
              e.visible = false
            }
          })
          animation._mixer.removeEventListener('finished', finished)
          userData.lineName = machine.lineName
        }
        animation._mixer.addEventListener('finished', finished)
        animation.reset()
        animation.play()
      } else if (userData.index == STATE.lineObjects[userData.lineName].length - 2) {
        userData.lineName = 'A1'
        userData.index = machine.index2
      }
    }
    if (userData.lineName == 'A1' || userData.lineName == 'A2') {
      tpRecycle(userData, STATE.duoBoxArr, i)
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
      if (STATE.rkBoxArr[i]) {
        machine.boxArr.push(STATE.rkBoxArr[i])
        new Bol3D.TWEEN.Tween(STATE.rkBoxArr[i].position).to({
          z: -14 + .2 * (machine.boxArr.length - 1)
        }, 2000).start()
        STATE.rkBoxArr.splice(i, 1)
        i--
      }
      if (machine.boxArr.length >= 10) STATE.rkPasue = false
    }
  }
}

// 料箱动画
function lxBoxMove (liaoxiangOpt) {
  const { baffle, dest } = liaoxiangOpt
  const index = STATE.loopRoadway[baffle - 1].index
  let liaoxiang = STATE.loopRoadway[baffle - 1].liaoxiang
  if (!liaoxiang) {
    liaoxiang = baffle < 2 ? STATE.sceneModel['dapmtuopan'].clone() : STATE.sceneModel['pmtuopan'].clone()
    CACHE.container.attach(liaoxiang)
    liaoxiang.position.set(...STATE.loopRoadway[baffle - 1].position)
  }
  STATE.loopRoadway[baffle - 1].liaoxiang = null
  liaoxiang.userData.dest = dest
  liaoxiang.userData.baffle = baffle
  liaoxiang.userData.type = baffle < 3 ? 'ipad' : 'phone'
  if (liaoxiang.userData.type === 'phone') {

    const shouji = liaoxiang.children.find(e => e.name === 'shouji001')
    if (shouji) {
      const clone1 = shouji.clone()
      const clone2 = shouji.clone()
      const clone3 = shouji.clone()
      clone1.name = 'clone1'
      clone2.name = 'clone2'
      clone3.name = 'clone3'
      clone1.position.x = 0.1
      clone2.position.x = 0.1
      clone2.position.z = -0.19
      clone3.position.z = -0.065
      shouji.parent.add(clone1)
      shouji.parent.add(clone2)
      shouji.parent.add(clone3)
    }
  }

  if (liaoxiang) {
    new Bol3D.TWEEN.Tween(liaoxiang.position).to({
      x: STATE.lineObjects['D1'][index][0],
      y: STATE.lineObjects['D1'][index][1],
      z: STATE.lineObjects['D1'][index][2]
    }, 800).start().onComplete(() => {
      liaoxiang.userData.lineName = 'D1'
      liaoxiang.userData.index = index
      liaoxiang.userData.back = false
      STATE.loopBoxArr.push(liaoxiang)
    })
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
    if (userData.lineName == 'D1' || userData.lineName == 'E1') userData.index--
    else userData.index++
    try {
      STATE.loopBoxArr[i].lookAt(new Bol3D.Vector3(...STATE.lineObjects[userData.lineName][userData.index]))
      STATE.loopBoxArr[i].position.set(...STATE.lineObjects[userData.lineName][userData.index])
    } catch (e) { }
    // if (userData.lineName == 'D2') {
    //   STATE.loopBoxArr[i].rotation.y = 0
    // } else {
    //   STATE.loopBoxArr[i].rotation.y = -Math.PI / 2
    // }
    if (userData.lineName == 'D1') {

      if (userData.back) {
        for (let j = STATE.loopRoadway.length - 1; j >= 2; j--) {
          if (STATE.loopRoadway[j].liaoxiang == null) {
            const baffle = STATE.loopRoadway[j]
            if (userData.index == baffle.index) {
              const liaoxiang = STATE.loopBoxArr[i]
              if (liaoxiang) {
                userData.lineName = ''
                userData.boxArr = []
                STATE.loopBoxArr.splice(i, 1)
                i--
                liaoxiang.rotation.x = 0
                liaoxiang.rotation.y = 0
                const newBox = j < 2 ? STATE.sceneModel['dapmtuopan'].clone() : STATE.sceneModel['pmtuopan'].clone()
                STATE.loopRoadway[j].liaoxiang = newBox
                new Bol3D.TWEEN.Tween(liaoxiang.position).to({
                  x: baffle.position[0],
                  y: baffle.position[1],
                  z: baffle.position[2],
                }, 800).start().onComplete(() => {
                  CACHE.container.attach(newBox)
                  newBox.position.set(liaoxiang.position.x, liaoxiang.position.y, liaoxiang.position.z)
                  liaoxiang.parent.remove(liaoxiang)
                })
              }
            }
            break
          } else if (userData.index < 4) {
            if (STATE.loopBoxArr[i]) {
              STATE.loopBoxArr[i].parent.remove(STATE.loopBoxArr[i])
              STATE.loopBoxArr.splice(i, 1)
              i--
            }
          }
        }

      } else if (userData.baffle >= 10 && userData.index == 674) {
        if (STATE.loopBoxArr[i]) {
          userData.lineName = ''
          new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
            x: STATE.lineObjects['D4'][678][0],
            y: STATE.lineObjects['D4'][678][1],
            z: STATE.lineObjects['D4'][678][2],
          }, 2000).start().onComplete(() => {
            userData.lineName = 'D4'
            userData.index = 678
          })
        }
      } else if (userData.baffle >= 5 && userData.index == 415) {
        if (STATE.loopBoxArr[i]) {
          userData.lineName = ''
          new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
            x: STATE.lineObjects['D4'][406][0],
            y: STATE.lineObjects['D4'][406][1],
            z: STATE.lineObjects['D4'][406][2],
          }, 2000).start().onComplete(() => {
            userData.lineName = 'D4'
            userData.index = 406
          })
        }
      } else if (userData.index == 46) {
        if (STATE.loopBoxArr[i]) {
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
      }
    } else if (userData.lineName == 'D4') {

      userData.pack = [3123, 3125, 3127, 3129, 3131, 3133, 3135, 3137].findIndex(e => e == userData.dest)
      if (userData.index == STATE.duoPack[userData.pack]?.index) {
        userData.lineName = 'D3'

        let D3RunArrIndex = 0
        if (userData.dest == 3123) D3RunArrIndex = 1
        else if (userData.dest == 3125) D3RunArrIndex = 7
        else if (userData.dest == 3127) D3RunArrIndex = 11
        else if (userData.dest == 3129) D3RunArrIndex = 17
        else if (userData.dest == 3131) D3RunArrIndex = 23
        else if (userData.dest == 3133) D3RunArrIndex = 27
        else if (userData.dest == 3135) D3RunArrIndex = 33
        else if (userData.dest == 3137) D3RunArrIndex = 37

        STATE.D3RunArr[D3RunArrIndex].visible = true
        STATE.D3RunArr[D3RunArrIndex].userData.back = true
        STATE.D3RunArr[D3RunArrIndex].userData.type = 'phone'


        // else if (userData.dest == 3137) STATE.D3RunArr[37].visible = true

        // if (userData.type === 'phone') {
        //   const initMeshNameArr = ['pmtuopan001', 'shouji001', 'shouji002', 'shouji003', 'shouji004', 'shouji005']
        //   const initMeshArr = []
        //   let liaoxiangMesh = null
        //   STATE.loopBoxArr[i].children.forEach(e => {
        //     if (initMeshNameArr.includes(e.name)) {
        //       initMeshArr.push(e)
        //       if (e.name === 'pmtuopan001') {
        //         liaoxiangMesh = e
        //       }
        //     }
        //   })


        //   userData.children = initMeshArr // 保存初始状态
        //   STATE.loopBoxArr[i].children = [liaoxiangMesh] // 清除平板
        // } else {
        //   const initMeshNameArr = ['dapmtuopan001_(1)', 'ipad']
        //   const initMeshArr = []
        //   let liaoxiangMesh = null
        //   STATE.loopBoxArr[i].children[0].children.forEach(e => {
        //     if (initMeshNameArr.includes(e.name)) {
        //       initMeshArr.push(e)
        //       if (e.name === 'dapmtuopan001_(1)') {
        //         liaoxiangMesh = e
        //       }
        //     }
        //   })
        //   userData.children = initMeshArr // 保存初始状态
        //   STATE.loopBoxArr[i].children[0].children = [liaoxiangMesh] // 清除平板
        // }

        // userData.index = STATE.duoPack[userData.pack].index2
        // userData.pack = null
        // userData.boxArr = null
        // userData.back = true

        STATE.loopBoxArr[i].parent.remove(STATE.loopBoxArr[i])
        STATE.loopBoxArr.splice(i, 1)
        i--

      } else if (userData.index >= 1040) {
        const liaoxiang = STATE.loopBoxArr[i]
        const baffle = STATE.loopRoadway[userData.baffle - 1]
        if (userData.baffle > 2) {
          const clone1 = liaoxiang.children.find(e => e.name === 'clone1')
          const clone2 = liaoxiang.children.find(e => e.name === 'clone2')
          const clone3 = liaoxiang.children.find(e => e.name === 'clone3')
          liaoxiang.remove(clone1)
          liaoxiang.remove(clone2)
          liaoxiang.remove(clone3)
        }

        userData.lineName = ''
        userData.boxArr = []
        STATE.loopBoxArr.splice(i, 1)
        i--
        liaoxiang.rotation.x = 0
        liaoxiang.rotation.y = 0
        liaoxiang.position.set(baffle.position[0], baffle.position[1], baffle.position[2])
      }

    } else if (userData.lineName == 'E1') {

      if (userData.index == 69 && userData.type == 'phone') {
        userData.lineName = 'D2'
        userData.index = 0
      } else if (userData.index == 15) {
        if (STATE.loopBoxArr[i]) {
          userData.lineName = ''
          const animation = new Bol3D.TWEEN.Tween(STATE.loopBoxArr[i].position).to({
            x: 6.55921422283932
          }, 3000)
          animation.start()
          const currentBox = STATE.loopBoxArr[i]
          STATE.loopBoxArr.splice(i, 1)
          i--
          animation.onComplete(() => {
            if (!STATE.loopRoadway[0].liaoxiang) {
              const cloneBox = STATE.sceneModel['dapmtuopan'].clone()
              CACHE.container.attach(cloneBox)
              cloneBox.position.set(...STATE.loopRoadway[0].position)
              STATE.loopRoadway[0].liaoxiang = cloneBox
            } else if (!STATE.loopRoadway[1].liaoxiang) {
              const cloneBox = STATE.sceneModel['dapmtuopan'].clone()
              CACHE.container.attach(cloneBox)
              cloneBox.position.set(...STATE.loopRoadway[1].position)
              STATE.loopRoadway[1].liaoxiang = cloneBox
            }
            currentBox.parent.remove(currentBox)
          })
        }
      }
    } else if (userData.lineName == 'D2' && userData.index == STATE.lineObjects['D2'].length - 3) {
      STATE.lineObjects['D2'].visible = false
      userData.lineName = ''
      tsjAnimetion(true, () => {
        STATE.lineObjects['D2'].visible = true
        userData.lineName = 'D1'
        userData.index = STATE.lineObjects['D1'].length - 2
        tsjAnimetion(false)
      })
    }
  }
}

// D3线的
function D3LoopLineMove () {
  for (let i = 0; i < STATE.D3RunArr.length; i++) {
    const box = STATE.D3RunArr[i]

    if (i === 0 && !box.visible) {
      box.parent.remove(box)
      STATE.D3RunArr.splice(0, 1)
      i--
      continue
    }

    if (box.userData.index > i * 25) {
      box.userData.index--
      try {
        box.lookAt(new Bol3D.Vector3(...STATE.lineObjects.D3[box.userData.index]))
        box.position.set(...STATE.lineObjects.D3[box.userData.index])
      } catch (e) { }
    }
    if (box.userData.index == 0 && box.userData.type) {

      if (box.userData.type != 'phone') {
        // 变为大托盘
        const cloneBox = STATE.sceneModel['dapmtuopan'].clone()
        box.children[0].geometry = cloneBox.children[0].children[0].geometry.clone()
        box.children[0].material = cloneBox.children[0].children[0].material.clone()
      }
      box.userData.lineName = 'E1'
      box.userData.index = STATE.lineObjects['E1'].length - 2
      STATE.loopBoxArr.push(box)
      STATE.D3RunArr.splice(i, 1)
      i--
      if (STATE.D3RunArr.length <= STATE.lineObjects.D3.length / 25) {
        const cloneBox = STATE.D3RunArr[STATE.D3RunArr.length - 1].clone()
        cloneBox.visible = false
        cloneBox.position.set(...STATE.lineObjects.D3[STATE.D3RunArr.length * 25])
        cloneBox.userData.index = 25 * STATE.D3RunArr.length
        cloneBox.userData.lineName = 'D3'
        cloneBox.rotation.y = -Math.PI / 2

        const cloneBox2 = cloneBox.clone()
        cloneBox2.position.set(...STATE.lineObjects.D3[STATE.D3RunArr.length * 25])
        cloneBox2.visible = true
        cloneBox2.children.forEach(e => {
          e.material = e.material.clone()
          e.material.transparent = true
          e.material.opacity = 0
          new Bol3D.TWEEN.Tween(e.material).to({
            opacity: 1
          }, 3000).start().onComplete(() => {
            e.material.transparent = false
            e.material.opacity = 1
          })
        })

        STATE.D3RunArr.push(cloneBox2)
        CACHE.container.attach(cloneBox2)
        STATE.D3RunArr.push(cloneBox)
        CACHE.container.attach(cloneBox)
      }
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
      case index == 2 && (key == "huanxian" || key == 'rukuxian' || key.includes('huanxian_')):
      case index == 3 && key.includes('jxsb'):
      case index == 4 && (key == "huanxian" || key.includes('huanxian_')):
      case index == -1:
        STATE.sceneModel[key].traverse(child => {
          switch (true) {
            case index == 0 && (child.name.includes('yidongshangxiaban') || child.name.includes('shijuesaomaoji') || child.name.includes('cesaoji_')):
            case index == 2 && key === 'rukuxian' && !child.name.includes('yidongshangxiaban'):
            case index == 4 && child.parent.name !== "xuyingchang" && child.name !== "对象158" && child.name !== "tishengji" && child.name !== 'huanxian_LongCylinder1':
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
  const geometry = new Bol3D.PlaneGeometry(59.383, 31.197)
  const options = {
    clipBias: 0.01,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xffffff
  }
  const mirro = new Reflector(geometry, options)
  mirro.rotation.x = -Math.PI / 2
  mirro.position.set(13.5, 0, -3.7)

  container.attach(mirro)
}

// 6小时刷新一次
function reload () {
  setTimeout(() => {
    document.cookie = `position=${JSON.stringify(container.orbitCamera.position)}`
    document.cookie = `target=${JSON.stringify(container.orbitControls.target)}`
    location.reload()
  }, 1000 * 60 * 60 * 6)
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
    } else {
      rkBoxMove()
    }

    danCkBoxMove()
    duoCkBoxMove()
    loopBoxMove()
    D3LoopLineMove()
    STATE.times = 0
  }
}


export const API = {
  cameraAnimation,
  loadGUI,
  rkScan,
  instance,
  mergedMesh,
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
  render,
  reload
}
