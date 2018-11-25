import { Path } from "@constants/url"
import { notification } from "antd"
import axios from "axios"

import { appStore, history } from "../routers"

// 创建axios实例常量配置
const axiosCreate = {
  // 根据环境配置后端api的url
  // baseURL: process.env.VUE_APP_API_URL,
  // 请求超时时间
  timeout: 30000,
  // 是否允许后端设置cookie跨域，一般无需改动
  withCredentials: true,
  validateStatus(status: number) {
    // 若状态码大于等于400时则Reject 用来统一处理5XX报错走catch方法
    return status < 400
  }
}
// 创建axios实例
const http = axios.create(axiosCreate)

http.interceptors.request.use(
  config => {
    config.headers.Authorization = "Bearer " + localStorage.getItem("token")
    return config
  },
  error => {
    Promise.reject(error)
  }
)

/**
 * axios respone拦截器
 * 首先针对特殊状态码特殊处理，提示内容统一在常量ts中更改
 */
http.interceptors.response.use(
  config => {
    // console.log(config, "config")
    if (!config.data.success) {
      notification.warning({
        message: "Warning",
        description: config.data.msg
      })
      return
    }
    return config.data.data || {}
  },
  (error: any) => {
    // 登录失败|禁用|token失效等相关问题返回401，此处做跳转登录页动作
    if (error.response.status === 401) {
      notification.error({
        message: "Notification 401",
        description:
          "This is the content of the notification. This is the content of the notification." +
          " This is the content of the notification."
      })
    } else if (error.response.status === 404) {
      history.push(Path.Not_Found)
      return
    } else {
      return Promise.reject(error.response)
    }
  }
)

/**
 * get method
 *
 * @export
 * @param {string} url
 * @param {object} [config={}]
 * @returns
 */
export function httpGet(url: string, config: object = {}) {
  appStore.setLoading(true)
  return new Promise(async (resolve, _) => {
    const res = await http.get(url, { ...config })
    appStore.setLoading(false)
    if (res) {
      resolve(res)
    }
  })
}

/**
 * post method
 *
 * @export
 * @param {string} url
 * @param {object} [data={}]
 * @param {object} [config={}]
 * @returns
 */
export function httpPost(url: string, data: object = {}, config: object = {}) {
  appStore.setLoading(true)
  return new Promise(async (resolve, _) => {
    const res = await http.post(url, data, { ...config })
    appStore.setLoading(false)
    if (res) {
      resolve(res)
    }
  })
}
/**
 * 并发请求方法
 *
 * @export
 * @param {any} cb 回调函数
 * @param {any} promises 多个请求promise
 * @returns
 */
export function httpAll(cb: any, ...promises: any[]) {
  return axios.all(promises).then(axios.spread(cb))
}

/**
 * del method
 *
 * @export
 * @param {string} url
 * @param {object} [config={}]
 * @returns
 */
export function httpDel(url: string, config: object = {}) {
  appStore.setLoading(true)
  return new Promise(async (resolve, _) => {
    const res = await axios.delete(url, { ...config })
    appStore.setLoading(false)
    if (res) {
      resolve(res)
    }
  })
}

/**
 * put method
 *
 * @export
 * @param {string} url
 * @param {object} [data={}]
 * @param {object} [config={}]
 * @returns
 */
export function httpPut(url: string, data: object = {}, config: object = {}) {
  appStore.setLoading(true)
  return new Promise(async (resolve, _) => {
    const res = await axios.put(url, data, { ...config })
    appStore.setLoading(false)
    if (res) {
      resolve(res)
    }
  })
}
