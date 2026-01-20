import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios'

/**
 * Archivo: src/services/api.ts
 * Propósito: Configurar Axios como cliente HTTP para comunicarse con el backend
 */

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * INTERCEPTOR DE PETICIONES
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  },
)

/**
 * INTERCEPTOR DE RESPUESTAS
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // window.location.href = '/login';
    }

    return Promise.reject(error)
  },
)

export default api
