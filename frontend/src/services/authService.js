import axios from 'axios'

// Configuração base da API
// No Render, VITE_API_URL será definida automaticamente via envVar
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:3001/api'

console.log('🔧 API Base URL configurada:', API_BASE_URL)

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
    console.error('❌ Erro na resposta da API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('user')
      // Não redirecionar automaticamente em produção para evitar loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Preservar o erro original para tratamento específico
    return Promise.reject(error)
  }
)

export const authService = {
  /**
   * Fazer login
   */
  async login(email, password) {
    try {
      console.log('🔐 Tentando fazer login:', { email })
      const response = await api.post('/users/verify-password', {
        email,
        password
      })
      console.log('✅ Login bem-sucedido:', response)
      return response
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error)
      throw this.handleError(error)
    }
  },

  /**
   * Registrar novo usuário
   */
  async register(userData) {
    try {
      console.log('📝 Tentando registrar usuário:', { email: userData.email, nome: userData.nome })
      const response = await api.post('/users', userData)
      console.log('✅ Usuário registrado com sucesso:', response)
      return response
    } catch (error) {
      console.error('❌ Erro ao registrar usuário:', error)
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
