// Pedidos de alteração (tabela "solicitacoes" e bucket "anexos" no Supabase).
// Sem Supabase configurado, tudo é repassado para o modo demonstração.
import * as demo from './demo/solicitacoesDemo.js'
import { usuarioAtual } from './auth.js'
import { modoDemo, supabase } from './supabaseClient.js'

const BUCKET = 'anexos'

// Remove acentos e caracteres estranhos do nome do arquivo (o Storage não aceita alguns)
function limparNomeArquivo(nome) {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

// Gera links temporários (1 hora) para ver os anexos do bucket privado
async function adicionarUrlsAnexos(pedido) {
  const anexos = await Promise.all(
    pedido.anexos.map(async (anexo) => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(anexo.path, 60 * 60)
      return { ...anexo, url: data?.signedUrl }
    }),
  )
  return { ...pedido, anexos }
}

// filtros: { status, petSlug } (os dois opcionais)
export async function listar(filtros = {}) {
  if (modoDemo) return demo.listar(filtros)

  let consulta = supabase.from('solicitacoes').select('*').order('created_at', { ascending: false })
  if (filtros.status) consulta = consulta.eq('status', filtros.status)
  if (filtros.petSlug) consulta = consulta.eq('pet_slug', filtros.petSlug)

  const { data, error } = await consulta
  if (error) throw new Error('Não foi possível carregar os pedidos.')
  return data
}

// Retorna o pedido ou null se não existir (ou se a pessoa não puder vê-lo)
export async function buscar(id) {
  if (modoDemo) return demo.buscar(id)

  const { data, error } = await supabase.from('solicitacoes').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error('Não foi possível carregar o pedido.')
  if (!data) return null
  return adicionarUrlsAnexos(data)
}

// dados: { tipo, secao, titulo, descricao }; arquivos: lista de File
export async function criar(dados, arquivos = []) {
  if (modoDemo) return demo.criar(dados, arquivos)

  const usuario = await usuarioAtual()
  if (!usuario || usuario.perfil !== 'pet') throw new Error('Apenas contas de PET podem criar pedidos.')

  // O id é criado aqui para os anexos irem para a pasta "<pet>/<id>/"
  const id = crypto.randomUUID()

  const anexos = []
  for (const [i, arquivo] of arquivos.entries()) {
    const path = `${usuario.petSlug}/${id}/${i + 1}-${limparNomeArquivo(arquivo.name)}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, arquivo)
    if (error) throw new Error(`Não foi possível enviar o anexo "${arquivo.name}".`)
    anexos.push({ path, nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size })
  }

  const agora = new Date().toISOString()
  const { data, error } = await supabase
    .from('solicitacoes')
    .insert({
      id,
      pet_slug: usuario.petSlug,
      autor_id: usuario.id,
      tipo: dados.tipo,
      secao: dados.secao,
      titulo: dados.titulo,
      descricao: dados.descricao,
      anexos,
      status: 'pendente',
      historico: [{ status: 'pendente', em: agora, por: usuario.nome }],
    })
    .select()
    .single()

  if (error) throw new Error('Não foi possível criar o pedido.')
  return data
}

// Só o CEPETUSP usa. Muda o status (registrando no histórico) e salva a resposta.
export async function atualizarStatus(id, status, resposta) {
  if (modoDemo) return demo.atualizarStatus(id, status, resposta)

  const usuario = await usuarioAtual()
  const atual = await buscar(id)
  if (!atual) throw new Error('Pedido não encontrado.')

  const agora = new Date().toISOString()
  const historico =
    atual.status === status ? atual.historico : [...atual.historico, { status, em: agora, por: usuario?.nome }]

  const { data, error } = await supabase
    .from('solicitacoes')
    .update({
      status,
      resposta: resposta?.trim() ? resposta.trim() : null,
      historico,
      updated_at: agora,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Não foi possível salvar as alterações.')
  return data
}
