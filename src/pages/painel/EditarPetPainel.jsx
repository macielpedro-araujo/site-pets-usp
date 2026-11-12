import { Link, useParams } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import EditorPet from '../../components/Editor/EditorPet.jsx'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Painel.module.css'

// CEPETUSP editando qualquer PET, com os dados estruturais liberados
export default function EditarPetPainel() {
  const { slug } = useParams()
  useTituloPagina('Editar PET')

  return (
    <>
      <CabecalhoArea titulo="Painel do CEPETUSP" />
      <div className="container">
        <p className={styles.voltar}>
          <Link to="/painel">← Todos os PETs</Link> · <Link to={`/painel/pets/${slug}/historico`}>Histórico</Link>
        </p>
        <EditorPet slug={slug} podeEditarEstrutura />
      </div>
    </>
  )
}
