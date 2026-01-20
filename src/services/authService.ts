/**
 * Archivo: src/services/authService.ts
 * Propósito: Centralizar todas las operaciones relacionadas con autenticación
 */

import axios from 'axios'
import api from './api'

export interface User {
  id?: string
  firstName: string
  email: string
  isActive?: boolean
  roles?: string[]
}

export interface RegisterData {
  firstName: string
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

/**
 * Servicio de Autenticación
 * Contiene todos los métodos para manejar la autenticación de usuarios
 */
const authService = {
  /**
   * Registrar un nuevo usuario
   * @param userData - Datos del usuario {email, password, name}
   */
  async register(userData: RegisterData): Promise<unknown> {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: 'Error de conexión' }
      }
      throw error
    }
  },

  /**
   * Iniciar sesión
   * @param credentials - Credenciales {email, password}
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // 🔍 DEBUG: ver qué se envía
      console.log('AUTH SERVICE → LOGIN PAYLOAD:', credentials)

      const response = await api.post<AuthResponse>('/auth/login', credentials)

      // 🔍 DEBUG: ver qué responde el backen
      // Si el login es exitoso, guardar el token
      if (response.data.accessToken) {
        console.log('AUTH SERVICE → TOKEN GUARDADO')
        localStorage.setItem('token', response.data.accessToken)
      } else {
        console.warn('AUTH SERVICE → NO VIENE TOKEN')
      }

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('AUTH SERVICE → LOGIN ERROR:', error.response?.data)
        throw error.response?.data || { message: 'Error de conexión' }
      }
      throw error
    }
  },

  /**
   * Obtener el perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: 'Error al obtener perfil' }
      }
      throw error
    }
  },

  /**
   * Cerrar sesión
   * Elimina el token del almacenamiento local
   */
  logout(): void {
    localStorage.removeItem('token')
  },

  /**
   * Verificar si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token')
  },
}

export default authService
