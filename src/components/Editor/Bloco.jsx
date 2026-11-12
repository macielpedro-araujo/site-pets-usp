import { useState } from 'react'
import styles from './Editor.module.css'

const TEXTO_LGPD = 'Confirmo que as pessoas identificadas autorizaram a publicação de nome e imagem.'

// Uma seção recolhível do editor, com o próprio botão "Salvar".
// aoSalvar: função assíncrona que grava os dados (se der erro, a mensagem aparece aqui).
// exigeLgpd: pede a confirmação de autorização de nome e imagem antes de salvar (SPEC §2.4).
export default function Bloco({ titulo, descricao, aoSalvar, exigeLgpd = false, abertoNoInicio = false, children }) {
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [lgpd, setLgpd] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setMensagem('')
    setErro('')
    if (exigeLgpd && !lgpd) {
      setErro('Marque a confirmação de autorização de nome e imagem para salvar.')
      return
    }
    setSalvando(true)
    try {
      await aoSalvar()
      setMensagem('Salvo! Já está no ar.')
      setLgpd(false)
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <details className={styles.bloco} open={abertoNoInicio}>
      <summary className={styles.blocoTitulo}>{titulo}</summary>
      <form className={styles.blocoCorpo} onSubmit={salvar} noValidate>
        {descricao && <p className={styles.blocoDescricao}>{descricao}</p>}
        {children}

        {exigeLgpd && (
          <label className={styles.lgpd}>
            <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} />
            <span>{TEXTO_LGPD}</span>
          </label>
        )}

        <div className={styles.blocoRodape}>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
          <div aria-live="polite">
            {mensagem && <p className={styles.salvo}>{mensagem}</p>}
            {erro && (
              <p className={styles.erro} role="alert">
                {erro}
              </p>
            )}
          </div>
        </div>
      </form>
    </details>
  )
}
