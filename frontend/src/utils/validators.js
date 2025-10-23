/**
 * Utilitários de validação
 */

export const validators = {
  /**
   * Validar CPF
   */
  cpf: (cpf) => {
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
      return false
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return false
    }
    
    // Validação do algoritmo do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cleanCpf.charAt(9))) {
      return false
    }
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) {
      remainder = 0
    }
    if (remainder !== parseInt(cleanCpf.charAt(10))) {
      return false
    }
    
    return true
  },

  /**
   * Validar email
   */
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validar telefone brasileiro
   */
  phone: (phone) => {
    const cleanPhone = phone.replace(/\D/g, '')
    // Aceita telefones com 10 ou 11 dígitos (com DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  },

  /**
   * Validar CEP
   */
  cep: (cep) => {
    const cleanCep = cep.replace(/\D/g, '')
    return cleanCep.length === 8
  },

  /**
   * Validar senha forte
   */
  strongPassword: (password) => {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return strongRegex.test(password)
  },

  /**
   * Validar senha básica (mínimo 6 caracteres)
   */
  password: (password) => {
    return password && password.length >= 6
  }
}

/**
 * Formatadores
 */
export const formatters = {
  /**
   * Formatar CPF
   */
  cpf: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14)
  },

  /**
   * Formatar telefone
   */
  phone: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .slice(0, 15)
  },

  /**
   * Formatar CEP
   */
  cep: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  },

  /**
   * Formatar nome (primeira letra maiúscula)
   */
  name: (value) => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

/**
 * Utilitários de string
 */
export const stringUtils = {
  /**
   * Capitalizar primeira letra
   */
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  /**
   * Remover acentos
   */
  removeAccents: (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  },

  /**
   * Gerar slug
   */
  slugify: (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
}
