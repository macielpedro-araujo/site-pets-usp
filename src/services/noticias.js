// Notícias do programa, publicadas pela secretaria do PET USP (SPEC §2.5).
// Hoje tudo é delegado ao modo local (localStorage).
import * as local from './local/noticiasLocal.js'

// Backend futuro: o público só recebe as publicadas; rascunhos só para secretaria e CEPETUSP
export function listarNoticias(opcoes) {
  return local.listarNoticias(opcoes)
}

// Retorna a notícia ou null (rascunhos só aparecem para quem pode editar)
export function buscarNoticia(id) {
  return local.buscarNoticia(id)
}

// Backend futuro: conferir se a conta é "secretaria" ou "cepet" e validar os campos
export function salvarNoticia(dados) {
  return local.salvarNoticia(dados)
}

// Backend futuro: mesma permissão de salvarNoticia
export function excluirNoticia(id) {
  return local.excluirNoticia(id)
}
