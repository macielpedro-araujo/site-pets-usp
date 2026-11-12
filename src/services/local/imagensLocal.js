// Imagens do modo local: cada uma fica numa chave própria do localStorage, como data URL.
// Os dados (PETs e notícias) guardam só a referência "local-imagem:<id>", assim o histórico
// de versões não duplica as fotos.
import { gerarId, gravar, ler } from './armazenamento.js'
import { usuarioAtual } from './authLocal.js'
import { podeEnviarImagem } from './permissoes.js'

const PREFIXO_REF = 'local-imagem:'
const PREFIXO_CHAVE = 'pets-usp-imagem-'

function lerComoDataUrl(blob) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()
    leitor.onload = () => resolver(leitor.result)
    leitor.onerror = () => rejeitar(new Error('Não foi possível ler a imagem.'))
    leitor.readAsDataURL(blob)
  })
}

// dono: "pets/<slug>" ou "noticias"; blob: imagem já reduzida
export async function enviarImagem(dono, blob) {
  const usuario = await usuarioAtual()
  if (!podeEnviarImagem(usuario, dono)) {
    throw new Error('Você não tem permissão para enviar imagens para esta página.')
  }
  const id = gerarId()
  gravar(PREFIXO_CHAVE + id, { dono, dataUrl: await lerComoDataUrl(blob) })
  return PREFIXO_REF + id
}

export function ehImagemLocal(caminho) {
  return typeof caminho === 'string' && caminho.startsWith(PREFIXO_REF)
}

// Transforma "local-imagem:<id>" na data URL guardada (ou null se ela sumiu)
export function urlImagemLocal(caminho) {
  const id = caminho.slice(PREFIXO_REF.length)
  return ler(PREFIXO_CHAVE + id, null)?.dataUrl ?? null
}
