import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

// Recebe uma lista de { texto, para }. O último item é a página atual (sem link).
export default function Breadcrumb({ itens }) {
  return (
    <nav aria-label="Você está em" className={styles.breadcrumb}>
      <ol>
        <li>
          <Link to="/">Início</Link>
        </li>
        {itens.map((item, i) => {
          const ultimo = i === itens.length - 1
          return (
            <li key={item.texto}>
              {ultimo || !item.para ? (
                <span aria-current={ultimo ? 'page' : undefined}>{item.texto}</span>
              ) : (
                <Link to={item.para}>{item.texto}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
