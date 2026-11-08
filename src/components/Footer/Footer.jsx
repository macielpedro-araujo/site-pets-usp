import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.rodape}>
      <div className={`container ${styles.bloco}`}>
        <div>
          <p className={styles.nome}>Programa de Educação Tutorial</p>
          <p className={styles.sub}>Na Universidade de São Paulo</p>
        </div>
        <nav aria-label="Links do rodapé">
          <ul className={styles.links}>
            <li><Link to="/todos-os-pets-da-usp">Todos os PETs da USP</Link></li>
            <li><Link to="/sobre-o-programa-na-usp">Sobre o programa na USP</Link></li>
            <li><Link to="/institucional">Institucional</Link></li>
            <li><Link to="/entrar">Área dos PETs</Link></li>
          </ul>
        </nav>
        <p className={styles.mantido}>
          Mantido pelo PET Computação ICMC-USP (CEPETUSP)
        </p>
      </div>
      {/* Faixas coloridas do Figma: teal, branco fino e amarelo */}
      <div className={styles.faixaTeal} />
      <div className={styles.faixaAmarela} />
    </footer>
  )
}
