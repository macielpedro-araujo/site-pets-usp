import styles from './SectionTitle.module.css'

// Título de seção do Figma: título azul-escuro + subtítulo com fundo amarelo.
// "alinhamento" pode ser "centro" (padrão) ou "esquerda".
// "estilo" do subtítulo: "amarelo" (fundo amarelo) ou "azul" (texto azul, sem fundo).
export default function SectionTitle({ titulo, subtitulo, nivel = 2, alinhamento = 'centro', estilo = 'amarelo' }) {
  const Tag = `h${nivel}`
  return (
    <div className={`${styles.bloco} ${alinhamento === 'esquerda' ? styles.esquerda : ''}`}>
      <Tag className={styles.titulo}>
        {titulo}
        {subtitulo && (
          <span className={estilo === 'azul' ? styles.subAzul : styles.subAmarelo}>{subtitulo}</span>
        )}
      </Tag>
    </div>
  )
}
