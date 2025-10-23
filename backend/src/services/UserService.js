/**
 * Serviço CRUD para Usuários com Soft Delete
 * Implementa todas as operações de banco de dados
 */

import { supabase } from '../config/supabase.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

export class UserService {
  
  /**
   * Criar novo usuário
   */
  static async create(userData) {
    try {
      // Validar dados
      const validation = User.validate(userData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      // Verificar se email já existe
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser && !existingUser.isDeleted()) {
        throw new Error('Email já está em uso');
      }

      // Verificar se CPF já existe
      const existingCpf = await this.findByCpf(userData.cpf);
      if (existingCpf && !existingCpf.isDeleted()) {
        throw new Error('CPF já está em uso');
      }

      // Criar instância do usuário
      const user = new User(userData);
      const userDataForDb = user.toDatabase();

      // Hash da senha
      userDataForDb.senha = await bcrypt.hash(userDataForDb.senha, 12);

      // Inserir no banco
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          ...userDataForDb,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar usuário: ${error.message}`);
      }

      return new User(data).toResponse();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuário por ID
   */
  static async findById(id, includeDeleted = false) {
    try {
      let query = supabase
        .from('usuarios')
        .select('*')
        .eq('id', id);

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuário por email
   */
  static async findByEmail(email, includeDeleted = false) {
    try {
      let query = supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.toLowerCase().trim());

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuário por CPF
   */
  static async findByCpf(cpf, includeDeleted = false) {
    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      
      let query = supabase
        .from('usuarios')
        .select('*')
        .eq('cpf', cleanCpf);

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        throw new Error(`Erro ao buscar usuário por CPF: ${error.message}`);
      }

      return new User(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Listar todos os usuários (com paginação)
   */
  static async findAll(page = 1, limit = 10, includeDeleted = false) {
    try {
      const offset = (page - 1) * limit;

      let query = supabase
        .from('usuarios')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Erro ao listar usuários: ${error.message}`);
      }

      const users = data.map(userData => new User(userData).toResponse());

      return {
        users,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizar usuário
   */
  static async update(id, updateData) {
    try {
      // Verificar se usuário existe
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      // Se está atualizando email, verificar se não existe outro usuário com o mesmo email
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.findByEmail(updateData.email);
        if (emailExists && emailExists.id !== id) {
          throw new Error('Email já está em uso por outro usuário');
        }
      }

      // Se está atualizando CPF, verificar se não existe outro usuário com o mesmo CPF
      if (updateData.cpf && updateData.cpf !== existingUser.cpf) {
        const cpfExists = await this.findByCpf(updateData.cpf);
        if (cpfExists && cpfExists.id !== id) {
          throw new Error('CPF já está em uso por outro usuário');
        }
      }

      // Preparar dados para atualização
      const userDataForDb = {};
      
      if (updateData.nome) userDataForDb.nome = updateData.nome.trim();
      if (updateData.cpf) userDataForDb.cpf = updateData.cpf.replace(/\D/g, '');
      if (updateData.email) userDataForDb.email = updateData.email.toLowerCase().trim();
      if (updateData.telefone) userDataForDb.telefone = updateData.telefone.replace(/\D/g, '');
      if (updateData.cep) userDataForDb.cep = updateData.cep.replace(/\D/g, '');
      if (updateData.senha) {
        userDataForDb.senha = await bcrypt.hash(updateData.senha, 12);
      }

      userDataForDb.updated_at = new Date().toISOString();

      // Atualizar no banco
      const { data, error } = await supabase
        .from('usuarios')
        .update(userDataForDb)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }

      return new User(data).toResponse();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft Delete - Marcar usuário como deletado
   */
  static async softDelete(id) {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      if (existingUser.isDeleted()) {
        throw new Error('Usuário já está deletado');
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
      }

      return new User(data).toResponse();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restaurar usuário deletado
   */
  static async restore(id) {
    try {
      const existingUser = await this.findById(id, true); // Incluir deletados
      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      if (!existingUser.isDeleted()) {
        throw new Error('Usuário não está deletado');
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update({
          deleted_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao restaurar usuário: ${error.message}`);
      }

      return new User(data).toResponse();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar senha (para login futuro)
   */
  static async verifyPassword(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return { isValid: false, user: null };
      }

      const isValid = await bcrypt.compare(password, user.senha);
      return { isValid, user: user.toResponse() };
    } catch (error) {
      throw error;
    }
  }
}
