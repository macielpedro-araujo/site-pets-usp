import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import { buscarPet, listaPets } from '../../content/pets/index.js'
import { STATUS } from '../../services/constantes.js'
import { listar } from '../../services/solicitacoes.js'
import { formatarData } from '../../utils/datas.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Painel.module.css'

const petsEmOrdem = [...listaPets].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

export default function Painel() {
  useTituloPagina('Painel do CEPETUSP')
  const [pedidos, setPedidos] = useState(null) // null = carregando
  const [erro, setErro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroPet, setFiltroPet] = useState('')

  // Carrega todos de uma vez; os filtros são aplicados aqui mesmo,
  // assim os contadores do topo sempre mostram o total geral
  useEffect(() => {
    listar()
      .then(setPedidos)
      .catch((err) => setErro(err.message))
  }, [])

  const todos = pedidos ?? []
  const contar = (status) => todos.filter((p) => p.status === status).length
  const visiveis = todos
    .filter((p) => !filtroStatus || p.status === filtroStatus)
    .filter((p) => !filtroPet || p.pet_slug === filtroPet)

  return (
    <>
      <CabecalhoArea titulo="Painel do CEPETUSP" />
      <div className="container">
        <h1 className={styles.titulo}>Pedidos dos PETs</h1>

        {/* Contadores: clicar filtra pelo status */}
        <ul className={styles.contadores}>
          {Object.entries(STATUS).map(([chave, nome]) => (
            <li key={chave}>
              <button
                type="button"
                className={`${styles.contador} ${styles[chave]} ${filtroStatus === chave ? styles.contadorAtivo : ''}`}
                aria-pressed={filtroStatus === chave}
                onClick={() => setFiltroStatus(filtroStatus === chave ? '' : chave)}
              >
                <strong>{contar(chave)}</strong>
                <span>{nome}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.filtros}>
          <div className="campo">
            <label htmlFor="filtro-status">Status</label>
            <select id="filtro-status" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(STATUS).map(([chave, nome]) => (
                <option key={chave} value={chave}>
                  {nome}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="filtro-pet">PET</label>
            <select id="filtro-pet" value={filtroPet} onChange={(e) => setFiltroPet(e.target.value)}>
              <option value="">Todos</option>
              {petsEmOrdem.map((pet) => (
                <option key={pet.slug} value={pet.slug}>
                  {pet.nome}
                </option>
              ))}
            </select>
          </div>
          <p className={styles.total} aria-live="polite">
            {visiveis.length} {visiveis.length === 1 ? 'pedido' : 'pedidos'}
          </p>
        </div>

        {erro && <p className="aviso-erro">{erro}</p>}
        {!erro && pedidos === null && <p>Carregando pedidos…</p>}
        {pedidos && visiveis.length === 0 && <p className={styles.vazio}>Nenhum pedido encontrado.</p>}

        {visiveis.length > 0 && (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">PET</th>
                <th scope="col">Tipo</th>
                <th scope="col">Data</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((pedido) => (
                <tr key={pedido.id}>
                  <td data-rotulo="Pedido">
                    <Link to={`/painel/pedidos/${pedido.id}`}>{pedido.titulo}</Link>
                  </td>
                  <td data-rotulo="PET">{buscarPet(pedido.pet_slug)?.nome ?? pedido.pet_slug}</td>
                  <td data-rotulo="Tipo">
                    {pedido.tipo}
                    <br />
                    <small>{pedido.secao}</small>
                  </td>
                  <td data-rotulo="Data">{formatarData(pedido.created_at)}</td>
                  <td data-rotulo="Status">
                    <StatusBadge status={pedido.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
