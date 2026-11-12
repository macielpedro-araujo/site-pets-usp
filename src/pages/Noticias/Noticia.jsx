import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import CreditoFoto from '../../components/CreditoFoto/CreditoFoto.jsx'
import useDados from '../../hooks/useDados.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { urlImagem } from '../../services/imagens.js'
import { buscarNoticia } from '../../services/noticias.js'
import { formatarDataCurta } from '../../utils/datas.js'
import NotFound from '../NotFound/NotFound.jsx'
import styles from './Noticias.module.css'

// Página de uma notícia. O texto é simples: cada linha em branco separa um parágrafo.
export default function Noticia() {
  const { id } = useParams()
  const { dados: noticia, carregando, erro } = useDados(() => buscarNoticia(id), [id])
  useTituloPagina(noticia?.titulo ?? 'Notícia')

  if (carregando) return <p className="container carregando">Carregando…</p>
  if (erro) return <p className="container aviso-erro">Não foi possível carregar a notícia.</p>
  if (!noticia) return <NotFound />

  const paragrafos = (noticia.texto ?? '').split(/\n\s*\n/).filter((p) => p.trim())

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Notícias', para: '/noticias' }, { texto: noticia.titulo }]} />
      <article className={styles.artigo}>
        <time dateTime={noticia.dataPublicacao} className={styles.data}>
          {formatarDataCurta(noticia.dataPublicacao)}
        </time>
        <h1>{noticia.titulo}</h1>
        {noticia.resumo && <p className={styles.resumo}>{noticia.resumo}</p>}
        {noticia.imagem && (
          <div className={styles.imagemCaixa}>
            <img src={urlImagem(noticia.imagem)} alt="" className={styles.imagem} />
            <CreditoFoto src={noticia.imagem} />
          </div>
        )}
        {paragrafos.map((p, i) => (
          <p key={i} className={styles.paragrafo}>
            {p}
          </p>
        ))}
        {noticia.linkExterno && (
          <p>
            <a href={noticia.linkExterno} target="_blank" rel="noreferrer" className="btn btn-primario">
              Leia mais <span className="sr-only">(abre em nova aba)</span> ↗
            </a>
          </p>
        )}
        <p className={styles.voltar}>
          <Link to="/noticias">← Todas as notícias</Link>
        </p>
      </article>
    </div>
  )
}
