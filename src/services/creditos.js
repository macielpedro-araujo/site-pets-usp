// Créditos das fotos de terceiros (gerados por scripts/baixar-fotos.mjs em public/fotos/creditos.json)
import urlPublica from '../utils/urlPublica.js'

// Guarda a promessa para baixar o arquivo uma vez só, mesmo com vários componentes pedindo
let carregamento = null

export function listarCreditos() {
  if (!carregamento) {
    carregamento = fetch(urlPublica('/fotos/creditos.json'))
      .then((resposta) => (resposta.ok ? resposta.json() : []))
      .catch(() => [])
  }
  return carregamento
}

// Crédito de uma foto específica (ex.: '/fotos/fea.jpg'), ou null se não houver
export async function buscarCredito(caminho) {
  if (!caminho) return null
  const creditos = await listarCreditos()
  return creditos.find((c) => c.arquivo === caminho) ?? null
}
