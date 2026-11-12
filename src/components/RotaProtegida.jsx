import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import areaDoPerfil from '../utils/areaDoPerfil.js'

// Só deixa entrar quem está logado com um dos perfis permitidos ("pet", "cepet" ou "secretaria").
// Quem não está logado vai para /entrar; quem tem outro perfil vai para a sua própria área.
// Atenção: isto só esconde a tela. Quem garante a segurança são as regras dos services
// (e, no futuro, do servidor).
export default function RotaProtegida({ perfis }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) {
    return <p className="container" style={{ paddingTop: 48 }}>Carregando…</p>
  }

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ voltarPara: location.pathname }} />
  }

  if (!perfis.includes(usuario.perfil)) {
    return <Navigate to={areaDoPerfil(usuario.perfil)} replace />
  }

  return <Outlet />
}
