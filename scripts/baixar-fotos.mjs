// Baixa as fotos do site (SPEC §5): as do PET Computação, do site oficial do grupo, e as dos
// campi e unidades, do Wikimedia Commons. No fim, gera public/fotos/creditos.json.
//
// Uso: npm run fotos        (Node 18+, precisa de internet; não usa nenhuma dependência)
//
// Depois de rodar, ABRA cada foto de public/fotos/ e confira se ela mostra mesmo o lugar.
// Se não mostrar, escolha outro arquivo no Commons e fixe o nome em ESCOLHAS_MANUAIS.

import fs from 'node:fs/promises'
import path from 'node:path'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(RAIZ, 'public')
const USER_AGENT = 'site-pets-usp/1.0 (CEPETUSP, PET Computação ICMC-USP)'
const API_COMMONS = 'https://commons.wikimedia.org/w/api.php'

// ---------------------------------------------------------------------------
// 1. PET Computação: imagens do site oficial do grupo (o próprio grupo é o autor)
// Os nomes com hash (ex.: -CdsxrVKb) mudam quando o site é republicado. Se algum der 404,
// abra https://pet.icmc.usp.br e https://pet.icmc.usp.br/sobrenos e copie o endereço novo.
// ---------------------------------------------------------------------------
const SITE_PET = 'https://pet.icmc.usp.br'
const PASTA_COMP = 'pets/computacao'

const FOTOS_COMPUTACAO = [
  ['/assets/logo_com_tipo_hoz_preto-CdsxrVKb.png', 'logo.png'],
  ['/assets/banner_pet_desktop-kRvtZsCH.png', 'grupo.png'],
  ['/sobre-nos/historia/2025_amigo-secreto.jpg', 'capa.jpg'],
  ['/sobre-nos/historia/2025_amigo-secreto.jpg', 'galeria/2025-amigo-secreto.jpg'],
  ['/sobre-nos/historia/2025-pet_imersao.png', 'galeria/2025-imersao.png'],
  ['/assets/semana_recepcao-D48dHH7o.webp', 'galeria/semana-recepcao.webp'],
  ['/sobre-nos/historia/2018_informatica-idosos.jpg', 'galeria/2018-informatica-idosos.jpg'],
  ['/sobre-nos/historia/2007_grupo-pet.jpg', 'galeria/2007-grupo.jpg'],
  ['/assets/codifique-DQva83Fe.svg', 'frentes/codifique.svg'],
  ['/assets/overclock-D61fjxHC.svg', 'frentes/overclock.svg'],
  ['/assets/fullstack-CRnC6-Vj.svg', 'frentes/fullstack.svg'],
  ['/assets/pesquisa-DnjTQNiz.svg', 'frentes/pesquisa.svg'],
  ['/assets/social-Dqa_Mkxq.svg', 'frentes/social.svg'],
  ['/assets/comunicacao-DKbqej-7.svg', 'frentes/comunicacao.svg'],
  // Fotos dos membros: salvas em minúsculas e .jpg, como em src/content/pets/computacao.js
  ...['arthur', 'gilopes', 'darroca', 'vidigal', 'jonas', 'boiago', 'kattryel', 'lorena', 'gui', 'pt', 'rafa', 'sofi'].map(
    (nome) => [`/sobre-nos/membros/${nome}.jpg`, `membros/${nome}.jpg`],
  ),
  ['/sobre-nos/membros/noventa.jpeg', 'membros/noventa.jpg'],
  ['/sobre-nos/membros/D.jpg', 'membros/d.jpg'],
]

// ---------------------------------------------------------------------------
// 2. Campi e unidades: Wikimedia Commons
// ---------------------------------------------------------------------------
const BUSCAS = {
  'campus-butanta': 'Praça do Relógio Cidade Universitária USP',
  'campus-sao-carlos': 'USP São Carlos campus',
  'campus-piracicaba': 'ESALQ Edifício Central',
  'campus-ribeirao': 'campus USP Ribeirão Preto',
  'campus-pirassununga': 'FZEA USP Pirassununga',
  'campus-bauru': 'Faculdade de Odontologia de Bauru USP',
  'fd-largo-sao-francisco': 'Faculdade de Direito da USP Largo São Francisco',
  fflch: 'FFLCH USP prédio',
  fea: 'FEA USP',
  each: 'EACH USP Leste',
}

// Arquivos escolhidos à mão. Têm prioridade sobre a busca.
// Cada um foi aberto e conferido (mostra mesmo o lugar). Se trocar algum, confira de novo.
// Conferidas em 12/11/2026. As "conhecidas" da SPEC (PortaoFMRPBandeirantes.jpg, 1280 px, e
// Faculdade de Direito da USP.jpg, 800 px) são menores que 1600 px, por isso foram trocadas.
const ESCOLHAS_MANUAIS = {
  'campus-butanta': 'File:At USP 2018 104.jpg', // Praça do Relógio, com a torre
  'campus-sao-carlos': 'File:São Carlos - E1 USP (19).jpg', // prédio E1, área 1 da USP São Carlos
  'campus-piracicaba': 'File:Esalq - Leonardo Gonsales Zimmermann.jpg', // Edifício Central da ESALQ
  'campus-ribeirao': 'File:Faculdade de Medicina de Ribeirão Preto 01.jpg', // prédio central da FMRP
  'campus-pirassununga': 'File:Plantação de milho na USP.jpg', // milharal da FZEA, foto de drone
  // Não há foto boa da FOB com licença livre (as que existem mostram pessoas). Esta é o prédio
  // do Centrinho (HRAC-USP), no mesmo campus de Bauru.
  'campus-bauru': 'File:O Centrinho de Bauru.jpg',
  'fd-largo-sao-francisco': 'File:Escola de direito largo do sao francisco.jpg',
  fflch: 'File:Prédio das Sociais (FFLCH - USP).jpg', // interior; as fotos externas livres são ruins
  fea: 'File:Sem título (Tomie Ohtake FEA) - USP 01.jpg', // escultura de Tomie Ohtake em frente à FEA
  each: 'File:EACH I1 Exterior.jpg',
}

