import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { comoFunciona, educacaoTutorial, historia } from '../../content/sobre.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Sobre.module.css'

export default function Sobre() {
  useTituloPagina('Sobre o programa na USP')

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Sobre o programa na USP' }]} />
      <SectionTitle
        nivel={1}
        titulo="Sobre o Programa de Educação Tutorial"
        subtitulo="na Universidade de São Paulo"
      />

      <section className={styles.secao}>
        <h2>História do PET na USP</h2>
        {historia.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className={`${styles.secao} ${styles.comImagem}`}>
        <div>
          <h2>O que é Educação Tutorial?</h2>
          {educacaoTutorial.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {/* TODO: foto real de um encontro dos PETs */}
        <div className={styles.imagem} role="img" aria-label="Imagem ilustrativa (em breve)">
          <span>Imagem em breve</span>
        </div>
      </section>

      <section className={styles.secao}>
        <h2>Como funciona um PET?</h2>
        <p>{comoFunciona.introducao}</p>
        <ul>
          {comoFunciona.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.secao}>
        <h2>Organograma</h2>
        {/* TODO: imagem do organograma do programa na USP */}
        <div className={styles.organograma} role="img" aria-label="Organograma (em breve)">
          <span>Organograma em breve</span>
        </div>
      </section>
    </div>
  )
}
