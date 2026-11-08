// Opções e limites dos pedidos de alteração (SPEC §6.7 e §6.8)

export const TIPOS = [
  'Alterar texto',
  'Adicionar/remover membro',
  'Adicionar projeto/atividade',
  'Trocar/adicionar fotos',
  'Atualizar redes/contato',
  'Outro',
]

export const SECOES = [
  'Topo/Logo',
  'Foto do grupo',
  'Membros',
  'Sobre nós',
  'Projetos',
  'Redes sociais',
  'Outra',
]

// Nome que aparece na tela para cada status do banco
export const STATUS = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  recusado: 'Recusado',
}

export const LIMITE_TITULO = 120
export const MAX_ANEXOS = 5
export const MAX_TAMANHO_ANEXO = 5 * 1024 * 1024 // 5 MB
export const TIPOS_ANEXO = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf']
