// Validações dos dados (SPEC §2.2 e §2.3). O banco de verdade também deve ter essas regras
// (checks/constraints); aqui elas valem para o modo local.

export const LIMITES = { sobre: 10, membros: 60, projetos: 30, galeria: 30 }

const REDES = ['instagram', 'linktree', 'linkedin', 'youtube', 'telegram', 'site']

function linkValido(link) {
  return !link || /^https:\/\/[^\s]+\.[^\s]+$/.test(link)
}

function emailValido(email) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Lança um erro (em português) com o primeiro problema encontrado
export function validarPet(pet) {
  if (!pet.nome?.trim()) throw new Error('O nome do PET é obrigatório.')
  for (const [campo, maximo] of Object.entries(LIMITES)) {
    if ((pet[campo]?.length ?? 0) > maximo) {
      throw new Error(`Limite atingido: no máximo ${maximo} itens em "${campo}".`)
    }
  }
  if (pet.corDestaque && !/^#[0-9a-fA-F]{6}$/.test(pet.corDestaque)) {
    throw new Error('A cor de destaque precisa estar no formato #RRGGBB.')
  }
  if (pet.membros?.some((m) => !m.nome?.trim())) throw new Error('Todo membro precisa ter um nome.')
  if (pet.projetos?.some((p) => !p.titulo?.trim())) throw new Error('Toda atividade precisa ter um título.')
  if (pet.projetos?.some((p) => !linkValido(p.link))) {
    throw new Error('Os links das atividades precisam começar com https://')
  }
  for (const rede of REDES) {
    if (!linkValido(pet.redes?.[rede])) throw new Error(`O link de ${rede} precisa começar com https://`)
  }
  if (!linkValido(pet.siteExterno)) throw new Error('O site externo precisa começar com https://')
  if (!emailValido(pet.email)) throw new Error('O e-mail de contato não parece válido.')
}

export function validarNoticia(noticia) {
  if (!noticia.titulo?.trim()) throw new Error('A notícia precisa de um título.')
  if (noticia.titulo.length > 160) throw new Error('O título pode ter no máximo 160 caracteres.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(noticia.dataPublicacao ?? '')) throw new Error('Informe a data da notícia.')
  if (!noticia.texto?.trim() && !noticia.linkExterno) {
    throw new Error('Escreva o texto da notícia ou informe um link externo.')
  }
  if (!linkValido(noticia.linkExterno)) throw new Error('O link externo precisa começar com https://')
}
