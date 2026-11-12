import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buscarCredito } from '../../services/creditos.js'
import styles from './CreditoFoto.module.css'

// Crédito pequeno no canto de uma foto do Wikimedia Commons
// (ex.: "Foto: Autor / Wikimedia Commons, CC BY-SA 4.0"). Fotos sem crédito não mostram nada.
export default function CreditoFoto({ src }) {
  const [credito, setCredito] = useState(null)

  useEffect(() => {
    let ativo = true
    buscarCredito(src).then((c) => ativo && setCredito(c))
    return () => {
      ativo = false
    }
  }, [src])

  if (!credito) return null

  return (
    <p className={styles.credito}>
      <Link to="/creditos">
        Foto: {credito.autor} / Wikimedia Commons, {credito.licenca}
      </Link>
    </p>
  )
}
