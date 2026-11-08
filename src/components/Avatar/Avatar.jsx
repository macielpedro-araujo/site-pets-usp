import styles from './Avatar.module.css'
import urlPublica from '../../utils/urlPublica.js'

// Foto redonda de uma pessoa. Sem foto, mostra as iniciais do nome.
export default function Avatar({ nome, foto, tamanho = 96 }) {
  // Ignora palavras curtas como "de", "da", "dos" ao montar as iniciais
  const iniciais = nome
    .split(' ')
    .filter((parte) => parte && !['de', 'da', 'do', 'das', 'dos', 'e'].includes(parte.toLowerCase()))
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')

  if (foto) {
    return (
      <img src={urlPublica(foto)} alt="" className={styles.avatar} style={{ width: tamanho, height: tamanho }} />
    )
  }

  return (
    <span
      className={`${styles.avatar} ${styles.iniciais}`}
      style={{ width: tamanho, height: tamanho, fontSize: tamanho / 3 }}
      aria-hidden="true"
    >
      {iniciais}
    </span>
  )
}
