import { modoDemo } from '../../services/supabaseClient.js'
import styles from './FaixaDemo.module.css'

// Aviso discreto que aparece na Área do PET e no Painel quando não há Supabase
export default function FaixaDemo() {
  if (!modoDemo) return null
  return (
    <p className={styles.faixa}>
      <strong>Modo demonstração:</strong> os pedidos ficam salvos só neste navegador.
    </p>
  )
}
