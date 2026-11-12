import { useId, useState } from 'react'
import { enviarImagem, urlImagem } from '../../services/imagens.js'
import styles from './Editor.module.css'

export const AJUDA_IMAGEM = 'Imagens JPEG, PNG ou WebP, até 5 MB. Elas são reduzidas automaticamente.'

// Campo de upload de imagem com prévia. A imagem é reduzida no navegador e enviada na hora;
// o caminho devolvido vai para o formulário (e só fica no ar quando o bloco for salvo).
// dono: "pets/<slug>" ou "noticias". formato: "paisagem", "quadrado" ou "logo" (só a prévia muda).
// mostrarAjuda: false em listas, para a dica de formato não se repetir em cada item
export default function CampoImagem({ rotulo, valor, aoMudar, dono, ladoMaximo = 1600, formato = 'paisagem', mostrarAjuda = true }) {
  const id = useId()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function aoEscolher(e) {
    const arquivo = e.target.files[0]
    e.target.value = '' // permite escolher o mesmo arquivo de novo
    if (!arquivo) return
    setErro('')
    setEnviando(true)
    try {
      aoMudar(await enviarImagem(dono, arquivo, ladoMaximo))
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.campoImagem}>
      <span className={styles.rotulo}>{rotulo}</span>
      <div className={styles.imagemLinha}>
        {valor ? (
          <img src={urlImagem(valor)} alt="" className={`${styles.previa} ${styles[formato]}`} />
        ) : (
          <div className={`${styles.previa} ${styles[formato]} ${styles.semImagem}`}>sem imagem</div>
        )}
        <div className={styles.imagemBotoes}>
          <label htmlFor={id} className="btn btn-secundario">
            {enviando ? 'Enviando…' : valor ? 'Trocar' : 'Escolher imagem'}
          </label>
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={aoEscolher}
            disabled={enviando}
            className="sr-only"
          />
          {valor && (
            <button type="button" className={styles.linkBotao} onClick={() => aoMudar(null)}>
              Remover
            </button>
          )}
        </div>
      </div>
      {mostrarAjuda && <span className="campo-ajuda">{AJUDA_IMAGEM}</span>}
      {erro && <span className="campo-erro">{erro}</span>}
    </div>
  )
}
