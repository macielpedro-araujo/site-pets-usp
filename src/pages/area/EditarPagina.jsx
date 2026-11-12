import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import EditorPet from '../../components/Editor/EditorPet.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import useTituloPagina from '../../hooks/useTituloPagina.js'

// Área do PET: "Editar minha página" (SPEC §2.4). Cada conta de PET edita só o próprio PET.
export default function EditarPagina() {
  useTituloPagina('Editar minha página')
  const { petSlug } = useAuth()

  return (
    <>
      <CabecalhoArea titulo="Editar minha página" />
      <div className="container">
        <EditorPet slug={petSlug} />
      </div>
    </>
  )
}
