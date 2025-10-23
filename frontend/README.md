# Hotel Doho - Frontend

Frontend React para o sistema de reservas do Hotel Doho com páginas de login e cadastro.

## 🚀 Funcionalidades

- ✅ **Página de Login** com validação e integração com API
- ✅ **Página de Cadastro** com formulário completo
- ✅ **Design Responsivo** e moderno
- ✅ **Validação de Formulários** em tempo real
- ✅ **Integração com API** do backend
- ✅ **Formatação Automática** de CPF, telefone e CEP
- ✅ **Feedback Visual** com toasts e loading states
- ✅ **Roteamento** com React Router
- ✅ **Tema Hotel Doho** com cores personalizadas

## 🛠️ Tecnologias

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones
- **CSS Custom Properties** - Sistema de design

## 📦 Instalação

1. **Instalar dependências:**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
```

## 🎨 Design System

### Cores do Hotel Doho
- **Primary**: Azul oceano (#0ea5e9)
- **Secondary**: Tons de cinza neutros
- **Success**: Verde (#10b981)
- **Error**: Vermelho (#ef4444)
- **Warning**: Amarelo (#f59e0b)

### Componentes
- **Botões**: Primary, Secondary, Outline
- **Formulários**: Inputs com ícones e validação
- **Cards**: Layout principal das páginas
- **Layout**: Header, Main, Footer responsivos

## 📱 Páginas

### Login (`/login`)
- Formulário de email e senha
- Validação em tempo real
- Lembrar de mim
- Link para recuperação de senha
- Credenciais de demonstração

### Cadastro (`/register`)
- Formulário completo com todos os campos
- Formatação automática de CPF, telefone e CEP
- Validação de senhas
- Aceite de termos de uso
- Link para página de login

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Hotel Doho
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### Integração com API
O frontend está configurado para se comunicar com a API do backend através do `authService`:

- **Login**: `POST /api/users/verify-password`
- **Cadastro**: `POST /api/users`
- **Atualização**: `PUT /api/users/:id`
- **Busca**: `GET /api/users/:id`

## 📋 Validações

### Campos Obrigatórios
- Nome (2-100 caracteres)
- CPF (formato válido)
- Email (formato válido)
- Senha (mínimo 6 caracteres)

### Campos Opcionais
- Telefone (formato brasileiro)
- CEP (8 dígitos)

### Formatação Automática
- **CPF**: 000.000.000-00
- **Telefone**: (11) 99999-9999
- **CEP**: 00000-000

## 🎯 Funcionalidades Futuras

- [ ] Dashboard do usuário
- [ ] Sistema de reservas
- [ ] Perfil do usuário
- [ ] Recuperação de senha
- [ ] Autenticação JWT
- [ ] Modo escuro
- [ ] Internacionalização

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Linter ESLint
```

## 📁 Estrutura de Arquivos

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── Layout.jsx     # Layout principal
│   ├── pages/             # Páginas da aplicação
│   │   ├── LoginPage.jsx  # Página de login
│   │   └── RegisterPage.jsx # Página de cadastro
│   ├── services/          # Serviços e APIs
│   │   └── authService.js # Serviço de autenticação
│   ├── utils/             # Utilitários
│   │   └── validators.js  # Validações e formatadores
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globais
├── package.json           # Dependências
├── vite.config.js         # Configuração do Vite
└── README.md             # Documentação
```

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- Rate limiting na API
- CORS configurado
- Headers de segurança

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1200px+)
