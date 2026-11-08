import { Link } from 'react-router-dom'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './NotFound.module.css'

export default function NotFound() {
  useTituloPagina('Página não encontrada')

  return (
    <div className={`container ${styles.pagina}`}>
      <p className={styles.codigo}>404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço que você tentou abrir não existe ou mudou de lugar.</p>
      <div className={styles.acoes}>
        <Link to="/" className="btn btn-primario">Ir para o início</Link>
        <Link to="/todos-os-pets-da-usp" className="btn btn-secundario">Ver todos os PETs</Link>
      </div>
    </div>
  )
}
