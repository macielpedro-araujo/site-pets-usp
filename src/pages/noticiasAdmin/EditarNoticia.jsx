import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import CampoImagem from '../../components/Editor/CampoImagem.jsx'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { buscarNoticia, salvarNoticia } from '../../services/noticias.js'
import styles from './NoticiasAdmin.module.css'

function hoje() {
  return new Date().toISOString().slice(0, 10)
}

const NOVA = {
  titulo: '',
  resumo: '',
  texto: '',
  imagem: null,
  linkExterno: '',
  dataPublicacao: hoje(),
  publicada: true,
}

// Formulário de notícia: nova (/noticias-admin/nova) ou edição (/noticias-admin/:id)
export default function EditarNoticia() {
  const { id } = useParams()
  const ehNova = !id
  useTituloPagina(ehNova ? 'Nova notícia' : 'Editar notícia')
  const navigate = useNavigate()

  const [noticia, setNoticia] = useState(ehNova ? NOVA : null)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (ehNova) return
    buscarNoticia(id)
      .then((n) => (n ? setNoticia({ ...n, linkExterno: n.linkExterno ?? '' }) : setErro('Notícia não encontrada.')))
      .catch((e) => setErro(e.message))
  }, [id, ehNova])

  const mudar = (campo) => (valor) => setNoticia({ ...noticia, [campo]: valor })

  async function aoEnviar(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await salvarNoticia({
        ...noticia,
        titulo: noticia.titulo.trim(),
        resumo: noticia.resumo.trim(),
        texto: noticia.texto.trim(),
        linkExterno: noticia.linkExterno.trim() || null,
      })
      navigate('/noticias-admin')
    } catch (err) {
      setErro(err.message)
      setSalvando(false)
    }
  }

  return (
    <>
      <CabecalhoArea titulo="Notícias" />
      <div className={`container ${styles.pagina}`}>
        <p className={styles.voltar}>
          <Link to="/noticias-admin">← Todas as notícias</Link>
        </p>
        <h1>{ehNova ? 'Nova notícia' : 'Editar notícia'}</h1>

        {erro && <p className="aviso-erro" role="alert">{erro}</p>}
        {!noticia && !erro && <p className="carregando">Carregando…</p>}

        {noticia && (
          <form onSubmit={aoEnviar} noValidate className={styles.formulario}>
            <div className="campo">
              <label htmlFor="n-titulo">Título *</label>
              <input id="n-titulo" maxLength={160} value={noticia.titulo} onChange={(e) => mudar('titulo')(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="n-resumo">Resumo</label>
              <textarea
                id="n-resumo"
                rows={2}
                className={styles.textareaCurta}
                value={noticia.resumo}
                onChange={(e) => mudar('resumo')(e.target.value)}
              />
              <span className="campo-ajuda">Aparece no card da página inicial (uma ou duas frases).</span>
            </div>
            <div className="campo">
              <label htmlFor="n-texto">Texto</label>
              <textarea id="n-texto" value={noticia.texto} onChange={(e) => mudar('texto')(e.target.value)} />
              <span className="campo-ajuda">Texto simples. Deixe uma linha em branco entre os parágrafos.</span>
            </div>
            <CampoImagem rotulo="Imagem" valor={noticia.imagem} aoMudar={mudar('imagem')} dono="noticias" />
            <div className="campo">
              <label htmlFor="n-link">Link externo (opcional)</label>
              <input
                id="n-link"
                type="url"
                placeholder="https://"
                value={noticia.linkExterno}
                onChange={(e) => mudar('linkExterno')(e.target.value)}
              />
              <span className="campo-ajuda">Se a notícia tiver só o link (sem texto), o card abre o link direto.</span>
            </div>
            <div className="campo">
              <label htmlFor="n-data">Data *</label>
              <input
                id="n-data"
                type="date"
                value={noticia.dataPublicacao}
                onChange={(e) => mudar('dataPublicacao')(e.target.value)}
                className={styles.campoData}
              />
            </div>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={noticia.publicada} onChange={(e) => mudar('publicada')(e.target.checked)} />
              Publicada (desmarque para salvar como rascunho)
            </label>

            <div className={styles.botoes}>
              <button type="submit" className="btn btn-primario" disabled={salvando}>
                {salvando ? 'Salvando…' : 'Salvar notícia'}
              </button>
              <Link to="/noticias-admin" className="btn btn-secundario">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
