// 引入axios
import axios from 'axios'
// 将axios封装为vue的插件
var myaxios = {}
myaxios.install = function (Vue) {
  // 接口文档中获取的统一路径
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 将axios作为实例方法添加到vue中,将axios封装为$http
  Vue.prototype.$http = axios
}

// 导出组件
export default myaxios
