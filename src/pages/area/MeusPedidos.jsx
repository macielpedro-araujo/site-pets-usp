import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { listar } from '../../services/solicitacoes.js'
import { formatarData } from '../../utils/datas.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Area.module.css'

export default function MeusPedidos() {
  useTituloPagina('Meus pedidos')
  const { petSlug } = useAuth()
  const [pedidos, setPedidos] = useState(null) // null = carregando
  const [erro, setErro] = useState('')

  useEffect(() => {
    listar({ petSlug })
      .then(setPedidos)
      .catch((err) => setErro(err.message))
  }, [petSlug])

  return (
    <>
      <CabecalhoArea titulo="Área do PET" />
      <div className="container">
        <div className={styles.topo}>
          <div>
            <h1>Meus pedidos</h1>
            <Link to={`/pets/${petSlug}`} className={styles.linkPagina}>
              Ver minha página
            </Link>
          </div>
          <Link to="/area-do-pet/novo" className="btn btn-primario">
            + Novo pedido
          </Link>
        </div>

        {erro && <p className="aviso-erro">{erro}</p>}
        {!erro && pedidos === null && <p>Carregando pedidos…</p>}

        {pedidos?.length === 0 && (
          <div className={styles.vazio}>
            <p>Seu PET ainda não fez nenhum pedido.</p>
            <p>Quer mudar um texto, uma foto ou a lista de membros? Crie um novo pedido!</p>
          </div>
        )}

        {pedidos?.length > 0 && (
          <ul className={styles.lista}>
            {pedidos.map((pedido) => (
              <li key={pedido.id}>
                <Link to={`/area-do-pet/pedidos/${pedido.id}`} className={styles.item}>
                  <span className={styles.itemTitulo}>{pedido.titulo}</span>
                  <span className={styles.itemInfo}>
                    {pedido.tipo} · {pedido.secao} · {formatarData(pedido.created_at)}
                  </span>
                  <StatusBadge status={pedido.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
