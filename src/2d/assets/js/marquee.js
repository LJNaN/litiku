/* 
    跑马灯构造函数
*/
function Lamp(el, speed) {
  this.speed = speed;
  if(typeof el === 'string') {
    this.dom = document.querySelector(el); // 获取到滚动盒子
  }else {
    this.dom = el;
  }
  this.dom.onwheel = function(event) {
    // 注意此时的this = this.dom
    event = event || window.event;
    // 每次滚动增减30像素
    if(event.wheelDeltaY > 0) {
      this.scrollTop -= 30
    }else {
      this.scrollTop += 30
    }
    event.preventDefault() 
  }; 
  this.Refresh();
}
/* 跑马灯定时器方法 */
Lamp.prototype.count = function () {
  clearTimeout(this.MyMar);
  this.MyMar = setTimeout(() => {
    this.Marquee();
    this.count();
  }, this.speed);
}
Lamp.prototype.stopCount = function () {
  clearTimeout(this.MyMar);
}
Lamp.prototype.Refresh = function() {
  const _this = this;
  // 定义鼠标滚动事件
  this.box1 = this.dom.getElementsByTagName('*')[0]; // 获取到需要滚动的列表
  if(this.box1.offsetHeight <= this.dom.offsetHeight) return;
  this.dom.onmouseover = function () {
    _this.stopCount()
  }; // 鼠标移动到盒子上停止滚动
  this.dom.onmouseout = function () {
    _this.count()
  }; // 鼠标从盒子移开，恢复滚动
  this.box2 = this.box1.cloneNode(true); // 克隆列表到新节点
  this.box2.style.top = this.box1.offsetHeight + 'px'; // 设置新节点的位置，为列表的高度
  this.box2.style.position = 'absolute';
  this.dom.appendChild(this.box2)
  this.count()
}
/* 
  滚动处理方法
*/
Lamp.prototype.Marquee = function () {
  if (this.box2.offsetTop - this.dom.scrollTop < 0) {
    this.dom.scrollTop -= this.box2.offsetHeight;
  } else {
    this.dom.scrollTop += 1
  }
}
export default Lamp