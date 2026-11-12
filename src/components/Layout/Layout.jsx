import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header.jsx'
import Footer from '../Footer/Footer.jsx'
import styles from './Layout.module.css'

// Estrutura comum a todas as páginas
export default function Layout() {
  const { pathname } = useLocation()

  // Ao trocar de página, volta para o topo
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#conteudo" className={styles.pular}>
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
