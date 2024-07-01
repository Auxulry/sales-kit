import axios from 'axios'
import { getClientSideCookie } from './cookies'
import { Logger } from './logger'

/**
 *
 * Log Responser
 *
 * @param {*} res
 * @returns
 */
export const logResponser = (res) => {
  if (!res) return null
  const { config } = res
  const loadTime = performance.now()
  const url = config.url.replace(process.env.NEXT_PUBLIC_API, '')

  // * Send Response to logger
  Logger(`${config.method.toUpperCase()} ${url}`, {
    responseTime: loadTime,
    status: res.status,
    statusText: res.statusText,
    error: res?.data?.meta?.error || '',
    message: res?.data?.meta?.message || ''
  })
}

export function setHeaderSession(isAdmin, headers) {
  if (isAdmin) {
    const adminSession = getClientSideCookie('_sales_kit_admin_token')
    if (adminSession !== null) {
      console.log('not null')
      return {
        headers: {
          Authorization: `Bearer ${getClientSideCookie('_sales_kit_admin_token')}`,
          ...headers
        }
      }
    } else {
      return  {
        headers: {...headers}
      }
    }
  } else {
    const userSession = getClientSideCookie('_sales_kit_token');

    if (userSession !== null) {
      return {
        headers: {
          Authorization: `Bearer ${getClientSideCookie('_sales_kit_token')}`,
          ...headers
        }
      }
    } else {
      return {
        headers: {
          ...headers
        }
      }
    }
  }
}

/**
 * Axios create default config
 */
const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost',
  headers: {
    'Content-Type': 'application/json',
    version: process.env.NEXT_PUBLIC_VERSION || 'v1.0.0'
  }
})

/**
 * Axios interceptors response
 */
service.interceptors.response.use(function (res) {
  // * Turn on logger when not in production
  if (process.env.NODE_ENV !== 'production')
    logResponser(res)
  return res
}, function (error) {
  const err = error?.response
  // * Turn on logger when not in production
  if (process.env.NODE_ENV !== 'production')
    logResponser(err)

  return Promise.reject(err)
})

/**
 *
 * Function Get Axios
 *
 * @param {String} url
 * @param {*} params
 * @param config
 */
export const get = (url, params, config) => {
  return service.get(`${url}`, {
    params,
    ...config
  })
}

/**
 *
 * Function Post Axios
 *
 * @param {String} url
 * @param {*} body
 * @param config
 */
export const post = (url, body, config) => {
  return service.post(`${url}`, body, config)
}

/**
 *
 * Function Put Axios
 *
 * @param {String} url
 * @param {*} body
 * @param config
 */
export const put = (url, body, config) => {
  return service.put(`${url}`, body, config)
}

/**
 *
 * Function Delete Axios
 *
 * @param {String} url
 * @param {*} params
 * @param config
 */
export const del = (url, params, config) => {
  return service.delete(`${url}`, {
    params,
    ...config
  })
}

/**
 *
 * Custom Function getBlob response
 *
 * @param {String} url
 * @param {*} params
 */
export const getBlob = (url, params) => {
  return service.get(`${url}`, {
    params,
    responseType: 'blob'
  })
}
