import axios from 'axios'
import SHA1 from 'crypto-js/sha1'

// 定义封装的axios实例
const instance = axios.create({
  timeout: 10000,
  baseURL: 'api/'
})

// 定义请求拦截器
instance.interceptors.request.use(
  (config) => {
    const isGetMethod = config.method === 'get'
    const isPostMethod = config.method === 'post'

    let params = isGetMethod ? config.params : config.data

    const accessKeyid = localStorage.getItem('AccessKeyId')
    const accessKeySecret = localStorage.getItem('AccessKeySecret')
    if (config.url === 'login/get_login_qr' || config.url === 'login/get_login_url') {
      return config
    }

    if (config.url) {
      params = {
        ...params,
        access_key_id: accessKeyid,
        time: Math.floor(Date.now() / 1000)
      }
      const origin_params = { ...params }
      origin_params['access_key_secret'] = accessKeySecret
      const sortedParams = Object.keys(origin_params)
        .sort()
        .map((key) => `${key.toLowerCase()}=${origin_params[key]}`)
        .join(';')

      params['sig'] = SHA1(sortedParams).toString()

      if (isGetMethod) {
        config.params = params
      } else if (isPostMethod) {
        const formData = new FormData()
        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key])) {
            params[key].forEach((item: any) => {
              formData.append(key, item)
            })
          } else {
            formData.append(key, params[key])
          }
        })
        config.data = formData
      }
    }

    return config
  },
  (error) => {
    // 返回错误信息
    return Promise.reject(error)
  }
)

// 定义响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 返回错误信息
    return Promise.reject(error)
  }
)

export { instance }
