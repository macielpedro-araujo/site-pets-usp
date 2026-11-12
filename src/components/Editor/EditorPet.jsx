import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buscarPet, atualizarPet } from '../../services/pets.js'
import { formatarDataHora } from '../../utils/datas.js'
import {
  BlocoContato,
  BlocoEstrutural,
  BlocoFotoGrupo,
  BlocoGaleria,
  BlocoIdentidade,
  BlocoMembros,
  BlocoProjetos,
  BlocoSobre,
  BlocoTutor,
} from './Blocos.jsx'
import styles from './Editor.module.css'

// Editor completo da página de um PET. Usado na Área do PET (o próprio PET) e no Painel
// (CEPETUSP, que também pode mudar os dados estruturais).
export default function EditorPet({ slug, podeEditarEstrutura = false }) {
  const [pet, setPet] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    buscarPet(slug)
      .then((p) => {
        if (!ativo) return
        if (p) setPet(p)
        else setErro('PET não encontrado.')
      })
      .catch((e) => ativo && setErro(e.message))
    return () => {
      ativo = false
    }
  }, [slug])

  // Cada bloco chama esta função; o PET atualizado volta do serviço
  async function salvar(campos, descricao) {
    setPet(await atualizarPet(slug, campos, descricao))
  }

  if (erro) return <p className="aviso-erro">{erro}</p>
  if (!pet) return <p className="carregando">Carregando…</p>

  const dono = `pets/${slug}`
  const comuns = { pet, salvar, dono } // o que todo bloco recebe

  return (
    <div className={styles.editor}>
      <div className={styles.topo}>
        <div>
          <h1 className={styles.titulo}>{pet.nome}</h1>
          <p className={styles.ultima}>
            {pet.atualizadoEm
              ? `Última alteração em ${formatarDataHora(pet.atualizadoEm)} por ${pet.atualizadoPor}`
              : 'Ainda não editada: a página mostra o conteúdo inicial.'}
          </p>
        </div>
        <Link to={`/pets/${slug}`} target="_blank" className="btn btn-secundario">
          Ver a página <span className="sr-only">(abre em nova aba)</span> ↗
        </Link>
      </div>

      <p className={styles.dica}>
        Abra uma seção, edite e clique em <strong>Salvar</strong>. A alteração é publicada na hora.
      </p>

      <BlocoEstrutural pet={pet} salvar={salvar} podeEditar={podeEditarEstrutura} />
      <BlocoIdentidade {...comuns} />
      <BlocoFotoGrupo {...comuns} />
      <BlocoSobre {...comuns} />
      <BlocoTutor {...comuns} />
      <BlocoMembros {...comuns} />
      <BlocoProjetos {...comuns} />
      <BlocoGaleria {...comuns} />
      <BlocoContato {...comuns} />
    </div>
  )
}
