import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { recuperarSenha } from '../../services/auth.js'
import { CONTAS_DEMO, SENHA_DEMO } from '../../services/demo/authDemo.js'
import { modoDemo } from '../../services/supabaseClient.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Entrar.module.css'

function destinoDoPerfil(perfil) {
  return perfil === 'cepet' ? '/painel' : '/area-do-pet'
}

export default function Entrar() {
  useTituloPagina('Entrar')
  const { usuario, entrar, sair } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(e) {
    e.preventDefault()
    setErro('')
    setAviso('')
    if (!email || !senha) {
      setErro('Preencha o e-mail e a senha.')
      return
    }
    setEnviando(true)
    try {
      const u = await entrar(email, senha)
      // Volta para a página que a pessoa tentou abrir, se for da área dela
      const voltarPara = location.state?.voltarPara
      const destino = destinoDoPerfil(u.perfil)
      navigate(voltarPara?.startsWith(destino) ? voltarPara : destino, { replace: true })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  async function esqueciSenha() {
    setErro('')
    setAviso('')
    if (!email) {
      setErro('Digite seu e-mail no campo acima e clique de novo em "Esqueci minha senha".')
      return
    }
    try {
      await recuperarSenha(email)
      setAviso('Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.')
    } catch (err) {
      setErro(err.message)
    }
  }

  // Preenche o formulário com uma conta de teste (só no modo demo)
  function usarConta(conta) {
    setEmail(conta.email)
    setSenha(SENHA_DEMO)
    setErro('')
  }

  if (usuario) {
    return (
      <div className={`container ${styles.pagina}`}>
        <div className={styles.cartao}>
          <h1>Você já entrou</h1>
          <p>
            Conectado como <strong>{usuario.nome}</strong> ({usuario.email}).
          </p>
          <div className={styles.acoes}>
            <Link to={destinoDoPerfil(usuario.perfil)} className="btn btn-primario">
              {usuario.perfil === 'cepet' ? 'Ir para o painel' : 'Ir para a Área do PET'}
            </Link>
            <button type="button" className="btn btn-secundario" onClick={sair}>
              Sair
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`container ${styles.pagina}`}>
      <div className={styles.cartao}>
        <h1>Área dos PETs</h1>
        <p className={styles.intro}>
          Entre com a conta do seu PET para pedir alterações na página do grupo e acompanhar os pedidos.
        </p>

        <form onSubmit={aoEnviar} noValidate>
          {erro && <p className="aviso-erro" role="alert">{erro}</p>}
          {aviso && <p className="aviso-sucesso" role="status">{aviso}</p>}

          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`btn btn-primario ${styles.entrar}`} disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
          <button type="button" className={styles.esqueci} onClick={esqueciSenha}>
            Esqueci minha senha
          </button>
        </form>

        <p className={styles.nota}>
          Não há cadastro aberto: as contas de cada PET são criadas pelo CEPETUSP (PET Computação ICMC-USP).
        </p>
      </div>

      {modoDemo && (
        <aside className={styles.demo} aria-labelledby="titulo-demo">
          <h2 id="titulo-demo">Contas de teste</h2>
          <p>
            Senha de todas: <code>{SENHA_DEMO}</code>. Clique numa conta para preencher o formulário.
          </p>
          <ul>
            {CONTAS_DEMO.map((conta) => (
              <li key={conta.email}>
                <button type="button" onClick={() => usarConta(conta)}>
                  <strong>{conta.email}</strong>
                  <span>{conta.perfil === 'cepet' ? 'CEPETUSP (painel)' : conta.nome}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
