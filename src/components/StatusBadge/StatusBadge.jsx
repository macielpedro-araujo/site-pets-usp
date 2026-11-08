import { STATUS } from '../../services/constantes.js'
import styles from './StatusBadge.module.css'

// Etiqueta colorida com o status do pedido
export default function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{STATUS[status] ?? status}</span>
}
