import { message, notification } from "antd"
import axios from "axios"
import { history } from "../routers"
import { appStore } from "../routers"

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
    console.log(config, "before")
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
 * 采用element-ui弹框，根据业务对弹框形式自行改动
 */
http.interceptors.response.use(
  config => {
    console.log(config, "http")
    return config.data || {}
  },
  (error: any) => {
    console.log(error.response, "error")
    // loadingInstance.close();
    // 登录失败|禁用|token失效等相关问题返回401，此处做跳转登录页动作
    if (error.response.status === 401) {
      notification.error({
        message: "Notification Title",
        description:
          "This is the content of the notification. This is the content of the notification." +
          " This is the content of the notification."
      })
      // router.push({ path: PATH_LOGIN })
    } else if (error.response.status === 404) {
      history.push("/login")
      // Raven.captureException(error);
    }

    return Promise.reject(error.response)
  }
)

/**
 * get 请求方法
 *
 * @export
 * @param {string} url
 * @param {object} [config={}]
 * @returns
 */
export async function httpGet(url: string, config: object = {}) {
  appStore.setLoading(true)

  const res = await http.get(url, { ...config })
  appStore.setLoading(false)
  if (res && !res.data.success && res.data.error.code < 0) {
    message.error(` ${res.data.error.message}`)
    return
  }
  return res
}
/**
 * post 请求方法
 *
 * @export
 * @param {string} url
 * @param {object} [data={}]
 * @param {object} [config={}]
 * @returns
 */
export async function httpPost(
  url: string,
  data: object = {},
  config: object = {}
) {
  appStore.setLoading(true)

  const res = await http.post(url, data, { ...config })
  appStore.setLoading(false)
  if (res && !res.data.success) {
    message.error(` ${res.data.data}`)
    return
  }
  return res
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

export async function httpDel(url: string, config: object = {}) {
  appStore.setLoading(true)
  let res: any
  try {
    res = await axios.delete(url, { ...config })
  } catch (e) {
    appStore.setLoading(false)
    const { status, statusText } = e.response || {
      status: "unknown",
      statusText: "系统错误"
    }
    message.error(`${status}  ${statusText}`)
  }
  appStore.setLoading(false)
  if (res && !res.data.success) {
    message.error(` ${res.data.data}`)
    return
  }
  return res
}

export async function httpPut(
  url: string,
  data: object = {},
  config: object = {}
) {
  appStore.setLoading(true)
  let res: any
  try {
    res = await axios.put(url, data, { ...config })
  } catch (e) {
    appStore.setLoading(false)
    const { status, statusText } = e.response || {
      status: "unknown",
      statusText: "系统错误"
    }
    message.error(`${status}  ${statusText}`)
  }
  appStore.setLoading(false)
  if (res && !res.data.success) {
    message.error(` ${res.data.data}`)
    return
  }
  return res
}
