# Configuração do Render - Guia de Troubleshooting

## Problemas Comuns e Soluções

### 1. Variáveis de Ambiente no Render

Certifique-se de que as seguintes variáveis de ambiente estão configuradas no serviço **sasplacog-backend** no Render:

#### Variáveis Obrigatórias:
- `SUPABASE_URL` - URL do seu projeto Supabase (ex: `https://xxxxx.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key do Supabase (encontrada em Settings > API)
- `SUPABASE_ANON_KEY` - Anon Key do Supabase (encontrada em Settings > API)
- `NODE_ENV` - Deve ser `production` (já configurado no render.yaml)
- `PORT` - Deve ser `10000` (já configurado no render.yaml)

#### Variáveis Opcionais (mas recomendadas):
- `FRONTEND_URL` - URL do frontend no Render (será configurada automaticamente via render.yaml)

### 2. Verificar se a Tabela Existe no Supabase

Execute o script SQL em `backend/database/create_table_usuarios.sql` no SQL Editor do Supabase para criar a tabela `usuarios`.

### 3. Verificar Logs no Render

1. Acesse o dashboard do Render
2. Vá para o serviço `sasplacog-backend`
3. Clique em "Logs"
4. Verifique se há erros relacionados a:
   - Conexão com Supabase
   - Variáveis de ambiente faltando
   - Erros de CORS

### 4. Testar a API

Após o deploy, teste a API diretamente:

```bash
# Health check
curl https://seu-backend.onrender.com/health

# Teste de cadastro
curl -X POST https://seu-backend.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "cpf": "12345678901",
    "email": "teste@teste.com",
    "senha": "senha123"
  }'
```

### 5. Verificar CORS

O backend agora aceita automaticamente requisições de:
- URLs do Render (`.onrender.com` ou `render.com`)
- URL configurada em `FRONTEND_URL`
- Localhost (em desenvolvimento)

### 6. Verificar Console do Navegador

No frontend, abra o console do navegador (F12) e verifique:
- Se a URL da API está correta
- Se há erros de CORS
- Se há erros de rede
- Logs de requisições (agora com mais detalhes)

### 7. Problemas Comuns

#### Erro: "Variável de ambiente SUPABASE_URL é obrigatória"
- **Solução**: Configure a variável `SUPABASE_URL` no Render

#### Erro: "Tabela usuarios não encontrada"
- **Solução**: Execute o script SQL no Supabase

#### Erro: "Email já está em uso"
- **Solução**: O email já existe no banco. Use outro email ou delete o registro no Supabase

#### Erro de CORS
- **Solução**: O CORS foi ajustado para aceitar URLs do Render automaticamente. Se ainda houver problemas, verifique os logs do backend

#### Dados não estão sendo salvos
- **Solução**: 
  1. Verifique os logs do backend no Render
  2. Verifique se as variáveis de ambiente do Supabase estão corretas
  3. Verifique se a tabela existe e tem as colunas corretas
  4. Teste a API diretamente com curl ou Postman

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Render
- [ ] Tabela `usuarios` criada no Supabase
- [ ] Backend deployado e funcionando (testar `/health`)
- [ ] Frontend deployado e funcionando
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando
- [ ] Logs do backend sem erros críticos

## Suporte

Se os problemas persistirem:
1. Verifique os logs do backend no Render
2. Verifique o console do navegador no frontend
3. Teste a API diretamente com curl/Postman
4. Verifique se todas as variáveis de ambiente estão configuradas

