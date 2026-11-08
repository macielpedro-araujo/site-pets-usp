import { useEffect, useRef, useState } from 'react'
import { IconeSetaDireita, IconeSetaEsquerda } from '../icons/Icones.jsx'
import styles from './Carousel.module.css'

// Carrossel simples: mostra um item por vez, com setas, pontinhos e swipe.
// Props:
//  - itens: lista de qualquer coisa
//  - renderItem: função que desenha um item
//  - intervalo: em ms; se informado, troca sozinho (pausa com o mouse em cima)
//  - rotulo: nome do carrossel para leitores de tela
export default function Carousel({ itens, renderItem, intervalo, rotulo, setas = true }) {
  const [atual, setAtual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const toqueInicio = useRef(null)
  const total = itens.length

  const irPara = (indice) => setAtual((indice + total) % total)

  // Troca automática
  useEffect(() => {
    if (!intervalo || pausado || total < 2) return
    const timer = setInterval(() => setAtual((a) => (a + 1) % total), intervalo)
    return () => clearInterval(timer)
  }, [intervalo, pausado, total])

  if (total === 0) return null

  // Swipe no celular: compara onde o dedo começou e terminou
  function aoTocar(e) {
    toqueInicio.current = e.touches[0].clientX
  }
  function aoSoltar(e) {
    if (toqueInicio.current === null) return
    const diferenca = e.changedTouches[0].clientX - toqueInicio.current
    if (diferenca > 50) irPara(atual - 1)
    if (diferenca < -50) irPara(atual + 1)
    toqueInicio.current = null
  }

  return (
    <section
      className={styles.carrossel}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className={styles.janela} onTouchStart={aoTocar} onTouchEnd={aoSoltar}>
        <div className={styles.trilho} style={{ transform: `translateX(-${atual * 100}%)` }}>
          {itens.map((item, i) => (
            <div
              key={i}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== atual}
              inert={i !== atual}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>

        {setas && total > 1 && (
          <>
            <button type="button" className={`${styles.seta} ${styles.esquerda}`} onClick={() => irPara(atual - 1)}>
              <IconeSetaEsquerda />
              <span className="sr-only">Anterior</span>
            </button>
            <button type="button" className={`${styles.seta} ${styles.direita}`} onClick={() => irPara(atual + 1)}>
              <IconeSetaDireita />
              <span className="sr-only">Próximo</span>
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className={styles.pontos}>
          {itens.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === atual ? styles.pontoAtivo : styles.ponto}
              aria-label={`Ir para o item ${i + 1}`}
              aria-current={i === atual}
              onClick={() => irPara(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
