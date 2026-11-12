// PETs no modo local. O conteúdo inicial vem de src/content/pets/*.js; o localStorage guarda
// só os PETs que já foram editados, e o histórico de versões de cada um.
import { listaPets as conteudoInicial } from '../../content/pets/index.js'
import { copiar, esperar, gerarId, gravar, ler } from './armazenamento.js'
import { usuarioAtual } from './authLocal.js'
import {
  CAMPOS_ESTRUTURAIS,
  podeEditarCamposEstruturais,
  podeEditarPet,
  podeRestaurarVersao,
  podeVerVersoes,
} from './permissoes.js'
import { validarPet } from './validacao.js'

const CHAVE_PETS = 'pets-usp-pets' // { slug: dados completos }
const CHAVE_VERSOES = 'pets-usp-versoes' // { slug: [versões, da mais nova para a mais antiga] }
const MAX_VERSOES = 30 // por PET, para não encher o localStorage

function lerEditados() {
  return ler(CHAVE_PETS, {})
}

function petAtual(slug) {
  const editado = lerEditados()[slug]
  if (editado) return editado
  return conteudoInicial.find((p) => p.slug === slug) ?? null
}

export async function listarPets() {
  await esperar()
  const editados = lerEditados()
  return conteudoInicial.map((pet) => copiar(editados[pet.slug] ?? pet))
}

export async function buscarPet(slug) {
  await esperar()
  const pet = petAtual(slug)
  return pet ? copiar(pet) : null
}

// Guarda o PET e registra uma versão no histórico
function salvarComVersao(slug, dados, usuario, descricao) {
  const versoes = ler(CHAVE_VERSOES, {})
  const lista = versoes[slug] ?? []
  // Na primeira edição, guarda também o conteúdo inicial, para poder voltar a ele
  if (lista.length === 0) {
    const inicial = conteudoInicial.find((p) => p.slug === slug)
    lista.push({ id: gerarId(), dados: inicial, editadoPor: 'Conteúdo inicial', editadoEm: null, descricao: 'Versão inicial' })
  }
  lista.unshift({ id: gerarId(), dados, editadoPor: usuario.nome, editadoEm: dados.atualizadoEm, descricao })
  versoes[slug] = lista.slice(0, MAX_VERSOES)

  const editados = lerEditados()
  editados[slug] = dados
  gravar(CHAVE_PETS, editados)
  gravar(CHAVE_VERSOES, versoes)
}

// campos: só as partes que mudaram (ex.: { sobre: [...] })
export async function atualizarPet(slug, campos, descricao = 'Edição') {
  await esperar()
  const usuario = await usuarioAtual()
  const atual = petAtual(slug)
  if (!atual) throw new Error('PET não encontrado.')
  if (!podeEditarPet(usuario, slug)) throw new Error('Você não tem permissão para editar este PET.')

  // Campos estruturais (nome, unidade, campus...) só o CEPETUSP muda
  const mudouEstrutural = CAMPOS_ESTRUTURAIS.some(
    (campo) => campo in campos && JSON.stringify(campos[campo]) !== JSON.stringify(atual[campo]),
  )
  if (mudouEstrutural && !podeEditarCamposEstruturais(usuario)) {
    throw new Error('Nome, unidade, campus, área e ano só podem ser alterados pelo CEPETUSP.')
  }
  if ('slug' in campos && campos.slug !== slug) throw new Error('O endereço (slug) do PET não pode mudar.')

  const novo = {
    ...copiar(atual),
    ...copiar(campos),
    atualizadoEm: new Date().toISOString(),
    atualizadoPor: usuario.nome,
  }
  validarPet(novo)
  salvarComVersao(slug, novo, usuario, descricao)
  return copiar(novo)
}

export async function listarVersoes(slug) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!podeVerVersoes(usuario, slug)) throw new Error('Você não tem permissão para ver este histórico.')
  const lista = ler(CHAVE_VERSOES, {})[slug] ?? []
  // Não precisa mandar os dados completos para a lista
  return lista.map(({ id, editadoPor, editadoEm, descricao }) => ({ id, editadoPor, editadoEm, descricao }))
}

export async function restaurarVersao(slug, idVersao) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!podeRestaurarVersao(usuario)) throw new Error('Só o CEPETUSP pode restaurar versões.')
  const versao = (ler(CHAVE_VERSOES, {})[slug] ?? []).find((v) => v.id === idVersao)
  if (!versao) throw new Error('Versão não encontrada.')

  const dados = { ...copiar(versao.dados), atualizadoEm: new Date().toISOString(), atualizadoPor: usuario.nome }
  salvarComVersao(slug, dados, usuario, 'Versão restaurada')
  return copiar(dados)
}
