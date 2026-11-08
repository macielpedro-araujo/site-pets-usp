// Pedidos de alteração no modo demonstração, guardados no localStorage.
// As mesmas regras de acesso do Supabase (RLS) são repetidas aqui à mão.
import { esperar, gravar, ler } from './armazenamento.js'
import { usuarioAtual } from './authDemo.js'

const CHAVE = 'pets-usp-demo-solicitacoes'
// Imagens maiores que isso ficam só com o nome, para não estourar o localStorage
const LIMITE_DATA_URL = 400 * 1024

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Data de "N dias atrás", para os exemplos parecerem recentes
function diasAtras(dias) {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString()
}

// Pedidos de exemplo para o painel não começar vazio na apresentação
function pedidosExemplo() {
  return [
    {
      id: 'exemplo-1',
      pet_slug: 'computacao',
      autor_id: 'demo-computacao',
      tipo: 'Adicionar/remover membro',
      secao: 'Membros',
      titulo: 'Incluir dois novos membros',
      descricao: 'Por favor, incluam os novos membros do grupo:\n- Membro de exemplo 9 (Ciências de Computação)\n- Membro de exemplo 10 (Engenharia de Computação)',
      anexos: [],
      status: 'pendente',
      resposta: null,
      historico: [{ status: 'pendente', em: diasAtras(1), por: 'PET Computação' }],
      created_at: diasAtras(1),
      updated_at: diasAtras(1),
    },
    {
      id: 'exemplo-2',
      pet_slug: 'computacao',
      autor_id: 'demo-computacao',
      tipo: 'Alterar texto',
      secao: 'Sobre nós',
      titulo: 'Atualizar o texto do "Sobre nós"',
      descricao: 'Trocar o segundo parágrafo pelo texto abaixo:\n\n"Texto novo de exemplo para o Sobre nós."',
      anexos: [],
      status: 'em_andamento',
      resposta: 'Recebemos! Estamos revisando o texto e publicamos ainda esta semana.',
      historico: [
        { status: 'pendente', em: diasAtras(5), por: 'PET Computação' },
        { status: 'em_andamento', em: diasAtras(3), por: 'CEPETUSP' },
      ],
      created_at: diasAtras(5),
      updated_at: diasAtras(3),
    },
    {
      id: 'exemplo-3',
      pet_slug: 'iqsc',
      autor_id: 'demo-iqsc',
      tipo: 'Atualizar redes/contato',
      secao: 'Redes sociais',
      titulo: 'Adicionar o Instagram do grupo',
      descricao: 'Queremos que o link do nosso Instagram apareça na página. (exemplo)',
      anexos: [],
      status: 'concluido',
      resposta: 'Link adicionado. Confiram na página do grupo!',
      historico: [
        { status: 'pendente', em: diasAtras(10), por: 'PET IQSC' },
        { status: 'em_andamento', em: diasAtras(9), por: 'CEPETUSP' },
        { status: 'concluido', em: diasAtras(8), por: 'CEPETUSP' },
      ],
      created_at: diasAtras(10),
      updated_at: diasAtras(8),
    },
    {
      id: 'exemplo-4',
      pet_slug: 'iqsc',
      autor_id: 'demo-iqsc',
      tipo: 'Outro',
      secao: 'Outra',
      titulo: 'Trocar a cor do site inteiro',
      descricao: 'Gostaríamos que o site todo tivesse a cor do nosso grupo. (exemplo)',
      anexos: [],
      status: 'recusado',
      resposta: 'O visual geral é padronizado para todos os PETs, mas podemos usar a cor do grupo no topo da sua página. Abram um novo pedido com a cor desejada!',
      historico: [
        { status: 'pendente', em: diasAtras(14), por: 'PET IQSC' },
        { status: 'recusado', em: diasAtras(12), por: 'CEPETUSP' },
      ],
      created_at: diasAtras(14),
      updated_at: diasAtras(12),
    },
  ]
}

function lerTodos() {
  let pedidos = ler(CHAVE, null)
  if (pedidos === null) {
    pedidos = pedidosExemplo()
    gravar(CHAVE, pedidos)
  }
  return pedidos
}

// Pode ver o pedido? CEPET vê todos; PET só os do próprio PET
function podeVer(usuario, pedido) {
  return usuario && (usuario.perfil === 'cepet' || pedido.pet_slug === usuario.petSlug)
}

export async function listar(filtros = {}) {
  await esperar()
  const usuario = await usuarioAtual()
  return lerTodos()
    .filter((p) => podeVer(usuario, p))
    .filter((p) => !filtros.status || p.status === filtros.status)
    .filter((p) => !filtros.petSlug || p.pet_slug === filtros.petSlug)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function buscar(id) {
  await esperar()
  const usuario = await usuarioAtual()
  const pedido = lerTodos().find((p) => p.id === id)
  if (!pedido || !podeVer(usuario, pedido)) return null
  return pedido
}

// Lê um arquivo como data URL (texto) para guardar no localStorage
function lerComoDataUrl(arquivo) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()
    leitor.onload = () => resolver(leitor.result)
    leitor.onerror = rejeitar
    leitor.readAsDataURL(arquivo)
  })
}

export async function criar(dados, arquivos = []) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!usuario || usuario.perfil !== 'pet') throw new Error('Apenas contas de PET podem criar pedidos.')

  const anexos = []
  for (const arquivo of arquivos) {
    const anexo = { path: null, nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size }
    if (arquivo.type.startsWith('image/') && arquivo.size <= LIMITE_DATA_URL) {
      anexo.url = await lerComoDataUrl(arquivo)
    }
    anexos.push(anexo)
  }

  const agora = new Date().toISOString()
  const pedido = {
    id: gerarId(),
    pet_slug: usuario.petSlug,
    autor_id: usuario.id,
    tipo: dados.tipo,
    secao: dados.secao,
    titulo: dados.titulo,
    descricao: dados.descricao,
    anexos,
    status: 'pendente',
    resposta: null,
    historico: [{ status: 'pendente', em: agora, por: usuario.nome }],
    created_at: agora,
    updated_at: agora,
  }

  const todos = lerTodos()
  try {
    gravar(CHAVE, [pedido, ...todos])
  } catch {
    // localStorage cheio: guarda os anexos só com o nome
    pedido.anexos = anexos.map((a) => ({ ...a, url: undefined }))
    gravar(CHAVE, [pedido, ...todos])
  }
  return pedido
}

export async function atualizarStatus(id, status, resposta) {
  await esperar()
  const usuario = await usuarioAtual()
  if (!usuario || usuario.perfil !== 'cepet') throw new Error('Apenas o CEPETUSP pode atualizar pedidos.')

  const todos = lerTodos()
  const pedido = todos.find((p) => p.id === id)
  if (!pedido) throw new Error('Pedido não encontrado.')

  const agora = new Date().toISOString()
  if (pedido.status !== status) {
    pedido.historico = [...pedido.historico, { status, em: agora, por: usuario.nome }]
  }
  pedido.status = status
  pedido.resposta = resposta?.trim() ? resposta.trim() : null
  pedido.updated_at = agora
  gravar(CHAVE, todos)
  return pedido
}
