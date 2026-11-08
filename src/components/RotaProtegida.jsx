import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Só deixa entrar quem está logado com o perfil certo ("pet" ou "cepet").
// Quem não está logado vai para /entrar; quem tem outro perfil vai para a sua própria área.
export default function RotaProtegida({ perfil }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) {
    return <p className="container" style={{ paddingTop: 48 }}>Carregando…</p>
  }

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ voltarPara: location.pathname }} />
  }

  if (usuario.perfil !== perfil) {
    return <Navigate to={usuario.perfil === 'cepet' ? '/painel' : '/area-do-pet'} replace />
  }

  return <Outlet />
}
