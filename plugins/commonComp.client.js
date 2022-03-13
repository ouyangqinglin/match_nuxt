import Vue from 'vue'
import fixedToast from '@comp/common/toast/toast'

Vue.prototype.$comp = {}
let comp = []

// toast 组件
const Toast = Vue.extend(fixedToast)
comp[0] = new Toast({ el: document.createElement('div') })
document.body.appendChild(comp[0].$el)
Vue.prototype.$comp.toast = {
  /**
   * @param {string} [obj.content] - 消息内容
   * @param {number} [obj.time] - 延迟消失时间
   * @param {string} [obj.style] - 弹窗样式
   * @param {'tick'} [obj.type] - 弹窗类型
   */

  show (obj) { comp[0].show(obj) },
  hide () { comp[0].hide() }
}
