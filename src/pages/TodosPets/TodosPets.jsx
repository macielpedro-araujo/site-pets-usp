import { useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import PetCard from '../../components/PetCard/PetCard.jsx'
import { IconeFunil, IconeSetaBaixo } from '../../components/icons/Icones.jsx'
import { areas, listaPets } from '../../content/pets/index.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './TodosPets.module.css'

// Lista de campi que aparecem nos dados, sem repetir e em ordem alfabética
const campi = [...new Set(listaPets.map((pet) => pet.campus).filter(Boolean))].sort((a, b) =>
  a.localeCompare(b, 'pt-BR'),
)

function compararNome(a, b) {
  return a.nome.localeCompare(b.nome, 'pt-BR')
}

// Mais antigos primeiro; quem não tem ano vai para o fim
function compararAno(a, b) {
  if (a.anoCriacao === b.anoCriacao) return compararNome(a, b)
  if (a.anoCriacao == null) return 1
  if (b.anoCriacao == null) return -1
  return a.anoCriacao - b.anoCriacao
}

export default function TodosPets() {
  useTituloPagina('Todos os PETs da USP')

  const [ordem, setOrdem] = useState('az') // 'az' ou 'ano'
  const [areasEscolhidas, setAreasEscolhidas] = useState([])
  const [campus, setCampus] = useState('')
  const [filtrosAbertos, setFiltrosAbertos] = useState(true)

  function alternarArea(area) {
    if (areasEscolhidas.includes(area)) {
      setAreasEscolhidas(areasEscolhidas.filter((a) => a !== area))
    } else {
      setAreasEscolhidas([...areasEscolhidas, area])
    }
  }

  function limparFiltros() {
    setAreasEscolhidas([])
    setCampus('')
  }

  // Aplica os filtros e depois a ordenação
  const petsVisiveis = listaPets
    .filter((pet) => areasEscolhidas.length === 0 || areasEscolhidas.includes(pet.area))
    .filter((pet) => campus === '' || pet.campus === campus)
    .sort(ordem === 'az' ? compararNome : compararAno)

  const temFiltro = areasEscolhidas.length > 0 || campus !== ''

  return (
    <div className="container">
      <Breadcrumb itens={[{ texto: 'Todos os PETs da USP' }]} />

      <div className={styles.topo}>
        <h1 className={styles.titulo}>
          Galeria de Todos os Programas
          <span className={styles.subtitulo}>de Educação Tutorial da USP</span>
        </h1>

        <div className={styles.ordenacao} role="group" aria-label="Ordenação">
          <span className={styles.ordenacaoRotulo}>Ordenar por:</span>
          <button
            type="button"
            aria-pressed={ordem === 'ano'}
            className={ordem === 'ano' ? styles.ordemAtiva : styles.ordemBotao}
            onClick={() => setOrdem('ano')}
          >
            Ano de Criação
          </button>
          <button
            type="button"
            aria-pressed={ordem === 'az'}
            className={ordem === 'az' ? styles.ordemAtiva : styles.ordemBotao}
            onClick={() => setOrdem('az')}
          >
            A → Z
          </button>
        </div>
      </div>

      <section className={styles.filtros} aria-label="Filtros">
        <button
          type="button"
          className={styles.filtrosCabecalho}
          aria-expanded={filtrosAbertos}
          aria-controls="painel-filtros"
          onClick={() => setFiltrosAbertos(!filtrosAbertos)}
        >
          <IconeFunil tamanho={18} />
          <span>Filtros:</span>
          <IconeSetaBaixo
            tamanho={18}
            className={`${styles.seta} ${filtrosAbertos ? styles.setaAberta : ''}`}
          />
        </button>

        {filtrosAbertos && (
          <div id="painel-filtros" className={styles.filtrosCorpo}>
            <div className={styles.linhaFiltro}>
              <span className={styles.rotulo} id="rotulo-area">
                Área de Conhecimento:
              </span>
              <div className={styles.chips} role="group" aria-labelledby="rotulo-area">
                {areas.map((area) => {
                  const ativo = areasEscolhidas.includes(area)
                  return (
                    <button
                      key={area}
                      type="button"
                      aria-pressed={ativo}
                      className={ativo ? styles.chipAtivo : styles.chip}
                      onClick={() => alternarArea(area)}
                    >
                      {area}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className={styles.linhaFiltro}>
              <label htmlFor="filtro-campus" className={styles.rotulo}>
                Campus USP:
              </label>
              <select
                id="filtro-campus"
                className={styles.select}
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              >
                <option value="">Selecionar</option>
                {campi.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      <div className={styles.resumo}>
        <p aria-live="polite">
          {petsVisiveis.length} {petsVisiveis.length === 1 ? 'programa' : 'programas'}
        </p>
        {temFiltro && (
          <button type="button" className={styles.limpar} onClick={limparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>

      {petsVisiveis.length > 0 ? (
        <ul className={styles.grade}>
          {petsVisiveis.map((pet) => (
            <li key={pet.slug}>
              <PetCard pet={pet} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.vazio}>
          <p>Nenhum PET combina com os filtros escolhidos.</p>
          <button type="button" className="btn btn-secundario" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
