import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { IconeLinkExterno } from '../../components/icons/Icones.jsx'
import { contato, documentos, papeis } from '../../content/institucional.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Institucional.module.css'

export default function Institucional() {
  useTituloPagina('Institucional')

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Institucional' }]} />
      <SectionTitle nivel={1} titulo="Institucional" subtitulo="O PET na estrutura da USP" />

      <div className={styles.papeis}>
        {papeis.map((papel) => (
          <section key={papel.titulo} className={styles.card}>
            <h2>{papel.titulo}</h2>
            <p>{papel.texto}</p>
          </section>
        ))}
      </div>

      <section className={styles.secao}>
        <h2>Documentos</h2>
        <ul className={styles.documentos}>
          {documentos.map((doc) => (
            <li key={doc.nome}>
              {doc.link ? (
                <a href={doc.link} target="_blank" rel="noreferrer">
                  {doc.nome}
                  <IconeLinkExterno tamanho={16} />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              ) : (
                <span>
                  {doc.nome} <em className={styles.emBreve}>(link em breve)</em>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.secao}>
        <h2>Contato</h2>
        <p>{contato.texto}</p>
        {contato.email && <a href={`mailto:${contato.email}`}>{contato.email}</a>}
      </section>
    </div>
  )
}
