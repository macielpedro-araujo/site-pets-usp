import styles from './EstadoVazio.module.css'

// Caixa discreta para seções que o grupo ainda não preencheu
export default function EstadoVazio({ children = 'Esta seção ainda está sendo preenchida pelo grupo.' }) {
  return <p className={styles.vazio}>{children}</p>
}
