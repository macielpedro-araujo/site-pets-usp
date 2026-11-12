import { Link } from 'react-router-dom'
import { urlImagem } from '../../services/imagens.js'
import { formatarDataCurta } from '../../utils/datas.js'
import styles from './NoticiaCard.module.css'

// Card de uma notícia. Abre a página da notícia; se ela tiver só link externo (sem texto),
// abre o link numa nova aba.
export default function NoticiaCard({ noticia }) {
  const soLinkExterno = noticia.linkExterno && !noticia.texto?.trim()

  const conteudo = (
    <>
      {noticia.imagem ? (
        <img src={urlImagem(noticia.imagem)} alt="" className={styles.imagem} loading="lazy" />
      ) : (
        <div className={styles.imagem} aria-hidden="true" />
      )}
      <div className={styles.texto}>
        <time dateTime={noticia.dataPublicacao}>{formatarDataCurta(noticia.dataPublicacao)}</time>
        <h3>{noticia.titulo}</h3>
        {noticia.resumo && <p>{noticia.resumo}</p>}
        <span className={styles.lerMais}>
          {soLinkExterno ? (
            <>
              Ler a notícia <span className="sr-only">(abre em nova aba)</span>
            </>
          ) : (
            'Ler mais'
          )}
        </span>
      </div>
    </>
  )

  if (soLinkExterno) {
    return (
      <a href={noticia.linkExterno} target="_blank" rel="noreferrer" className={styles.card}>
        {conteudo}
      </a>
    )
  }
  return (
    <Link to={`/noticias/${noticia.id}`} className={styles.card}>
      {conteudo}
    </Link>
  )
}
