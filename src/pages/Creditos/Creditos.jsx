import { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { listarCreditos } from '../../services/creditos.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import urlPublica from '../../utils/urlPublica.js'
import styles from './Creditos.module.css'

// Lista as fotos de terceiros com autor e licença (exigido pelas licenças CC BY e CC BY-SA)
export default function Creditos() {
  useTituloPagina('Créditos das imagens')
  const [creditos, setCreditos] = useState(null)

  useEffect(() => {
    listarCreditos().then(setCreditos)
  }, [])

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Créditos das imagens' }]} />
      <SectionTitle nivel={1} titulo="Créditos das imagens" subtitulo="fotos usadas neste site" />

      <p className={styles.intro}>
        As fotos dos campi e das unidades vêm do Wikimedia Commons e são usadas de acordo com as licenças
        indicadas. As imagens de cada PET são enviadas pelo próprio grupo.
      </p>

      {creditos === null && <p>Carregando…</p>}

      <ul className={styles.lista}>
        {creditos?.map((c) => (
          <li key={c.arquivo} className={styles.item}>
            {c.arquivo.endsWith('.jpg') ? (
              <img src={urlPublica(c.arquivo)} alt="" className={styles.miniatura} loading="lazy" />
            ) : (
              <div className={styles.miniatura} aria-hidden="true" />
            )}
            <div>
              <p className={styles.titulo}>{c.titulo}</p>
              <p>
                <strong>Autor:</strong> {c.autor}
              </p>
              <p>
                <strong>Licença:</strong>{' '}
                {c.urlLicenca ? (
                  <a href={c.urlLicenca} target="_blank" rel="noreferrer">
                    {c.licenca}
                  </a>
                ) : (
                  c.licenca
                )}
              </p>
              <p>
                <a href={c.urlOrigem} target="_blank" rel="noreferrer">
                  Ver a origem <span className="sr-only">(abre em nova aba)</span>
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