// Licenças aceitas (campo LicenseShortName do Commons)
function licencaAceita(nome = '') {
  return /^(CC0|Public domain|PD|CC BY(-SA)? \d)/i.test(nome.trim())
}

// ---------------------------------------------------------------------------

async function baixar(url, destino) {
  const resposta = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} em ${url}`)
  const bytes = Buffer.from(await resposta.arrayBuffer())
  await fs.mkdir(path.dirname(destino), { recursive: true })
  await fs.writeFile(destino, bytes)
  return bytes.length
}

// Tira as tags HTML que o Commons coloca no nome do autor
function textoPuro(html = '') {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function consultarCommons(parametros) {
  const url = new URL(API_COMMONS)
  const todos = {
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1920',
    ...parametros,
  }
  for (const [chave, valor] of Object.entries(todos)) url.searchParams.set(chave, valor)
  const resposta = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!resposta.ok) throw new Error(`Commons respondeu HTTP ${resposta.status}`)
  const dados = await resposta.json()
  // A busca devolve as páginas fora de ordem; "index" guarda a ordem de relevância
  return Object.values(dados.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
}

// Confere se a imagem serve para capa: horizontal, grande, JPEG e com licença livre
function motivoRecusa(pagina) {
  const info = pagina.imageinfo?.[0]
  if (!info) return 'sem informações'
  if (info.mime !== 'image/jpeg') return `formato ${info.mime}`
  if (info.width <= info.height) return 'vertical'
  if (info.width < 1600) return `largura ${info.width}px`
  const licenca = info.extmetadata?.LicenseShortName?.value
  if (!licencaAceita(licenca)) return `licença "${licenca}"`
  return null
}

async function escolherFoto(chave) {
  if (ESCOLHAS_MANUAIS[chave]) {
    const [pagina] = await consultarCommons({ titles: ESCOLHAS_MANUAIS[chave] })
    const motivo = motivoRecusa(pagina)
    if (motivo) throw new Error(`${ESCOLHAS_MANUAIS[chave]} não serve (${motivo})`)
    return pagina
  }
  const paginas = await consultarCommons({
    generator: 'search',
    gsrsearch: BUSCAS[chave],
    gsrnamespace: '6',
    gsrlimit: '30',
  })
  const boa = paginas.find((p) => !motivoRecusa(p))
  if (!boa) throw new Error(`nenhuma foto aceitável na busca "${BUSCAS[chave]}"`)
  return boa
}

async function main() {
  const creditos = []
  const falhas = []
  // Créditos da execução anterior: usados se alguma foto falhar agora (a foto antiga continua lá)
  const arquivoCreditos = path.join(PUBLIC, 'fotos', 'creditos.json')
  const creditosAntigos = JSON.parse(await fs.readFile(arquivoCreditos, 'utf8').catch(() => '[]'))

  console.log('== PET Computação (site oficial do grupo)')
  for (const [origem, destino] of FOTOS_COMPUTACAO) {
    try {
      const bytes = await baixar(SITE_PET + origem, path.join(PUBLIC, PASTA_COMP, destino))
      console.log(`  ok  ${destino} (${Math.round(bytes / 1024)} KB)`)
    } catch (erro) {
      console.log(`  ERRO ${destino}: ${erro.message}`)
      falhas.push(destino)
    }
  }
  creditos.push({
    arquivo: `/${PASTA_COMP}/`,
    titulo: 'Logo, fotos do grupo, dos membros e ilustrações das frentes',
    autor: 'PET Computação ICMC-USP',
    licenca: 'Imagens do próprio grupo, publicadas com autorização',
    urlLicenca: null,
    urlOrigem: SITE_PET,
  })

  console.log('== Campi e unidades (Wikimedia Commons)')
  for (const chave of Object.keys(BUSCAS)) {
    try {
      const pagina = await escolherFoto(chave)
      const info = pagina.imageinfo[0]
      const meta = info.extmetadata ?? {}
      const arquivo = `/fotos/${chave}.jpg`
      await baixar(info.thumburl, path.join(PUBLIC, arquivo))
      creditos.push({
        arquivo,
        titulo: textoPuro(meta.ObjectName?.value) || pagina.title.replace(/^File:/, ''),
        autor: textoPuro(meta.Artist?.value) || 'Autor desconhecido',
        licenca: meta.LicenseShortName?.value,
        urlLicenca: meta.LicenseUrl?.value ?? null,
        urlOrigem: info.descriptionurl,
      })
      console.log(`  ok  ${chave}: ${pagina.title} (${meta.LicenseShortName?.value})`)
    } catch (erro) {
      console.log(`  ERRO ${chave}: ${erro.message}`)
      falhas.push(chave)
      const antigo = creditosAntigos.find((c) => c.arquivo === `/fotos/${chave}.jpg`)
      if (antigo) creditos.push(antigo)
    }
  }

  await fs.writeFile(arquivoCreditos, JSON.stringify(creditos, null, 2) + '\n')
  console.log(`\ncreditos.json com ${creditos.length} itens.`)

  if (falhas.length) {
    console.log(`\nFalharam: ${falhas.join(', ')}`)
    process.exitCode = 1
  }
  console.log('\nPróximos passos:')
  console.log('  1. npm run fotos:otimizar  (reduz as fotos do PET Computação e converte os SVGs)')
  console.log('  2. ABRA cada foto de public/fotos/ e confira se ela mostra o lugar certo.')
}

main()
