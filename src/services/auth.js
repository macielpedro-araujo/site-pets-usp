// Login e sessão. As páginas usam só estas funções (nunca o Supabase direto).
// Sem Supabase configurado, tudo é repassado para o modo demonstração.
import * as demo from './demo/authDemo.js'
import { modoDemo, supabase } from './supabaseClient.js'

// Junta os dados do Supabase Auth com a linha da tabela "profiles"
async function montarUsuario(user) {
  if (!user) return null
  const { data: perfil, error } = await supabase
    .from('profiles')
    .select('nome, perfil, pet_slug')
    .eq('id', user.id)
    .single()

  if (error || !perfil) {
    throw new Error('Sua conta ainda não tem um perfil cadastrado. Fale com o CEPETUSP.')
  }
  return {
    id: user.id,
    email: user.email,
    nome: perfil.nome,
    perfil: perfil.perfil,
    petSlug: perfil.pet_slug,
  }
}

export async function entrar(email, senha) {
  if (modoDemo) return demo.entrar(email, senha)

  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
  if (error) throw new Error('E-mail ou senha incorretos.')
  try {
    return await montarUsuario(data.user)
  } catch (erro) {
    await supabase.auth.signOut()
    throw erro
  }
}

export async function sair() {
  if (modoDemo) return demo.sair()
  await supabase.auth.signOut()
}

export async function usuarioAtual() {
  if (modoDemo) return demo.usuarioAtual()
  const { data } = await supabase.auth.getSession()
  try {
    return await montarUsuario(data.session?.user)
  } catch {
    return null
  }
}

// Chama "cb(usuario)" sempre que alguém entra ou sai. Retorna uma função para parar de ouvir.
export function aoMudarSessao(cb) {
  if (modoDemo) return demo.aoMudarSessao(cb)

  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
    // O setTimeout evita travar o Supabase ao fazer outra consulta dentro deste aviso
    setTimeout(async () => {
      try {
        cb(await montarUsuario(sessao?.user))
      } catch {
        cb(null)
      }
    }, 0)
  })
  return () => data.subscription.unsubscribe()
}

export async function recuperarSenha(email) {
  if (modoDemo) return demo.recuperarSenha(email)
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}entrar`,
  })
  if (error) throw new Error('Não foi possível enviar o e-mail. Tente novamente mais tarde.')
}
