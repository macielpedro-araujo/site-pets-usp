import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './CabecalhoArea.module.css'

// Atalhos de cada perfil dentro da área logada
const ATALHOS = {
  cepet: [
    { para: '/painel', texto: 'PETs' },
    { para: '/noticias-admin', texto: 'Notícias' },
  ],
}

// Faixa no topo das telas logadas: título, quem está logado, atalhos e botão de sair
export default function CabecalhoArea({ titulo }) {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()
  const atalhos = ATALHOS[usuario?.perfil] ?? []

  async function aoSair() {
    await sair()
    navigate('/entrar')
  }

  return (
    <div className={styles.faixa}>
      <div className={`container ${styles.conteudo}`}>
        <p>
          <span className={styles.titulo}>{titulo}</span>
          <span className={styles.usuario}>{usuario?.nome}</span>
        </p>
        <div className={styles.direita}>
          {atalhos.length > 0 && (
            <nav aria-label="Atalhos da área logada" className={styles.atalhos}>
              {atalhos.map((a) => (
                <NavLink key={a.para} to={a.para} end={a.para === '/painel'}>
                  {a.texto}
                </NavLink>
              ))}
            </nav>
          )}
          <button type="button" className={styles.sair} onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
