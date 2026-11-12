import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './CabecalhoArea.module.css'

// Faixa no topo da Área do PET e do Painel: quem está logado + botão de sair
export default function CabecalhoArea({ titulo }) {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  async function aoSair() {
    await sair()
    navigate('/entrar')
  }

  return (
    <>
      <div className={styles.faixa}>
        <div className={`container ${styles.conteudo}`}>
          <p>
            <span className={styles.titulo}>{titulo}</span>
            <span className={styles.usuario}>{usuario?.nome}</span>
          </p>
          <button type="button" className={styles.sair} onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
    </>
  )
}
