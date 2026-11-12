// Login e sessão. As páginas usam só estas funções.
// Por enquanto tudo roda no modo local (localStorage), até o banco ser escolhido (SPEC §2.1).
// Backend futuro: login com contas criadas pelo CEPETUSP (sem cadastro público), sessão segura
// (cookie httpOnly ou token) e o perfil da conta ("pet", "cepet" ou "secretaria") vindo do servidor.
import * as local from './local/authLocal.js'

// Contas de teste mostradas no quadro da página /entrar (só existem no modo local)
export const CONTAS_TESTE = local.CONTAS_TESTE
export const SENHA_TESTE = local.SENHA_TESTE

export function entrar(email, senha) {
  return local.entrar(email, senha)
}

export function sair() {
  return local.sair()
}

// Retorna { id, email, nome, perfil, petSlug } ou null
export function usuarioAtual() {
  return local.usuarioAtual()
}

// Chama "cb(usuario)" sempre que alguém entra ou sai. Retorna uma função para parar de ouvir.
export function aoMudarSessao(cb) {
  return local.aoMudarSessao(cb)
}

// Backend futuro: enviar o link de troca de senha por e-mail
export function recuperarSenha(email) {
  return local.recuperarSenha(email)
}
