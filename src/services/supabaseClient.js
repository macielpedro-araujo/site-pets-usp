import { createClient } from '@supabase/supabase-js'

// O client só é criado se as variáveis do .env existirem.
// Sem elas, o site roda em "modo demonstração" (dados no localStorage).
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && chave ? createClient(url, chave) : null

export const modoDemo = supabase === null
