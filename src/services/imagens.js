// Imagens enviadas pelos PETs e pela secretaria.
// Backend futuro: receber o arquivo, conferir se a conta pode gravar na pasta "dono"
// ("pets/<slug>" ou "noticias"), checar tipo (jpeg, png, webp) e tamanho (até 5 MB),
// salvar e devolver a URL pública da imagem.
import * as local from './local/imagensLocal.js'
import redimensionarImagem from '../utils/redimensionarImagem.js'
import urlPublica from '../utils/urlPublica.js'

// Reduz a imagem no navegador e envia. Retorna o caminho/URL para guardar nos dados.
// ladoMaximo menor serve para fotos pequenas (ex.: membros e logos).
export async function enviarImagem(dono, arquivo, ladoMaximo = 1600) {
  const reduzida = await redimensionarImagem(arquivo, ladoMaximo)
  return local.enviarImagem(dono, reduzida)
}

// Endereço para usar no <img src>: arquivos de public/, imagens enviadas no modo local
// ou URLs externas
export function urlImagem(caminho) {
  if (!caminho) return null
  if (local.ehImagemLocal(caminho)) return local.urlImagemLocal(caminho)
  return urlPublica(caminho)
}
