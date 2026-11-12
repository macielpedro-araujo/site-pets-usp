import { Link } from 'react-router-dom'
import Carousel from '../../components/Carousel/Carousel.jsx'
import CreditoFoto from '../../components/CreditoFoto/CreditoFoto.jsx'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { IconeCapelo, IconeLivro, IconeRede } from '../../components/icons/Icones.jsx'
import { historiaCurta, pilares, slides } from '../../content/home.js'
import { noticias } from '../../content/noticias.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Home.module.css'
import urlPublica from '../../utils/urlPublica.js'

const icones = { capelo: IconeCapelo, livro: IconeLivro, rede: IconeRede }

// Formata 'AAAA-MM-DD' como '20/10/2026' (sem fuso, para não mudar o dia)
function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function Slide({ slide }) {
  const conteudo = (
    <div className={styles.slide}>
      {slide.imagem && <img src={urlPublica(slide.imagem)} alt="" className={styles.slideImagem} />}
      <div className={styles.slideTexto}>
        {slide.legenda && <p className={styles.slideLegenda}>{slide.legenda}</p>}
        {slide.titulo && <p className={styles.slideTitulo}>{slide.titulo}</p>}
      </div>
    </div>
  )
  // O crédito da foto fica fora do link do slide (ele é um link próprio)
  let slideComLink = conteudo
  if (slide.link?.startsWith('http')) {
    slideComLink = (
      <a href={slide.link} target="_blank" rel="noreferrer" className={styles.slideLink}>
        {conteudo}
      </a>
    )
  } else if (slide.link) {
    slideComLink = (
      <Link to={slide.link} className={styles.slideLink}>
        {conteudo}
      </Link>
    )
  }
  return (
    <div className={styles.slideCaixa}>
      {slideComLink}
      <CreditoFoto src={slide.imagem} />
    </div>
  )
}

export default function Home() {
  useTituloPagina(null)

  return (
    <div className="container">
      <h1 className="sr-only">PETs USP – Programa de Educação Tutorial na Universidade de São Paulo</h1>

      {/* 1. Carrossel de destaque */}
      <div className={styles.destaque}>
        <Carousel
          rotulo="Destaques"
          itens={slides}
          intervalo={6000}
          setas={false}
          renderItem={(slide) => <Slide slide={slide} />}
        />
      </div>

      {/* 2. Desde 1979 */}
      <SectionTitle titulo="Desde 1979" subtitulo="na Universidade de São Paulo" />

      {/* 3. História + pilares */}
      <div className={styles.colunas}>
        <section className={styles.historia} aria-labelledby="titulo-historia">
          <h2 id="titulo-historia" className={styles.subtitulo}>
            Rápida História dos PETs dentro da USP
          </h2>
          {historiaCurta.map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
          <Link to="/sobre-o-programa-na-usp" className={`btn btn-cta ${styles.vejaMais}`}>
            Veja mais!
          </Link>
        </section>

        <section aria-labelledby="titulo-pilares">
          <h2 id="titulo-pilares" className={styles.subtitulo}>
            Conheça nossos pilares
          </h2>
          <ul className={styles.pilares}>
            {pilares.map((pilar) => {
              const Icone = icones[pilar.icone]
              return (
                // tabIndex permite ver o destaque do card também pelo teclado
                <li key={pilar.nome} className={styles.pilar} tabIndex={0}>
                  <Icone tamanho={40} strokeWidth={1.6} />
                  <h3>{pilar.nome}</h3>
                  <p>{pilar.texto}</p>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {/* 4. Últimas notícias */}
      <SectionTitle titulo="Últimas Notícias" subtitulo="Jornal da USP sobre o PET" estilo="azul" />
      <ul className={styles.noticias}>
        {noticias.slice(0, 6).map((noticia) => (
          <li key={noticia.titulo + noticia.data}>
            <a href={noticia.link} target="_blank" rel="noreferrer" className={styles.noticia}>
              {noticia.imagem ? (
                <img src={urlPublica(noticia.imagem)} alt="" className={styles.noticiaImagem} />
              ) : (
                <div className={styles.noticiaImagem} aria-hidden="true" />
              )}
              <div className={styles.noticiaTexto}>
                <time dateTime={noticia.data}>{formatarData(noticia.data)}</time>
                <h3>{noticia.titulo}</h3>
                <p>{noticia.resumo}</p>
                <span className={styles.lerMais}>
                  Ler no Jornal da USP <span className="sr-only">(abre em nova aba)</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
