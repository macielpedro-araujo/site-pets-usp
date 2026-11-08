import { MODO_BETA } from '../../config.js'
import styles from './FaixaBeta.module.css'

// Faixa fina no topo de todas as páginas enquanto o site estiver em beta
export default function FaixaBeta() {
  if (!MODO_BETA) return null
  return (
    <p className={styles.faixa}>
      Versão de demonstração — conteúdos ilustrativos, sujeitos a validação pelos grupos PET.
    </p>
  )
}
