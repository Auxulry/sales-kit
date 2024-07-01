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

service.interceptors.request.use(async (request) => {
  const session = getClientSideCookie('_sales_kit_token');
  if (session !== null) {
    request.headers.Authorization = `Bearer ${getClientSideCookie('_sales_kit_token')}`;
  }
  return request;
});

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
 */
export const get = (url, params) => {
  return service.get(`${url}`, {
    params
  })
}

/**
 *
 * Function Post Axios
 *
 * @param {String} url
 * @param {*} body
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
 */
export const put = (url, body) => {
  return service.put(`${url}`, body)
}

/**
 *
 * Function Delete Axios
 *
 * @param {String} url
 * @param {*} params
 */
export const del = (url, params) => {
  return service.delete(`${url}`, {
    params
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
