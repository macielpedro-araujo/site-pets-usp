import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import DadosPedido from '../../components/DadosPedido/DadosPedido.jsx'
import { STATUS } from '../../services/constantes.js'
import { atualizarStatus, buscar } from '../../services/solicitacoes.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import areaStyles from '../area/Area.module.css'
import styles from './DetalhePainel.module.css'

export default function DetalhePainel() {
  useTituloPagina('Pedido – Painel do CEPETUSP')
  const { id } = useParams()

  const [pedido, setPedido] = useState(undefined) // undefined = carregando; null = não existe
  const [status, setStatus] = useState('')
  const [resposta, setResposta] = useState('')
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscar(id)
      .then((p) => {
        setPedido(p)
        if (p) {
          setStatus(p.status)
          setResposta(p.resposta ?? '')
        }
      })
      .catch((err) => setErro(err.message))
  }, [id])

  async function aoSalvar(e) {
    e.preventDefault()
    setErro('')
    setSalvo(false)
    setSalvando(true)
    try {
      const atualizado = await atualizarStatus(id, status, resposta)
      // Mantém as URLs dos anexos que já tinham sido carregadas
      setPedido({ ...atualizado, anexos: pedido.anexos })
      setSalvo(true)
    } catch (err) {
      setErro(err.message)
    }
    setSalvando(false)
  }

  return (
    <>
      <CabecalhoArea titulo="Painel do CEPETUSP" />
      <div className={`container ${areaStyles.estreito}`}>
        <p className={areaStyles.voltar}>
          <Link to="/painel">← Voltar para todos os pedidos</Link>
        </p>

        {erro && <p className="aviso-erro" role="alert">{erro}</p>}
        {pedido === undefined && !erro && <p>Carregando…</p>}
        {pedido === null && <p className={areaStyles.vazio}>Pedido não encontrado.</p>}

        {pedido && (
          <>
            <DadosPedido pedido={pedido} mostrarResposta={false} />

            <form onSubmit={aoSalvar} className={styles.acoes}>
              <h2>Responder ao PET</h2>
              {salvo && (
                <p className="aviso-sucesso" role="status">
                  Alterações salvas. O PET já pode ver a atualização.
                </p>
              )}

              <fieldset className={styles.status}>
                <legend>Status</legend>
                {Object.entries(STATUS).map(([chave, nome]) => (
                  <label key={chave} className={status === chave ? styles.opcaoAtiva : styles.opcao}>
                    <input
                      type="radio"
                      name="status"
                      value={chave}
                      checked={status === chave}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    {nome}
                  </label>
                ))}
              </fieldset>

              <div className="campo">
                <label htmlFor="resposta">Resposta para o PET</label>
                <textarea
                  id="resposta"
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  placeholder="Ex.: Alteração publicada! Confiram na página do grupo."
                />
              </div>

              <button type="submit" className="btn btn-primario" disabled={salvando}>
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
