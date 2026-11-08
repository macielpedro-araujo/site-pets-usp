import { useRef } from 'react'
import { IconeSetaDireita, IconeSetaEsquerda } from '../icons/Icones.jsx'
import styles from './CarrosselRolagem.module.css'

// Faixa horizontal com vários itens visíveis e setas para rolar.
// No celular dá para arrastar com o dedo (rolagem nativa do navegador).
export default function CarrosselRolagem({ children, rotulo }) {
  const trilho = useRef(null)

  function rolar(direcao) {
    const largura = trilho.current.clientWidth
    trilho.current.scrollBy({ left: direcao * largura * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={styles.carrossel}>
      <button type="button" className={styles.seta} onClick={() => rolar(-1)}>
        <IconeSetaEsquerda />
        <span className="sr-only">Rolar para a esquerda</span>
      </button>
      <ul className={styles.trilho} ref={trilho} aria-label={rotulo}>
        {children}
      </ul>
      <button type="button" className={styles.seta} onClick={() => rolar(1)}>
        <IconeSetaDireita />
        <span className="sr-only">Rolar para a direita</span>
      </button>
    </div>
  )
}
