import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authService.register({
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        cep: data.cep,
        senha: data.password
      })
      
      if (response.success) {
        toast.success('Cadastro realizado com sucesso!')
        navigate('/login')
      } else {
        toast.error(response.message || 'Erro ao fazer cadastro')
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.')
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14)
  }

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .slice(0, 15)
  }

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }

  return (
    <div className="card animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Criar conta
        </h2>
        <p className="text-gray-600">
          Cadastre-se no Hotel Doho e aproveite nossos serviços
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-group">
          <label htmlFor="nome" className="form-label">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="nome"
              type="text"
              className={`form-input pl-10 ${errors.nome ? 'error' : ''}`}
              placeholder="Seu nome completo"
              {...register('nome', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres'
                },
                maxLength: {
                  value: 100,
                  message: 'Nome deve ter no máximo 100 caracteres'
                }
              })}
            />
          </div>
          {errors.nome && (
            <p className="form-error">{errors.nome.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cpf" className="form-label">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            className={`form-input ${errors.cpf ? 'error' : ''}`}
            placeholder="000.000.000-00"
            {...register('cpf', {
              required: 'CPF é obrigatório',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message: 'CPF deve ter o formato 000.000.000-00'
              },
              onChange: (e) => {
                e.target.value = formatCPF(e.target.value)
              }
            })}
          />
          {errors.cpf && (
            <p className="form-error">{errors.cpf.message}</p>
          )}
        </div>

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
          <label htmlFor="telefone" className="form-label">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="telefone"
              type="text"
              className={`form-input pl-10 ${errors.telefone ? 'error' : ''}`}
              placeholder="(11) 99999-9999"
              {...register('telefone', {
                pattern: {
                  value: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                  message: 'Telefone deve ter o formato (11) 99999-9999'
                },
                onChange: (e) => {
                  e.target.value = formatPhone(e.target.value)
                }
              })}
            />
          </div>
          {errors.telefone && (
            <p className="form-error">{errors.telefone.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cep" className="form-label">
            CEP
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="cep"
              type="text"
              className={`form-input pl-10 ${errors.cep ? 'error' : ''}`}
              placeholder="00000-000"
              {...register('cep', {
                pattern: {
                  value: /^\d{5}-\d{3}$/,
                  message: 'CEP deve ter o formato 00000-000'
                },
                onChange: (e) => {
                  e.target.value = formatCEP(e.target.value)
                }
              })}
            />
          </div>
          {errors.cep && (
            <p className="form-error">{errors.cep.message}</p>
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
              placeholder="Mínimo 6 caracteres"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                },
                maxLength: {
                  value: 255,
                  message: 'Senha deve ter no máximo 255 caracteres'
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

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-input pl-10 pr-10 ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirme sua senha"
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: value =>
                  value === password || 'As senhas não coincidem'
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
            {...register('terms', {
              required: 'Você deve aceitar os termos de uso'
            })}
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Eu aceito os{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              termos de uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              política de privacidade
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="form-error">{errors.terms.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-lg w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Criando conta...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Criar conta
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
