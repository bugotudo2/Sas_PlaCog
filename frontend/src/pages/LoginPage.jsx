import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data.email, data.password)
      
      if (response.success) {
        toast.success('Login realizado com sucesso!')
        // Aqui você pode salvar o token no localStorage ou context
        localStorage.setItem('user', JSON.stringify(response.data))
        navigate('/dashboard') // Redirecionar para dashboard quando criado
      } else {
        toast.error(response.message || 'Erro ao fazer login')
      }
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || 'Erro de conexão. Verifique sua internet e tente novamente.'
      toast.error(errorMessage)
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta
        </h2>
        <p className="text-gray-600">
          Faça login para acessar sua conta no Hotel Doho
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              className={`form-input pl-10 ${errors.email ? 'error' : ''}`}
              placeholder="seu@email.com"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input pl-10 pr-10 ${errors.password ? 'error' : ''}`}
              placeholder="Sua senha"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                }
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Entrando...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Entrar
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2 font-medium">Credenciais de demonstração:</p>
        <p className="text-xs text-gray-500">Email: demo@hoteldoho.com</p>
        <p className="text-xs text-gray-500">Senha: demo123</p>
      </div>
    </div>
  )
}

export default LoginPage
