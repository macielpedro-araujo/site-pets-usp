import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar/Avatar.jsx'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import Carousel from '../../components/Carousel/Carousel.jsx'
import CarrosselRolagem from '../../components/CarrosselRolagem/CarrosselRolagem.jsx'
import CreditoFoto from '../../components/CreditoFoto/CreditoFoto.jsx'
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio.jsx'
import {
  IconeEmail,
  IconeInstagram,
  IconeLinkedin,
  IconeLinktree,
  IconeLocal,
  IconeSite,
  IconeTelegram,
  IconeYoutube,
} from '../../components/icons/Icones.jsx'
import useDados from '../../hooks/useDados.js'
import { buscarPet } from '../../services/pets.js'
import { urlImagem } from '../../services/imagens.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import NotFound from '../NotFound/NotFound.jsx'
import styles from './PetPage.module.css'

// Redes sociais que podem aparecer, na ordem em que são mostradas
const redesConhecidas = [
  { chave: 'instagram', nome: 'Instagram', Icone: IconeInstagram },
  { chave: 'linktree', nome: 'Linktree', Icone: IconeLinktree },
  { chave: 'linkedin', nome: 'LinkedIn', Icone: IconeLinkedin },
  { chave: 'youtube', nome: 'YouTube', Icone: IconeYoutube },
  { chave: 'telegram', nome: 'Telegram', Icone: IconeTelegram },
  { chave: 'site', nome: 'Site', Icone: IconeSite },
]

// Título + conteúdo de uma seção da página
function Secao({ id, titulo, children }) {
  return (
    <section className={styles.secao} aria-labelledby={id}>
      <h2 id={id} className={styles.tituloSecao}>
        {titulo}
      </h2>
      {children}
    </section>
  )
}

