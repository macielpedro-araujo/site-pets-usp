// Junta todos os PETs numa lista. Para adicionar um PET novo:
// 1) crie src/content/pets/<slug>.js  2) importe aqui  3) coloque na lista.
import adm from './adm.js'
import biotecnologiaAgricola from './biotecnologia-agricola.js'
import cienciasSociais from './ciencias-sociais.js'
import computacao from './computacao.js'
import direitoFdusp from './direito-fdusp.js'
import direitosFdrp from './direitos-fdrp.js'
import ecologia from './ecologia.js'
import eefe from './eefe.js'
import enfermagemEerp from './enfermagem-eerp.js'
import engenhariaDeAlimentos from './engenharia-de-alimentos.js'
import filosofia from './filosofia.js'
import fmrp from './fmrp.js'
import fonoaudiologia from './fonoaudiologia.js'
import gaea from './gaea.js'
import historia from './historia.js'
import iqsc from './iqsc.js'
import mecanica from './mecanica.js'
import mecatronica from './mecatronica.js'
import petArvore from './pet-arvore.js'
import quimicaRp from './quimica-rp.js'
import siEach from './si-each.js'
import zootecniaFzea from './zootecnia-fzea.js'

export const listaPets = [
  adm,
  biotecnologiaAgricola,
  cienciasSociais,
  computacao,
  direitoFdusp,
  direitosFdrp,
  ecologia,
  eefe,
  enfermagemEerp,
  engenhariaDeAlimentos,
  filosofia,
  fmrp,
  fonoaudiologia,
  gaea,
  historia,
  iqsc,
  mecanica,
  mecatronica,
  petArvore,
  quimicaRp,
  siEach,
  zootecniaFzea,
]

// Procura um PET pelo slug (o pedaço da URL). Retorna undefined se não existir.
export function buscarPet(slug) {
  return listaPets.find((pet) => pet.slug === slug)
}

// As 6 áreas usadas no filtro da galeria (SPEC §6.2)
export const areas = [
  'Ciências Humanas',
  'Ciências Sociais Aplicadas',
  'Ciências da Saúde',
  'Engenharia',
  'Ciências Exatas e da Terra',
  'Ciências Agrárias',
]
