/**
 * Configuração do Supabase
 * Conexão com o banco de dados
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Validação das variáveis de ambiente
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente ${envVar} é obrigatória`);
  }
}

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente com service role (para operações administrativas)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente com anon key (para operações públicas, se necessário)
export const supabaseAnon = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY || supabaseServiceKey
);

// Função para testar a conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro ao conectar com Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (err) {
    console.error('❌ Erro na conexão com Supabase:', err.message);
    return false;
  }
}

// Função para verificar se a tabela usuarios existe
export async function checkTableExists() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn('⚠️  Tabela "usuarios" não encontrada. Certifique-se de que ela existe no Supabase.');
        return false;
      }
      throw error;
    }
    
    console.log('✅ Tabela "usuarios" encontrada');
    return true;
  } catch (err) {
    console.error('❌ Erro ao verificar tabela usuarios:', err.message);
    return false;
  }
}
