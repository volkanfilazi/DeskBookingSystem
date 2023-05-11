import { useStorage } from '@vueuse/core'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { LoginResponse } from '../interface/user.interface'

const KEY = 'API KEY SECRET'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: KEY,
  timeout: 1000 * 30,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'application/json'    
  },
})
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const TOKEN = useStorage("saveToken","")        
    config.headers = {
      Authorization: TOKEN.value ? `Bearer ${TOKEN.value}` : undefined,
      ...config.headers,
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

async function refreshTokenFunc(){
  try {
    const refreshToken = useStorage("refreshToken","")
    const accessToken = useStorage("saveToken","")
    const response = await axios.post<LoginResponse>(`https://deskbooking.dev.webundsoehne.com/api/users/refresh`, {
    refresh: refreshToken.value
    })
    accessToken.value = response.data.token
    refreshToken.value = response.data.refresh 
    return response.data.token
  } catch (error) {
    return false
  }
}

axiosInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await refreshTokenFunc();            
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    return axiosInstance(originalRequest);
  }
  return Promise.reject(error);
});

const service = {
  get<T>(url: string, data?: object) {
    return axiosInstance.get<T>(url, data)
  },
  post<T>(url: string, data?: object) {
    return axiosInstance.post<T>(url, data)
  },
  put<T>(url: string, data?: object) {
    return axiosInstance.put<T>(url, data)
  },
  patch<T>(url: string, data?: object) {
    return axiosInstance.patch<T>(url, data)
  },
  delete<T>(url: string, data?: object) {
    return axiosInstance.delete<T>(url, data)
  },
}

export default service

