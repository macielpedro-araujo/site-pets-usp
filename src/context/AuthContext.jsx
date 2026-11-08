import { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../services/auth.js'

const AuthContext = createContext(null)

// Guarda quem está logado e deixa isso disponível para qualquer componente
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Ao abrir o site, verifica se já existe uma sessão salva
    auth.usuarioAtual().then((u) => {
      setUsuario(u)
      setCarregando(false)
    })
    // E acompanha entradas e saídas
    return auth.aoMudarSessao((u) => setUsuario(u))
  }, [])

  async function entrar(email, senha) {
    const u = await auth.entrar(email, senha)
    setUsuario(u)
    return u
  }

  async function sair() {
    await auth.sair()
    setUsuario(null)
  }

  const valor = {
    usuario,
    perfil: usuario?.perfil ?? null,
    petSlug: usuario?.petSlug ?? null,
    carregando,
    entrar,
    sair,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
