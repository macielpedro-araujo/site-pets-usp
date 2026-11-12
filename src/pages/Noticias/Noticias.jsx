import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import NoticiaCard from '../../components/NoticiaCard/NoticiaCard.jsx'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import useDados from '../../hooks/useDados.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { listarNoticias } from '../../services/noticias.js'
import styles from './Noticias.module.css'

// Todas as notícias publicadas
export default function Noticias() {
  useTituloPagina('Notícias')
  const { dados: noticias, carregando, erro } = useDados(() => listarNoticias(), [])

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Notícias' }]} />
      <SectionTitle nivel={1} titulo="Notícias" subtitulo="do PET na USP" estilo="azul" />

      {carregando && <p className="carregando">Carregando…</p>}
      {erro && <p className="aviso-erro">Não foi possível carregar as notícias.</p>}
      {noticias?.length === 0 && <p className={styles.vazio}>Nenhuma notícia publicada ainda.</p>}

      <ul className={styles.grade}>
        {noticias?.map((n) => (
          <li key={n.id}>
            <NoticiaCard noticia={n} />
          </li>
        ))}
      </ul>
    </div>
  )
}
