// Reduz uma imagem no navegador antes de enviar (SPEC §2.3): lado maior até "ladoMaximo" px,
// em WebP (ou JPEG, se o navegador não gerar WebP) com qualidade 0,85.

export const TIPOS_IMAGEM = ['image/jpeg', 'image/png', 'image/webp']
export const TAMANHO_MAXIMO = 5 * 1024 * 1024 // 5 MB

function carregarImagem(arquivo) {
  return new Promise((resolver, rejeitar) => {
    const url = URL.createObjectURL(arquivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolver(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      rejeitar(new Error('Não foi possível abrir esta imagem.'))
    }
    img.src = url
  })
}

function canvasParaBlob(canvas, tipo) {
  return new Promise((resolver) => canvas.toBlob(resolver, tipo, 0.85))
}

// Retorna um Blob já reduzido
export default async function redimensionarImagem(arquivo, ladoMaximo = 1600) {
  if (!TIPOS_IMAGEM.includes(arquivo.type)) {
    throw new Error('Formato não aceito. Envie uma imagem JPEG, PNG ou WebP.')
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    throw new Error('A imagem passa de 5 MB. Escolha uma imagem menor.')
  }

  const img = await carregarImagem(arquivo)
  const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * escala)
  canvas.height = Math.round(img.height * escala)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

  let blob = await canvasParaBlob(canvas, 'image/webp')
  // Alguns navegadores (Safari antigo) ignoram WebP e devolvem PNG: aí usamos JPEG
  if (!blob || blob.type !== 'image/webp') blob = await canvasParaBlob(canvas, 'image/jpeg')
  return blob
}
