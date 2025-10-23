/**
 * Rotas da API para Usuários
 * CRUD completo com soft delete
 */

import express from 'express';
import { UserService } from '../services/UserService.js';

const router = express.Router();

/**
 * POST /api/users
 * Criar novo usuário
 */
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await UserService.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/users
 * Listar usuários com paginação
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const includeDeleted = req.query.includeDeleted === 'true';

    const result = await UserService.findAll(page, limit, includeDeleted);
    
    res.json({
      success: true,
      message: 'Usuários listados com sucesso',
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/users/:id
 * Buscar usuário por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const includeDeleted = req.query.includeDeleted === 'true';

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID deve ser um número válido'
      });
    }

    const user = await UserService.findById(id, includeDeleted);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário encontrado',
      data: user.toResponse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/users/email/:email
 * Buscar usuário por email
 */
router.get('/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const includeDeleted = req.query.includeDeleted === 'true';

    const user = await UserService.findByEmail(email, includeDeleted);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário encontrado',
      data: user.toResponse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/users/cpf/:cpf
 * Buscar usuário por CPF
 */
router.get('/cpf/:cpf', async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const includeDeleted = req.query.includeDeleted === 'true';

    const user = await UserService.findByCpf(cpf, includeDeleted);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário encontrado',
      data: user.toResponse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * PUT /api/users/:id
 * Atualizar usuário
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID deve ser um número válido'
      });
    }

    const updatedUser = await UserService.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: updatedUser
    });
  } catch (error) {
    const statusCode = error.message.includes('não encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/users/:id
 * Soft delete - Marcar usuário como deletado
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID deve ser um número válido'
      });
    }

    const deletedUser = await UserService.softDelete(id);
    
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso',
      data: deletedUser
    });
  } catch (error) {
    const statusCode = error.message.includes('não encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/users/:id/restore
 * Restaurar usuário deletado
 */
router.post('/:id/restore', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID deve ser um número válido'
      });
    }

    const restoredUser = await UserService.restore(id);
    
    res.json({
      success: true,
      message: 'Usuário restaurado com sucesso',
      data: restoredUser
    });
  } catch (error) {
    const statusCode = error.message.includes('não encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/users/verify-password
 * Verificar senha (para login futuro)
 */
router.post('/verify-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    const result = await UserService.verifyPassword(email, password);
    
    if (!result.isValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    res.json({
      success: true,
      message: 'Credenciais válidas',
      data: result.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
