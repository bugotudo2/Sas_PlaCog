-- Script SQL para criar a tabela usuarios no Supabase
-- Inclui soft delete com campo deleted_at

-- Criar tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_deleted_at ON usuarios(deleted_at);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários na tabela e colunas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema com soft delete';
COMMENT ON COLUMN usuarios.id IS 'ID único do usuário (chave primária)';
COMMENT ON COLUMN usuarios.nome IS 'Nome completo do usuário (máximo 100 caracteres)';
COMMENT ON COLUMN usuarios.cpf IS 'CPF do usuário (11 dígitos, único)';
COMMENT ON COLUMN usuarios.email IS 'Email do usuário (único)';
COMMENT ON COLUMN usuarios.telefone IS 'Telefone do usuário (opcional, máximo 15 caracteres)';
COMMENT ON COLUMN usuarios.cep IS 'CEP do usuário (opcional, 8 dígitos)';
COMMENT ON COLUMN usuarios.senha IS 'Senha hasheada do usuário';
COMMENT ON COLUMN usuarios.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN usuarios.updated_at IS 'Data da última atualização do registro';
COMMENT ON COLUMN usuarios.deleted_at IS 'Data de soft delete (NULL = ativo, timestamp = deletado)';

-- Política RLS (Row Level Security) - opcional
-- Descomente se quiser ativar RLS no Supabase
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Exemplo de política RLS (ajuste conforme suas necessidades)
-- CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON usuarios
--     FOR SELECT USING (auth.uid()::text = id::text);

-- CREATE POLICY "Usuários podem atualizar apenas seus próprios dados" ON usuarios
--     FOR UPDATE USING (auth.uid()::text = id::text);

-- Inserir usuário de exemplo (opcional)
-- INSERT INTO usuarios (nome, cpf, email, telefone, cep, senha) VALUES
-- ('Usuário Teste', '12345678901', 'teste@email.com', '11999999999', '01234567', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK');

-- Verificar se a tabela foi criada corretamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
