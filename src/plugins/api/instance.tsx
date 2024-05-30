import axios from 'axios'
import { ResponseCodes } from '@/types/ResponseHandle'

const { VITE_API_URL } = import.meta.env

const instance = axios.create({
  baseURL: VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

const onRequest = (config: any) => {
  // const token = getCookie("OUTDOORKA_TOKEN");
  // if (token) {
  // 	config.headers.Authorization = `Bearer ${token}`;
  // }
  return config
}

const onResponse = (response: any) => {
  const { data } = response
  if (data.code === ResponseCodes.SUCCESS) {
    return data.result
  } else {
    return data
  }
}

const onError = (error: any) => {
  const { response, data } = error
  console.log(response);
  console.log(data);
  if (response) {
    return response.data?.message || response.data?.errorMessage || '服務異常'
  } else {
    return '服務異常'
  }
}

instance.interceptors.request.use(onRequest)
instance.interceptors.response.use(onResponse, onError)

export default instance
