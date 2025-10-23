import axios from 'axios'

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  /**
   * Fazer login
   */
  async login(email, password) {
    try {
      const response = await api.post('/users/verify-password', {
        email,
        password
      })
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Registrar novo usuário
   */
  async register(userData) {
    try {
      const response = await api.post('/users', userData)
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Buscar usuário por ID
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`)
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Atualizar dados do usuário
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Fazer logout
   */
  logout() {
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  /**
   * Verificar se usuário está logado
   */
  isAuthenticated() {
    const user = localStorage.getItem('user')
    return !!user
  },

  /**
   * Obter dados do usuário logado
   */
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  /**
   * Tratar erros da API
   */
  handleError(error) {
    if (error.response) {
      // Erro da API
      return {
        success: false,
        message: error.response.data?.message || 'Erro na API',
        status: error.response.status
      }
    } else if (error.request) {
      // Erro de rede
      return {
        success: false,
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0
      }
    } else {
      // Outros erros
      return {
        success: false,
        message: 'Erro inesperado',
        status: 0
      }
    }
  }
}

export default authService
