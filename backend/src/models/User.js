/**
 * Modelo de Usuário com soft delete
 * Baseado na estrutura da tabela usuarios no Supabase
 */

export class User {
  constructor(data) {
    this.id = data.id || null;
    this.nome = data.nome;
    this.cpf = data.cpf;
    this.email = data.email;
    this.telefone = data.telefone || null;
    this.cep = data.cep || null;
    this.senha = data.senha;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.deleted_at = data.deleted_at || null;
  }

  // Validação dos dados do usuário
  static validate(data) {
    const errors = [];

    if (!data.nome || data.nome.trim().length === 0) {
      errors.push('Nome é obrigatório');
    } else if (data.nome.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }

    if (!data.cpf || data.cpf.trim().length === 0) {
      errors.push('CPF é obrigatório');
    } else if (!/^\d{11}$/.test(data.cpf.replace(/\D/g, ''))) {
      errors.push('CPF deve conter exatamente 11 dígitos');
    }

    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email é obrigatório');
    } else if (data.email.length > 100) {
      errors.push('Email deve ter no máximo 100 caracteres');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (data.telefone && data.telefone.length > 15) {
      errors.push('Telefone deve ter no máximo 15 caracteres');
    }

    if (data.cep && !/^\d{8}$/.test(data.cep.replace(/\D/g, ''))) {
      errors.push('CEP deve conter exatamente 8 dígitos');
    }

    if (!data.senha || data.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    } else if (data.senha.length > 255) {
      errors.push('Senha deve ter no máximo 255 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitizar dados para inserção/atualização
  toDatabase() {
    return {
      nome: this.nome.trim(),
      cpf: this.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
      email: this.email.toLowerCase().trim(),
      telefone: this.telefone ? this.telefone.replace(/\D/g, '') : null,
      cep: this.cep ? this.cep.replace(/\D/g, '') : null,
      senha: this.senha,
      updated_at: new Date().toISOString()
    };
  }

  // Dados para resposta (sem senha)
  toResponse() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      telefone: this.telefone,
      cep: this.cep,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at
    };
  }

  // Verificar se o usuário está "deletado" (soft delete)
  isDeleted() {
    return this.deleted_at !== null;
  }

  // Marcar como deletado (soft delete)
  markAsDeleted() {
    this.deleted_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  // Restaurar usuário deletado
  restore() {
    this.deleted_at = null;
    this.updated_at = new Date().toISOString();
  }
}
