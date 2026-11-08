import { Link } from 'react-router-dom'
import styles from './PetCard.module.css'
import urlPublica from '../../utils/urlPublica.js'

// Card com o logo de um PET. Abre a página do PET ou o site externo dele.
export default function PetCard({ pet }) {
  const conteudo = <img src={urlPublica(pet.logo)} alt={pet.nome} className={styles.logo} loading="lazy" />

  if (pet.siteExterno) {
    return (
      <a
        href={pet.siteExterno}
        target="_blank"
        rel="noreferrer"
        className={styles.card}
        aria-label={`${pet.nome} (abre o site do grupo em nova aba)`}
      >
        {conteudo}
      </a>
    )
  }

  return (
    <Link to={`/pets/${pet.slug}`} className={styles.card} aria-label={pet.nome}>
      {conteudo}
    </Link>
  )
}
