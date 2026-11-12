import { useState } from 'react'
import { Link } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import useDados from '../../hooks/useDados.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { excluirNoticia, listarNoticias } from '../../services/noticias.js'
import { formatarDataCurta } from '../../utils/datas.js'
import styles from './NoticiasAdmin.module.css'

// Lista de notícias para a secretaria do PET USP (e o CEPETUSP), com rascunhos (SPEC §2.5)
export default function NoticiasAdmin() {
  useTituloPagina('Notícias')
  const noticias = useDados(() => listarNoticias({ incluirRascunhos: true }), [])
  const [confirmando, setConfirmando] = useState(null) // id aguardando confirmação de exclusão
  const [aviso, setAviso] = useState('')
  const [erro, setErro] = useState('')

  async function excluir(noticia) {
    setErro('')
    try {
      await excluirNoticia(noticia.id)
      setAviso(`Notícia "${noticia.titulo}" excluída.`)
      setConfirmando(null)
      noticias.recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <CabecalhoArea titulo="Notícias" />
      <div className={`container ${styles.pagina}`}>
        <div className={styles.topo}>
          <div>
            <h1>Notícias</h1>
            <p className={styles.intro}>As 6 mais recentes já publicadas aparecem na página inicial.</p>
          </div>
          <Link to="/noticias-admin/nova" className="btn btn-primario">
            + Nova notícia
          </Link>
        </div>

        {aviso && <p className="aviso-sucesso" role="status">{aviso}</p>}
        {erro && <p className="aviso-erro" role="alert">{erro}</p>}
        {noticias.carregando && <p className="carregando">Carregando…</p>}
        {noticias.dados?.length === 0 && <p className={styles.vazio}>Nenhuma notícia ainda.</p>}

        <ul className={styles.lista}>
          {noticias.dados?.map((n) => (
            <li key={n.id} className={styles.item}>
              <div className={styles.info}>
                <span className={n.publicada ? styles.publicada : styles.rascunho}>
                  {n.publicada ? 'Publicada' : 'Rascunho'}
                </span>
                <p className={styles.titulo}>{n.titulo}</p>
                <p className={styles.data}>
                  {formatarDataCurta(n.dataPublicacao)} · {n.autor}
                </p>
              </div>
              {confirmando === n.id ? (
                <div className={styles.acoes}>
                  <span className={styles.pergunta}>Excluir esta notícia?</span>
                  <button type="button" className={`btn ${styles.perigo}`} onClick={() => excluir(n)}>
                    Sim, excluir
                  </button>
                  <button type="button" className="btn btn-secundario" onClick={() => setConfirmando(null)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className={styles.acoes}>
                  <Link to={`/noticias-admin/${n.id}`} className="btn btn-secundario">
                    Editar
                  </Link>
                  <button type="button" className={`btn ${styles.excluir}`} onClick={() => setConfirmando(n.id)}>
                    Excluir
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
