import { buscarPet } from '../../content/pets/index.js'
import { formatarDataHora } from '../../utils/datas.js'
import StatusBadge from '../StatusBadge/StatusBadge.jsx'
import { IconeAnexo } from '../icons/Icones.jsx'
import styles from './DadosPedido.module.css'

function formatarTamanho(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Mostra todos os dados de um pedido. Usado na Área do PET e no Painel.
export default function DadosPedido({ pedido, mostrarResposta = true }) {
  const pet = buscarPet(pedido.pet_slug)

  return (
    <div className={styles.dados}>
      <div className={styles.cabecalho}>
        <h1>{pedido.titulo}</h1>
        <StatusBadge status={pedido.status} />
      </div>

      <dl className={styles.info}>
        <div>
          <dt>PET</dt>
          <dd>{pet ? pet.nome : pedido.pet_slug}</dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>{pedido.tipo}</dd>
        </div>
        <div>
          <dt>Seção da página</dt>
          <dd>{pedido.secao}</dd>
        </div>
        <div>
          <dt>Enviado em</dt>
          <dd>{formatarDataHora(pedido.created_at)}</dd>
        </div>
      </dl>

      <section className={styles.bloco}>
        <h2>Descrição</h2>
        <p className={styles.descricao}>{pedido.descricao}</p>
      </section>

      {pedido.anexos.length > 0 && (
        <section className={styles.bloco}>
          <h2>Anexos</h2>
          <ul className={styles.anexos}>
            {pedido.anexos.map((anexo, i) => (
              <li key={i}>
                {anexo.url && anexo.tipo.startsWith('image/') && (
                  <a href={anexo.url} target="_blank" rel="noreferrer">
                    <img src={anexo.url} alt={`Miniatura de ${anexo.nome}`} className={styles.miniatura} />
                  </a>
                )}
                <span className={styles.anexoNome}>
                  <IconeAnexo tamanho={16} />
                  {anexo.url ? (
                    <a href={anexo.url} target="_blank" rel="noreferrer">
                      {anexo.nome}
                    </a>
                  ) : (
                    <span>{anexo.nome}</span>
                  )}
                  <small>({formatarTamanho(anexo.tamanho)})</small>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mostrarResposta && (
        <section className={`${styles.bloco} ${styles.resposta}`}>
          <h2>Resposta do CEPETUSP</h2>
          <p className={styles.descricao}>{pedido.resposta || 'Ainda sem resposta.'}</p>
        </section>
      )}

      <section className={styles.bloco}>
        <h2>Linha do tempo</h2>
        <ol className={styles.linhaTempo}>
          {pedido.historico.map((evento, i) => (
            <li key={i}>
              <StatusBadge status={evento.status} />
              <span>
                {formatarDataHora(evento.em)}
                {evento.por && ` · ${evento.por}`}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
