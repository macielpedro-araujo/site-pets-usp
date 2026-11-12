// PETs: leitura pública, edição pelo próprio PET ou CEPETUSP e histórico de versões (SPEC §2.2).
// Hoje tudo é delegado ao modo local (localStorage). Quando o banco for escolhido, só este
// arquivo (e a pasta local/) muda; as páginas continuam iguais.
import * as local from './local/petsLocal.js'
export { enviarImagem } from './imagens.js'

// Backend futuro: leitura pública, sem login
export function listarPets() {
  return local.listarPets()
}

// Retorna o PET ou null se não existir
export function buscarPet(slug) {
  return local.buscarPet(slug)
}

// Backend futuro: o servidor deve conferir se a conta é do PET "slug" ou do CEPETUSP, recusar
// mudanças em campos estruturais vindas de contas "pet", validar os limites e salvar uma versão
export function atualizarPet(slug, campos, descricao) {
  return local.atualizarPet(slug, campos, descricao)
}

// Backend futuro: só o próprio PET e o CEPETUSP veem o histórico
export function listarVersoes(slug) {
  return local.listarVersoes(slug)
}

// Backend futuro: só o CEPETUSP restaura (e a restauração vira uma nova versão)
export function restaurarVersao(slug, idVersao) {
  return local.restaurarVersao(slug, idVersao)
}

// As 6 áreas usadas no filtro da galeria e no editor (SPEC §6.2)
export { areas } from '../content/pets/index.js'
