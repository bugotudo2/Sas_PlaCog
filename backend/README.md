# SasPlaCog Backend API

API REST para gerenciamento de usuários com CRUD completo e soft delete.

## 🚀 Funcionalidades

- ✅ CRUD completo de usuários
- ✅ Soft delete (usuários não são removidos fisicamente)
- ✅ Validação de dados
- ✅ Hash de senhas com bcrypt
- ✅ Paginação
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Logs estruturados
- ✅ Health check

## 📋 Estrutura da Tabela Usuários

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(15),
  cep CHAR(8),
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

3. **Executar o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar usuários (com paginação) |
| GET | `/api/users/:id` | Buscar usuário por ID |
| GET | `/api/users/email/:email` | Buscar usuário por email |
| GET | `/api/users/cpf/:cpf` | Buscar usuário por CPF |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Soft delete (marcar como deletado) |
| POST | `/api/users/:id/restore` | Restaurar usuário deletado |
| POST | `/api/users/verify-password` | Verificar senha (para login) |

### Outros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/` | Informações da API |

## 📝 Exemplos de Uso

### Criar Usuário
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "cep": "01234567",
    "senha": "minhasenha123"
  }'
```

### Listar Usuários
```bash
curl "http://localhost:3001/api/users?page=1&limit=10"
```

### Buscar por Email
```bash
curl "http://localhost:3001/api/users/email/joao@email.com"
```

### Atualizar Usuário
```bash
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Santos",
    "telefone": "11888888888"
  }'
```

### Soft Delete
```bash
curl -X DELETE http://localhost:3001/api/users/1
```

### Restaurar Usuário
```bash
curl -X POST http://localhost:3001/api/users/1/restore
```

### Verificar Senha (Login)
```bash
curl -X POST http://localhost:3001/api/users/verify-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "minhasenha123"
  }'
```

## 🔧 Variáveis de Ambiente

```env
# App
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_ANON_KEY=sua-anon-key (opcional)

# Frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Soft Delete

O sistema implementa soft delete, ou seja:

- Usuários "deletados" não são removidos fisicamente
- Campo `deleted_at` é preenchido com timestamp
- Queries por padrão excluem usuários deletados
- Use `?includeDeleted=true` para incluir usuários deletados
- Endpoint `/restore` permite restaurar usuários deletados

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (12 rounds)
- Rate limiting (100 requests/15min por IP)
- CORS configurado
- Helmet para headers de segurança
- Validação de dados de entrada
- Sanitização de CPF, telefone e CEP

## 📊 Respostas da API

### Sucesso
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

### Paginação
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
