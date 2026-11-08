// Login do modo demonstração: contas fixas e sessão guardada no localStorage.
import { esperar, gravar, ler, remover } from './armazenamento.js'

const CHAVE_SESSAO = 'pets-usp-demo-sessao'

// Contas de teste (SPEC §7.4). Senha de todas: demo1234
export const CONTAS_DEMO = [
  { id: 'demo-computacao', email: 'computacao@demo.pet', nome: 'PET Computação', perfil: 'pet', petSlug: 'computacao' },
  { id: 'demo-iqsc', email: 'iqsc@demo.pet', nome: 'PET IQSC', perfil: 'pet', petSlug: 'iqsc' },
  { id: 'demo-cepet', email: 'cepet@demo.pet', nome: 'CEPETUSP', perfil: 'cepet', petSlug: null },
]
export const SENHA_DEMO = 'demo1234'

// Quem quer ser avisado quando a sessão mudar
const ouvintes = new Set()

function avisar(usuario) {
  ouvintes.forEach((cb) => cb(usuario))
}

export async function entrar(email, senha) {
  await esperar()
  const conta = CONTAS_DEMO.find((c) => c.email === email.trim().toLowerCase())
  if (!conta || senha !== SENHA_DEMO) {
    throw new Error('E-mail ou senha incorretos.')
  }
  gravar(CHAVE_SESSAO, conta)
  avisar(conta)
  return conta
}

export async function sair() {
  remover(CHAVE_SESSAO)
  avisar(null)
}

export async function usuarioAtual() {
  return ler(CHAVE_SESSAO, null)
}

export function aoMudarSessao(cb) {
  ouvintes.add(cb)
  // Se a pessoa entrar ou sair em outra aba, esta aba também fica sabendo
  const aoMudarStorage = (e) => {
    if (e.key === CHAVE_SESSAO) cb(ler(CHAVE_SESSAO, null))
  }
  window.addEventListener('storage', aoMudarStorage)
  return () => {
    ouvintes.delete(cb)
    window.removeEventListener('storage', aoMudarStorage)
  }
}

export async function recuperarSenha() {
  throw new Error('No modo demonstração não é possível recuperar a senha. Use uma das contas de teste.')
}
