import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import useDados from '../../hooks/useDados.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { buscarPet, listarVersoes, restaurarVersao } from '../../services/pets.js'
import { formatarDataHora } from '../../utils/datas.js'
import styles from './Historico.module.css'

// Histórico de versões de um PET, com "Restaurar esta versão" (só CEPETUSP)
export default function Historico() {
  const { slug } = useParams()
  useTituloPagina('Histórico de versões')
  const pet = useDados(() => buscarPet(slug), [slug])
  const versoes = useDados(() => listarVersoes(slug), [slug])
  const [confirmando, setConfirmando] = useState(null) // id da versão aguardando confirmação
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  async function restaurar(id) {
    setErro('')
    setMensagem('')
    try {
      await restaurarVersao(slug, id)
      setMensagem('Versão restaurada! A página já mostra este conteúdo.')
      setConfirmando(null)
      versoes.recarregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <>
      <CabecalhoArea titulo="Painel do CEPETUSP" />
      <div className={`container ${styles.pagina}`}>
        <p className={styles.voltar}>
          <Link to="/painel">← Todos os PETs</Link> · <Link to={`/painel/pets/${slug}`}>Editar</Link> ·{' '}
          <Link to={`/pets/${slug}`} target="_blank">
            Ver a página ↗
          </Link>
        </p>
        <h1>Histórico: {pet.dados?.nome ?? slug}</h1>
        <p className={styles.intro}>
          Cada vez que alguém salva uma seção, uma cópia completa da página é guardada aqui. A versão mais recente
          está no topo.
        </p>

        {mensagem && <p className="aviso-sucesso" role="status">{mensagem}</p>}
        {erro && <p className="aviso-erro" role="alert">{erro}</p>}
        {versoes.carregando && <p className="carregando">Carregando…</p>}
        {versoes.erro && <p className="aviso-erro">{versoes.erro}</p>}
        {versoes.dados?.length === 0 && (
          <p className={styles.vazio}>Esta página ainda não foi editada: ela mostra o conteúdo inicial.</p>
        )}

        <ol className={styles.lista}>
          {versoes.dados?.map((v, i) => (
            <li key={v.id} className={styles.versao}>
              <div>
                <p className={styles.descricao}>
                  {v.descricao}
                  {i === 0 && <span className={styles.atual}>atual</span>}
                </p>
                <p className={styles.quando}>
                  {v.editadoEm ? `${formatarDataHora(v.editadoEm)} · ${v.editadoPor}` : v.editadoPor}
                </p>
              </div>
              {i > 0 &&
                (confirmando === v.id ? (
                  <div className={styles.confirmar}>
                    <span>Substituir a página por esta versão?</span>
                    <button type="button" className="btn btn-primario" onClick={() => restaurar(v.id)}>
                      Sim, restaurar
                    </button>
                    <button type="button" className="btn btn-secundario" onClick={() => setConfirmando(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-secundario" onClick={() => setConfirmando(v.id)}>
                    Restaurar esta versão
                  </button>
                ))}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
