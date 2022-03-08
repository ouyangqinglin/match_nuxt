import Vue from 'vue'

const POSITIVE_CLASS = 'ppw-red', NEGATIVE_CLASS = 'ppw-green'

// 类型判断 type为需要判断的类型，value为数据值
Vue.prototype.TYPE_JUD = function (value, type) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase()
}

// 收益格式化
Vue.prototype.PROFIT_VALUE = (v, precision = 2, defVal = '--') => {
  return isNaN(parseFloat(v)) ? v || defVal : `${Number(v).toFixed(precision)}%`
}

/**
 * 根据收益正负， 显示对应颜色类名
 * @params {string | number} 收益值
 * @params {string | boolean} positiveClass 正收益类名
 * @params {string | boolean} negativeClass 负收益类名
 * @params {boolean} [needJud] - 为字符串的时候是否需要添加正收益类名
 * */
Vue.prototype.PROFIT_CLASS = (v, positiveClass = POSITIVE_CLASS, negativeClass = NEGATIVE_CLASS, needJud) => {
  if (Vue.prototype.TYPE_JUD(positiveClass, 'boolean')) { // 若第二参数为bool型，则强制string型加正收益类名
    needJud = positiveClass
    if (arguments.length > 2) {
      positiveClass = arguments[2] || POSITIVE_CLASS
      negativeClass = arguments[3] || NEGATIVE_CLASS
    } else positiveClass = POSITIVE_CLASS
  }
  if (isNaN(parseFloat(v))) { // 判断传入字符是否为string型
    if (v === '--' || v === '') return '' // 为空值或--不添加类名
    return needJud ? positiveClass : '' // 否则根据参数判断是否需要为string型添加类名
  } else if (parseFloat(v) > 0) return positiveClass || POSITIVE_CLASS
  else if (parseFloat(v) < 0) return negativeClass || NEGATIVE_CLASS
}


Vue.directive('profit_handler', (el, binding) => {
  let value = binding.modifiers.percent ? Vue.prototype.PROFIT_VALUE(binding.value) : binding.value
  let className = Vue.prototype.PROFIT_CLASS(value, POSITIVE_CLASS, NEGATIVE_CLASS, binding.modifiers.string)
  el.classList.remove(POSITIVE_CLASS, NEGATIVE_CLASS)
  className && el.classList.add(className)
  el.innerHTML = value === void 0 ? '' : value
})
