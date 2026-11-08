import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import DadosPedido from '../../components/DadosPedido/DadosPedido.jsx'
import { buscar } from '../../services/solicitacoes.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Area.module.css'

export default function DetalhePedido() {
  useTituloPagina('Detalhe do pedido')
  const { id } = useParams()
  const location = useLocation()
  const acabouDeCriar = location.state?.criado

  // undefined = carregando; null = não encontrado
  const [pedido, setPedido] = useState(undefined)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscar(id)
      .then(setPedido)
      .catch((err) => setErro(err.message))
  }, [id])

  return (
    <>
      <CabecalhoArea titulo="Área do PET" />
      <div className={`container ${styles.estreito}`}>
        <p className={styles.voltar}>
          <Link to="/area-do-pet">← Voltar para meus pedidos</Link>
        </p>

        {acabouDeCriar && pedido && (
          <p className="aviso-sucesso" role="status">
            Pedido enviado com sucesso! Acompanhe o andamento por esta página.
          </p>
        )}

        {erro && <p className="aviso-erro">{erro}</p>}
        {!erro && pedido === undefined && <p>Carregando…</p>}
        {pedido === null && (
          <div className={styles.vazio}>
            <p>Pedido não encontrado.</p>
          </div>
        )}
        {pedido && <DadosPedido pedido={pedido} />}
      </div>
    </>
  )
}
