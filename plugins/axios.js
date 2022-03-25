import qs from 'querystring'
import ax from 'axios'
import Vue from 'vue'

export default ({ app, $axios, query, error }) => {
  const ERR_FUNC = error
  // 请求前参数预处理
  // function preprocess (params) {
  //   return qs.stringify(params)
  // }
  // $axios.defaults.paramsSerializer = preprocess
  // ax.defaults.transformRequest = $axios.defaults.transformRequest = [preprocess]
  // $axios.defaults.transformResponse = [function (data) {
  //   if (data) {
  //     try { // 原版response处理
  //       data = JSON.parse(data)
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   }
  //   return data
  // }]
  $axios.defaults.timeout = 60000
  $axios.defaults.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  // 跨域请求时是否需要使用凭证
  // $axios.defaults.withCredentials = true
  app.axios = ({ url = '', data = {}, config = {}, success = null, fail = null, error = null, complete = () => {}, datum = null, encode, sdata = false } = {}) => {
    if (datum) data = { param_list: JSON.stringify(datum) }
    if (encode) data = Object.assign({}, data, { ENCODE: 1 })
    if (sdata) data = { sdata: JSON.stringify(data) }
    data = Object.assign({}, { params: data }, config)
    return $axios.get(url, data || {})
      .then((res) => {
        if (!success) return res
        complete(res.data)
        if (fail) {
          if (res.data.status === 1) {
            return success(res.data.data, res.data.extra)
          } else if (fail.cb) return fail.cb(res.data.status, res.data.data, res.data)
        } else {
          return success(res.data, res)
        }
      })
      .catch((err) => {
        if (!success) return err
        console.error(err)
        complete(err)
        if (error) return error(err)
        else return ERR_FUNC({ statusCode: 404 })
      })
  }
  /**
   * @param {null | object} loading - loading配置相关
   * @param {number} [loading.delay] - 设置loading延迟n秒，默认为0
   * @param {string} type - 请求类型
   * @param {string} url - 请求地址
   * @param {object} data - 请求携带数据
   * {object} [data.params] - get请求时携带的参数
   * @param {object} [config] - 请求配置
   * @param {function} success - 成功回调。当fail存在时，仅接收res.data作参数。默认接收res和res.data作参数
   * @param {null | object | function} fail - fail配置相关
   * @param {boolean | undefined} [fail.tips] - true：显示toast，false: 不显示toast
   * @param {function} [fail.cb] - res.status不为1时的回调函数，默认不设置该函数。接收res.status和res.data作参数
   * @param {boolean} catchTip - 触发catch时是否有提示
   * @param {function} error - 错误回调函数
   * @param {function} complete - 完成回调函数
   * @return Promise | null
   */
  Vue.prototype.axios = function ({ loading = null, type = 'post', url = '', data = {}, success = null, fail = null, catchTip = false, error = () => {}, complete = () => {} } = {}) {
    if (type.toLowerCase() === 'get') data = Object.assign({}, { params: data })
    return $axios[type.toLowerCase()](url, data)
      .then((res) => {
        if (!success) return res
        complete(res.data)
        if (fail) {
          if (+res.data.status === 1) {
            return success(res.data.data, res.data.extra)
          } else {
            if (fail.cb) return fail.cb({ res: res.data, data: res.data.data, status: res.data.status })
          }
        } else {
          return success(res.data, res)
        }
      })
      .catch((err) => {
        console.error(err)
        if (!success) return err
        complete(err)
        if (catchTip) {
          if (err.response) {
          }
        }
        if (error) return error(err)
      })
  }
}
