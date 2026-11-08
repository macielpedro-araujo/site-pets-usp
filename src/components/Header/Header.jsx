import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { IconeMenu, IconeFechar } from '../icons/Icones.jsx'
import styles from './Header.module.css'
import urlPublica from '../../utils/urlPublica.js'

const links = [
  { para: '/todos-os-pets-da-usp', texto: 'Todos os PETs da USP' },
  { para: '/sobre-o-programa-na-usp', texto: 'Sobre o programa na USP' },
  { para: '/institucional', texto: 'Institucional' },
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const { perfil } = useAuth()

  // "Área dos PETs" leva ao lugar certo conforme quem está logado
  let linkArea = '/entrar'
  if (perfil === 'pet') linkArea = '/area-do-pet'
  if (perfil === 'cepet') linkArea = '/painel'

  const fecharMenu = () => setMenuAberto(false)

  return (
    <header>
      <div className={styles.topo}>
        <div className={`container ${styles.marca}`}>
          <Link to="/" className={styles.logoLink} onClick={fecharMenu}>
            <img
              src={urlPublica('/brand/logo-pet-usp.png')}
              alt="PET USP – página inicial"
              className={styles.logo}
              width="160"
              height="50"
            />
            <span className={styles.titulos}>
              <span className={styles.titulo}>Programa de Educação Tutorial</span>
              <span className={styles.subtitulo}>Na Universidade de São Paulo</span>
            </span>
          </Link>

          <button
            type="button"
            className={styles.botaoMenu}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <IconeFechar /> : <IconeMenu />}
            <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      <nav className={styles.barra} aria-label="Navegação principal">
        <div
          id="menu-principal"
          className={`container ${styles.menu} ${menuAberto ? styles.menuAberto : ''}`}
        >
          <ul className={styles.lista}>
            {links.map((link) => (
              <li key={link.para}>
                <NavLink
                  to={link.para}
                  onClick={fecharMenu}
                  className={({ isActive }) => (isActive ? `${styles.link} ${styles.ativo}` : styles.link)}
                >
                  {link.texto}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to={linkArea} className={styles.linkArea} onClick={fecharMenu}>
            Área dos PETs
          </Link>
        </div>
      </nav>
    </header>
  )
}
