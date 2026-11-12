// Notícias no modo local. Começa com src/content/noticias.js; depois da primeira alteração,
// a lista inteira fica no localStorage.
import { noticias as conteudoInicial } from '../../content/noticias.js'
import { copiar, esperar, gerarId, gravar, ler } from './armazenamento.js'
import { usuarioAtual } from './authLocal.js'
import { podeEditarNoticias } from './permissoes.js'
import { validarNoticia } from './validacao.js'

const CHAVE = 'pets-usp-noticias'

function lerTodas() {
  return ler(CHAVE, conteudoInicial)
}

// Mais recentes primeiro
function ordenar(lista) {
  return [...lista].sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao))
}

export async function listarNoticias({ incluirRascunhos = false } = {}) {
  await esperar()
  const usuario = await usuarioAtual()
  const veRascunhos = incluirRascunhos && podeEditarNoticias(usuario)
  return copiar(ordenar(lerTodas().filter((n) => n.publicada || veRascunhos)))
}

export async function buscarNoticia(id) {
  await esperar()
  const usuario = await usuarioAtual()
  const noticia = lerTodas().find((n) => n.id === id)
  if (!noticia || (!noticia.publicada && !podeEditarNoticias(usuario))) return null
  return copiar(noticia)
}

// Cria (sem id) ou atualiza (com id)
export async function salvarNoticia(dados) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!podeEditarNoticias(usuario)) throw new Error('Só a secretaria e o CEPETUSP podem editar notícias.')

  const noticia = {
    resumo: '',
    texto: '',
    imagem: null,
    linkExterno: null,
    publicada: false,
    ...copiar(dados),
    id: dados.id || gerarId(),
    autor: usuario.nome,
  }
  validarNoticia(noticia)

  const todas = lerTodas()
  const indice = todas.findIndex((n) => n.id === noticia.id)
  if (indice >= 0) todas[indice] = noticia
  else todas.push(noticia)
  gravar(CHAVE, todas)
  return copiar(noticia)
}

export async function excluirNoticia(id) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!podeEditarNoticias(usuario)) throw new Error('Só a secretaria e o CEPETUSP podem excluir notícias.')
  gravar(CHAVE, lerTodas().filter((n) => n.id !== id))
}
