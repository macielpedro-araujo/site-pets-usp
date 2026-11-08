import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar/Avatar.jsx'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.jsx'
import Carousel from '../../components/Carousel/Carousel.jsx'
import CarrosselRolagem from '../../components/CarrosselRolagem/CarrosselRolagem.jsx'
import {
  IconeEmail,
  IconeInstagram,
  IconeLinkedin,
  IconeLinktree,
  IconeSite,
  IconeYoutube,
} from '../../components/icons/Icones.jsx'
import { buscarPet } from '../../content/pets/index.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import NotFound from '../NotFound/NotFound.jsx'
import styles from './PetPage.module.css'
import urlPublica from '../../utils/urlPublica.js'

// Redes sociais que podem aparecer, na ordem em que são mostradas
const redesConhecidas = [
  { chave: 'instagram', nome: 'Instagram', Icone: IconeInstagram },
  { chave: 'linktree', nome: 'Linktree', Icone: IconeLinktree },
  { chave: 'linkedin', nome: 'LinkedIn', Icone: IconeLinkedin },
  { chave: 'youtube', nome: 'YouTube', Icone: IconeYoutube },
  { chave: 'site', nome: 'Site', Icone: IconeSite },
]

// Página padrão de um PET, montada a partir de src/content/pets/<slug>.js (SPEC §6.5)
export default function PetPage() {
  const { slug } = useParams()
  const pet = buscarPet(slug)
  useTituloPagina(pet ? pet.nome : 'Página não encontrada')

  if (!pet) return <NotFound />

  const redes = redesConhecidas.filter((rede) => pet.redes?.[rede.chave])
  const temMembros = pet.tutor || pet.membros?.length > 0
  const temContato = redes.length > 0 || pet.email

  // Cor de destaque do PET no topo; sem cor, usa o azul e o teal padrão
  const estiloTopo = pet.corDestaque
    ? { background: `linear-gradient(135deg, ${pet.corDestaque}, var(--color-primary-dark))` }
    : undefined

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

      {/* 1. Topo */}
      <section className={styles.topo} style={estiloTopo}>
        <div className={`container ${styles.topoConteudo}`}>
          <div>
            <h1 className={styles.nome}>{pet.nome}</h1>
            <p className={styles.programa}>Programa de Educação Tutorial da USP</p>
            {(pet.unidade || pet.campus) && (
              <p className={styles.local}>
                {[pet.unidade, pet.campus && `Campus ${pet.campus}`].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <div className={styles.logoCaixa}>
            <img src={urlPublica(pet.logo)} alt={`Logo do ${pet.nome}`} />
          </div>
        </div>
      </section>

      <div className="container">
        {/* 2. Foto do grupo */}
        <div className={styles.fotoGrupo}>
          {pet.fotoGrupo ? (
            <img src={urlPublica(pet.fotoGrupo)} alt={`Foto do grupo ${pet.nome}`} />
          ) : (
            <div className={styles.fotoPlaceholder}>Foto do grupo em breve</div>
          )}
        </div>

        {/* 3. Membros */}
        {temMembros && (
          <section className={styles.secao} aria-labelledby="titulo-membros">
            <h2 id="titulo-membros" className={styles.tituloSecao}>Membros</h2>

            {pet.tutor && (
              <div className={styles.tutor}>
                <Avatar nome={pet.tutor.nome} foto={pet.tutor.foto} tamanho={120} />
                <div>
                  <p className={styles.tutorRotulo}>Tutor(a)</p>
                  <p className={styles.tutorNome}>{pet.tutor.nome}</p>
                  {pet.tutor.descricao && <p>{pet.tutor.descricao}</p>}
                </div>
              </div>
            )}

            {pet.membros?.length > 0 && (
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
          </section>
        )}

        {/* 4. Sobre nós */}
        {pet.sobre?.length > 0 && (
          <section className={styles.secao} aria-labelledby="titulo-sobre">
            <h2 id="titulo-sobre" className={styles.tituloSecao}>Sobre nós</h2>
            <div className={styles.texto}>
              {pet.sobre.map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
            </div>
          </section>
        )}

        {/* 5. Projetos realizados */}
        {pet.projetos?.length > 0 && (
          <section className={styles.secao} aria-labelledby="titulo-projetos">
            <h2 id="titulo-projetos" className={styles.tituloSecao}>Atividades e Projetos Realizados</h2>
            <div className={styles.projetos}>
              <Carousel
                rotulo="Projetos do grupo"
                itens={pet.projetos}
                renderItem={(projeto) => (
                  <article className={styles.projeto}>
                    {projeto.imagem ? (
                      <img src={urlPublica(projeto.imagem)} alt="" className={styles.projetoImagem} />
                    ) : (
                      <div className={styles.projetoImagem} aria-hidden="true" />
                    )}
                    <div className={styles.projetoTexto}>
                      <h3>{projeto.titulo}</h3>
                      <p>{projeto.descricao}</p>
                      {projeto.link && (
                        <a href={projeto.link} target="_blank" rel="noreferrer">
                          Saiba mais
                        </a>
                      )}
                    </div>
                  </article>
                )}
              />
            </div>
          </section>
        )}

        {/* 6. Redes sociais e contato */}
        {temContato && (
          <section className={styles.secao} aria-labelledby="titulo-redes">
            <h2 id="titulo-redes" className={styles.tituloSecao}>Redes Sociais e Contato</h2>
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
          </section>
        )}

        <p className={styles.pedirAlteracao}>
          Faz parte deste PET? <Link to="/entrar">Peça alterações na Área dos PETs.</Link>
        </p>
      </div>
    </>
  )
}