// 1. Capa: foto larga com um gradiente da cor do PET por cima
function Capa({ pet }) {
  // A cor vai numa variável CSS; sem cor própria, o CSS usa o azul padrão
  const estilo = pet.corDestaque ? { '--cor-pet': pet.corDestaque } : undefined

  return (
    <section className={styles.capa} style={estilo}>
      {pet.fotoCapa && <img src={urlImagem(pet.fotoCapa)} alt="" className={styles.capaFoto} />}
      <div className={`container ${styles.capaConteudo}`}>
        <div>
          <h1 className={styles.nome}>{pet.nome}</h1>
          <p className={styles.programa}>Programa de Educação Tutorial da USP</p>
          <p className={styles.local}>
            {[pet.unidade, pet.campus && `Campus ${pet.campus}`, pet.area].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className={styles.logoCaixa}>
          <img src={urlImagem(pet.logo)} alt={`Logo do ${pet.nome}`} />
        </div>
      </div>
      <CreditoFoto src={pet.fotoCapa} />
    </section>
  )
}

function Membros({ pet }) {
  const temTutor = Boolean(pet.tutor?.nome)
  const temMembros = pet.membros?.length > 0
  if (!temTutor && !temMembros) return <EstadoVazio />

  return (
    <>
      {temTutor && (
        <div className={styles.tutor}>
          <Avatar nome={pet.tutor.nome} foto={pet.tutor.foto} tamanho={120} />
          <div>
            <p className={styles.tutorRotulo}>Tutor(a)</p>
            <p className={styles.tutorNome}>{pet.tutor.nome}</p>
            {pet.tutor.descricao && <p>{pet.tutor.descricao}</p>}
          </div>
        </div>
      )}

      {temMembros && (
        <CarrosselRolagem rotulo="Membros do grupo">
          {pet.membros.map((membro, i) => (
            <li key={i} className={styles.membro}>
              <Avatar nome={membro.nome} foto={membro.foto} />
              <p className={styles.membroNome}>{membro.nome}</p>
              <p className={styles.membroCurso}>{membro.curso}</p>
            </li>
          ))}
        </CarrosselRolagem>
      )}
    </>
  )
}

function Projetos({ projetos }) {
  if (!projetos?.length) return <EstadoVazio />

  return (
    <div className={styles.projetos}>
      <Carousel
        rotulo="Atividades e projetos do grupo"
        itens={projetos}
        renderItem={(projeto) => (
          <article className={styles.projeto}>
            {projeto.imagem ? (
              <img src={urlImagem(projeto.imagem)} alt="" className={styles.projetoImagem} />
            ) : (
              <div className={styles.projetoImagem} aria-hidden="true" />
            )}
            <div className={styles.projetoTexto}>
              <h3>{projeto.titulo}</h3>
              <p>{projeto.descricao}</p>
              {projeto.link && (
                <a href={projeto.link} target="_blank" rel="noreferrer">
                  Saiba mais <span className="sr-only">(abre em nova aba)</span>
                </a>
              )}
            </div>
          </article>
        )}
      />
    </div>
  )
}

function Galeria({ fotos }) {
  if (!fotos?.length) return <EstadoVazio />

  return (
    <CarrosselRolagem rotulo="Galeria de fotos">
      {fotos.map((foto, i) => (
        <li key={i}>
          <figure className={styles.foto}>
            <img src={urlImagem(foto.src)} alt={foto.legenda || ''} loading="lazy" />
            {foto.legenda && <figcaption>{foto.legenda}</figcaption>}
          </figure>
        </li>
      ))}
    </CarrosselRolagem>
  )
}

function Contato({ pet }) {
  const redes = redesConhecidas.filter((rede) => pet.redes?.[rede.chave])
  if (redes.length === 0 && !pet.email && !pet.endereco) return <EstadoVazio />

  return (
    <>
      <ul className={styles.redes}>
        {redes.map(({ chave, nome, Icone }) => (
          <li key={chave}>
            <a href={pet.redes[chave]} target="_blank" rel="noreferrer">
              <Icone />
              {nome}
            </a>
          </li>
        ))}
        {pet.email && (
          <li>
            <a href={`mailto:${pet.email}`}>
              <IconeEmail />
              {pet.email}
            </a>
          </li>
        )}
      </ul>
      {pet.endereco && (
        <p className={styles.endereco}>
          <IconeLocal tamanho={18} />
          {pet.endereco}
        </p>
      )}
    </>
  )
}

// Página padrão de um PET (SPEC §6.5, com a capa e a galeria da SPEC-v2 §4 e §5)
export default function PetPage() {
  const { slug } = useParams()
  const { dados: pet, carregando, erro } = useDados(() => buscarPet(slug), [slug])
  useTituloPagina(pet ? pet.nome : carregando ? 'Carregando' : 'Página não encontrada')

  if (carregando) return <p className="container carregando">Carregando…</p>
  if (erro) return <p className="container aviso-erro">Não foi possível carregar esta página: {erro}</p>
  if (!pet) return <NotFound />

  return (
    <>
      <div className="container">
        <Breadcrumb
          itens={[
            { texto: 'Todos os PETs da USP', para: '/todos-os-pets-da-usp' },
            { texto: pet.nome },
          ]}
        />
      </div>

      <Capa pet={pet} />

      <div className="container">
        {pet.fotoGrupo && (
          <img src={urlImagem(pet.fotoGrupo)} alt={`Foto do grupo ${pet.nome}`} className={styles.fotoGrupo} />
        )}

        <Secao id="titulo-sobre" titulo="Sobre nós">
          {pet.sobre?.length > 0 ? (
            <div className={styles.texto}>
              {pet.sobre.map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>
          ) : (
            <EstadoVazio />
          )}
        </Secao>

        <Secao id="titulo-membros" titulo="Membros">
          <Membros pet={pet} />
        </Secao>

        <Secao id="titulo-projetos" titulo="Atividades e Projetos">
          <Projetos projetos={pet.projetos} />
        </Secao>

        <Secao id="titulo-galeria" titulo="Galeria">
          <Galeria fotos={pet.galeria} />
        </Secao>

        <Secao id="titulo-contato" titulo="Redes Sociais e Contato">
          <Contato pet={pet} />
        </Secao>

        <p className={styles.editar}>
          Faz parte deste PET? <Link to="/entrar">Edite esta página na Área dos PETs.</Link>
        </p>
      </div>
    </>
  )
}
