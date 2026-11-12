import { Link } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import useDados from '../../hooks/useDados.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import { urlImagem } from '../../services/imagens.js'
import { listarPets } from '../../services/pets.js'
import { formatarDataHora } from '../../utils/datas.js'
import styles from './Painel.module.css'

// Indicadores de completude de cada página
function indicadores(pet) {
  return [
    { nome: 'Capa', ok: Boolean(pet.fotoCapa) },
    { nome: 'Membros', ok: pet.membros?.length > 0 },
    { nome: 'Projetos', ok: pet.projetos?.length > 0 },
  ]
}

// Painel do CEPETUSP: todos os PETs, com acesso ao editor e ao histórico (SPEC §2.4)
export default function Painel() {
  useTituloPagina('Painel do CEPETUSP')
  const { dados: pets, carregando, erro } = useDados(listarPets, [])

  const editados = pets?.filter((p) => p.atualizadoEm).length ?? 0
  const completos = pets?.filter((p) => indicadores(p).every((i) => i.ok)).length ?? 0

  return (
    <>
      <CabecalhoArea titulo="Painel do CEPETUSP" />
      <div className="container">
        <div className={styles.topo}>
          <h1>Páginas dos PETs</h1>
          <Link to="/noticias-admin" className="btn btn-secundario">
            Notícias da Home
          </Link>
        </div>

        {carregando && <p className="carregando">Carregando…</p>}
        {erro && <p className="aviso-erro">{erro}</p>}

        {pets && (
          <>
            <ul className={styles.resumo}>
              <li>
                <strong>{pets.length}</strong> PETs
              </li>
              <li>
                <strong>{editados}</strong> já editados
              </li>
              <li>
                <strong>{completos}</strong> com capa, membros e projetos
              </li>
            </ul>

            <ul className={styles.lista}>
              {pets.map((pet) => (
                <li key={pet.slug} className={styles.linha}>
                  <div className={styles.logo}>
                    <img src={urlImagem(pet.logo)} alt="" />
                  </div>
                  <div className={styles.info}>
                    <p className={styles.nome}>
                      {pet.nome}
                      {pet.ativo === false && <span className={styles.inativo}>inativo</span>}
                    </p>
                    <p className={styles.alteracao}>
                      {pet.atualizadoEm
                        ? `Alterado em ${formatarDataHora(pet.atualizadoEm)} por ${pet.atualizadoPor}`
                        : 'Conteúdo inicial (ainda não editado)'}
                    </p>
                    <ul className={styles.indicadores} aria-label="Completude">
                      {indicadores(pet).map((ind) => (
                        <li key={ind.nome} className={ind.ok ? styles.ok : styles.falta}>
                          {ind.ok ? '✓' : '✗'} {ind.nome}
                          <span className="sr-only">{ind.ok ? ' preenchido' : ' faltando'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.acoes}>
                    <Link to={`/painel/pets/${pet.slug}`} className="btn btn-primario">
                      Editar
                    </Link>
                    <Link to={`/painel/pets/${pet.slug}/historico`} className="btn btn-secundario">
                      Histórico
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
