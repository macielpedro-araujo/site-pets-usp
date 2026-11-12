// As seções do editor da página de um PET (SPEC §2.4), na mesma ordem da página pública.
// Cada bloco guarda o próprio formulário e salva só os campos dele.
import { useState } from 'react'
import { areas } from '../../services/pets.js'
import Bloco from './Bloco.jsx'
import CampoImagem from './CampoImagem.jsx'
import ListaEditavel from './ListaEditavel.jsx'
import styles from './Editor.module.css'

const LIMITES = { sobre: 10, membros: 60, projetos: 30, galeria: 30 }
const COR_PADRAO = '#2b17d0'

// Texto vazio vira null (assim a página pública esconde o que não foi preenchido)
function limpar(texto) {
  const t = (texto ?? '').trim()
  return t === '' ? null : t
}

// Campo de texto simples com rótulo. idExtra diferencia campos repetidos numa lista (ex.: índice).
function Campo({ rotulo, valor, aoMudar, tipo = 'text', ajuda, multilinha = false, idExtra = '', ...props }) {
  const id = `campo-${rotulo.replace(/\W+/g, '-')}-${idExtra}`
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {multilinha ? (
        <textarea id={id} value={valor ?? ''} onChange={(e) => aoMudar(e.target.value)} {...props} />
      ) : (
        <input id={id} type={tipo} value={valor ?? ''} onChange={(e) => aoMudar(e.target.value)} {...props} />
      )}
      {ajuda && <span className="campo-ajuda">{ajuda}</span>}
    </div>
  )
}

// 0. Dados estruturais: só o CEPETUSP edita; para o PET aparecem só para leitura
export function BlocoEstrutural({ pet, salvar, podeEditar }) {
  const [dados, setDados] = useState({
    nome: pet.nome,
    unidade: pet.unidade ?? '',
    campus: pet.campus ?? '',
    area: pet.area ?? '',
    anoCriacao: pet.anoCriacao ?? '',
    siteExterno: pet.siteExterno ?? '',
    ativo: pet.ativo !== false,
  })
  const mudar = (campo) => (valor) => setDados({ ...dados, [campo]: valor })

  if (!podeEditar) {
    return (
      <section className={styles.somenteLeitura} aria-label="Dados do PET">
        <dl>
          <div><dt>Nome</dt><dd>{pet.nome}</dd></div>
          <div><dt>Unidade</dt><dd>{pet.unidade ?? '—'}</dd></div>
          <div><dt>Campus</dt><dd>{pet.campus ?? '—'}</dd></div>
          <div><dt>Área</dt><dd>{pet.area ?? '—'}</dd></div>
          <div><dt>Ano de criação</dt><dd>{pet.anoCriacao ?? '—'}</dd></div>
        </dl>
        <p>Para alterar estes dados, fale com o CEPETUSP.</p>
      </section>
    )
  }

  function aoSalvar() {
    const ano = String(dados.anoCriacao).trim()
    return salvar(
      {
        nome: dados.nome.trim(),
        unidade: limpar(dados.unidade),
        campus: limpar(dados.campus),
        area: limpar(dados.area),
        anoCriacao: ano === '' ? null : Number(ano),
        siteExterno: limpar(dados.siteExterno),
        ativo: dados.ativo,
      },
      'Dados do PET',
    )
  }

  return (
    <Bloco titulo="Dados do PET (só CEPETUSP)" aoSalvar={aoSalvar}>
      <div className={styles.grade2}>
        <Campo rotulo="Nome" valor={dados.nome} aoMudar={mudar('nome')} required />
        <Campo rotulo="Unidade" valor={dados.unidade} aoMudar={mudar('unidade')} />
        <Campo rotulo="Campus" valor={dados.campus} aoMudar={mudar('campus')} />
        <div className="campo">
          <label htmlFor="campo-area">Área de conhecimento</label>
          <select id="campo-area" value={dados.area} onChange={(e) => mudar('area')(e.target.value)}>
            <option value="">Selecionar</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <Campo rotulo="Ano de criação" tipo="number" valor={dados.anoCriacao} aoMudar={mudar('anoCriacao')} />
        <Campo
          rotulo="Site externo"
          tipo="url"
          valor={dados.siteExterno}
          aoMudar={mudar('siteExterno')}
          ajuda="Se preenchido, o card da galeria abre este site em vez da página."
        />
      </div>
      <label className={styles.checkbox}>
        <input type="checkbox" checked={dados.ativo} onChange={(e) => mudar('ativo')(e.target.checked)} />
        PET ativo (aparece na galeria)
      </label>
    </Bloco>
  )
}

// 1. Identidade: logo, cor de destaque e foto de capa
export function BlocoIdentidade({ pet, salvar, dono }) {
  const [logo, setLogo] = useState(pet.logo)
  const [cor, setCor] = useState(pet.corDestaque)
  const [capa, setCapa] = useState(pet.fotoCapa ?? null)

  return (
    <Bloco
      titulo="1. Identidade"
      descricao="Logo, cor usada no topo da página e foto larga de capa."
      aoSalvar={() => salvar({ logo, corDestaque: cor, fotoCapa: capa }, 'Identidade')}
    >
      <CampoImagem rotulo="Logo" valor={logo} aoMudar={setLogo} dono={dono} ladoMaximo={800} formato="logo" />
      <div className="campo">
        <label htmlFor="campo-cor">Cor de destaque</label>
        <div className={styles.corLinha}>
          <input id="campo-cor" type="color" value={cor ?? COR_PADRAO} onChange={(e) => setCor(e.target.value)} />
          <span>{cor ?? 'cores padrão do site'}</span>
          {cor && (
            <button type="button" className={styles.linkBotao} onClick={() => setCor(null)}>
              Usar as cores padrão
            </button>
          )}
        </div>
      </div>
      <CampoImagem rotulo="Foto de capa" valor={capa} aoMudar={setCapa} dono={dono} />
    </Bloco>
  )
}

// 2. Foto do grupo
export function BlocoFotoGrupo({ pet, salvar, dono }) {
  const [foto, setFoto] = useState(pet.fotoGrupo ?? null)
  return (
    <Bloco titulo="2. Foto do grupo" exigeLgpd aoSalvar={() => salvar({ fotoGrupo: foto }, 'Foto do grupo')}>
      <CampoImagem rotulo="Foto do grupo" valor={foto} aoMudar={setFoto} dono={dono} />
    </Bloco>
  )
}

// 3. Sobre nós: parágrafos
export function BlocoSobre({ pet, salvar }) {
  const [sobre, setSobre] = useState(pet.sobre ?? [])
  return (
    <Bloco
      titulo="3. Sobre nós"
      descricao="Um parágrafo por caixa. Texto simples (sem formatação)."
      aoSalvar={() => salvar({ sobre: sobre.map(limpar).filter(Boolean) }, 'Sobre nós')}
    >
      <ListaEditavel
        itens={sobre}
        aoMudar={setSobre}
        novoItem={() => ''}
        maximo={LIMITES.sobre}
        rotuloItem="parágrafo"
        renderItem={(paragrafo, mudar, i) => (
          <textarea
            className={styles.textarea}
            value={paragrafo}
            onChange={(e) => mudar(e.target.value)}
            aria-label={`Parágrafo ${i + 1}`}
            rows={4}
          />
        )}
      />
    </Bloco>
  )
}

// 4. Tutor(a)
export function BlocoTutor({ pet, salvar, dono }) {
  const [tutor, setTutor] = useState({ nome: '', foto: null, descricao: '', ...pet.tutor })
  const mudar = (campo) => (valor) => setTutor({ ...tutor, [campo]: valor })

  function aoSalvar() {
    const nome = limpar(tutor.nome)
    // Sem nome, a seção do tutor some da página
    const novo = nome ? { nome, foto: tutor.foto, descricao: limpar(tutor.descricao) } : null
    return salvar({ tutor: novo }, 'Tutor(a)')
  }

  return (
    <Bloco titulo="4. Tutor(a)" exigeLgpd aoSalvar={aoSalvar}>
      <Campo rotulo="Nome do(a) tutor(a)" valor={tutor.nome} aoMudar={mudar('nome')} />
      <CampoImagem rotulo="Foto" valor={tutor.foto} aoMudar={mudar('foto')} dono={dono} ladoMaximo={480} formato="quadrado" />
      <Campo rotulo="Descrição curta" valor={tutor.descricao} aoMudar={mudar('descricao')} multilinha rows={3} />
    </Bloco>
  )
}

// 5. Membros
export function BlocoMembros({ pet, salvar, dono }) {
  const [membros, setMembros] = useState(pet.membros ?? [])

  function aoSalvar() {
    const limpos = membros
      .map((m) => ({ nome: limpar(m.nome), curso: limpar(m.curso), foto: m.foto ?? null }))
      .filter((m) => m.nome || m.curso || m.foto)
    return salvar({ membros: limpos }, 'Membros')
  }

  return (
    <Bloco titulo="5. Membros" exigeLgpd aoSalvar={aoSalvar}>
      <ListaEditavel
        itens={membros}
        aoMudar={setMembros}
        novoItem={() => ({ nome: '', curso: '', foto: null })}
        maximo={LIMITES.membros}
        rotuloItem="membro"
        renderItem={(membro, mudar, i) => (
          <div className={styles.membroItem}>
            <CampoImagem
              rotulo="Foto (opcional)"
              valor={membro.foto}
              aoMudar={(foto) => mudar({ ...membro, foto })}
              dono={dono}
              ladoMaximo={480}
              formato="quadrado"
            />
            <div>
              <Campo rotulo="Nome" idExtra={i} valor={membro.nome} aoMudar={(nome) => mudar({ ...membro, nome })} />
              <Campo
                rotulo="Curso ou frente"
                idExtra={i}
                valor={membro.curso}
                aoMudar={(curso) => mudar({ ...membro, curso })}
              />
            </div>
          </div>
        )}
      />
    </Bloco>
  )
}

// 6. Atividades e projetos
export function BlocoProjetos({ pet, salvar, dono }) {
  const [projetos, setProjetos] = useState(pet.projetos ?? [])

  function aoSalvar() {
    const limpos = projetos
      .map((p) => ({
        titulo: limpar(p.titulo),
        descricao: limpar(p.descricao),
        imagem: p.imagem ?? null,
        link: limpar(p.link),
      }))
      .filter((p) => p.titulo || p.descricao || p.imagem || p.link)
    return salvar({ projetos: limpos }, 'Atividades e projetos')
  }

  return (
    <Bloco titulo="6. Atividades e projetos" aoSalvar={aoSalvar}>
      <ListaEditavel
        itens={projetos}
        aoMudar={setProjetos}
        novoItem={() => ({ titulo: '', descricao: '', imagem: null, link: null })}
        maximo={LIMITES.projetos}
        rotuloItem="atividade"
        renderItem={(projeto, mudar, i) => (
          <>
            <Campo rotulo="Título" idExtra={i} valor={projeto.titulo} aoMudar={(titulo) => mudar({ ...projeto, titulo })} />
            <Campo
              rotulo="Descrição"
              idExtra={i}
              multilinha
              rows={3}
              valor={projeto.descricao}
              aoMudar={(descricao) => mudar({ ...projeto, descricao })}
            />
            <CampoImagem
              rotulo="Imagem (opcional)"
              valor={projeto.imagem}
              aoMudar={(imagem) => mudar({ ...projeto, imagem })}
              dono={dono}
              ladoMaximo={1200}
            />
            <Campo
              rotulo="Link (opcional)"
              idExtra={i}
              tipo="url"
              placeholder="https://"
              valor={projeto.link}
              aoMudar={(link) => mudar({ ...projeto, link })}
            />
          </>
        )}
      />
    </Bloco>
  )
}

// 7. Galeria
export function BlocoGaleria({ pet, salvar, dono }) {
  const [fotos, setFotos] = useState(pet.galeria ?? [])

  function aoSalvar() {
    // Itens sem foto são ignorados
    const limpas = fotos.filter((f) => f.src).map((f) => ({ src: f.src, legenda: limpar(f.legenda) }))
    return salvar({ galeria: limpas }, 'Galeria')
  }

  return (
    <Bloco titulo="7. Galeria" exigeLgpd aoSalvar={aoSalvar}>
      <ListaEditavel
        itens={fotos}
        aoMudar={setFotos}
        novoItem={() => ({ src: null, legenda: '' })}
        maximo={LIMITES.galeria}
        rotuloItem="foto"
        renderItem={(foto, mudar, i) => (
          <>
            <CampoImagem rotulo="Foto" valor={foto.src} aoMudar={(src) => mudar({ ...foto, src })} dono={dono} />
            <Campo rotulo="Legenda" idExtra={i} valor={foto.legenda} aoMudar={(legenda) => mudar({ ...foto, legenda })} />
          </>
        )}
      />
    </Bloco>
  )
}

const REDES = [
  ['instagram', 'Instagram'],
  ['linktree', 'Linktree'],
  ['linkedin', 'LinkedIn'],
  ['youtube', 'YouTube'],
  ['telegram', 'Telegram'],
  ['site', 'Site do grupo'],
]

// 8. Contato e redes
export function BlocoContato({ pet, salvar }) {
  const [email, setEmail] = useState(pet.email ?? '')
  const [endereco, setEndereco] = useState(pet.endereco ?? '')
  const [redes, setRedes] = useState({ ...pet.redes })

  function aoSalvar() {
    const redesLimpas = Object.fromEntries(REDES.map(([chave]) => [chave, limpar(redes[chave])]))
    return salvar({ email: limpar(email), endereco: limpar(endereco), redes: redesLimpas }, 'Contato e redes')
  }

  return (
    <Bloco titulo="8. Contato e redes" descricao="Os links precisam começar com https://" aoSalvar={aoSalvar}>
      <div className={styles.grade2}>
        <Campo rotulo="E-mail" tipo="email" valor={email} aoMudar={setEmail} />
        <Campo rotulo="Endereço" valor={endereco} aoMudar={setEndereco} />
        {REDES.map(([chave, nome]) => (
          <Campo
            key={chave}
            rotulo={nome}
            tipo="url"
            placeholder="https://"
            valor={redes[chave]}
            aoMudar={(valor) => setRedes({ ...redes, [chave]: valor })}
          />
        ))}
      </div>
    </Bloco>
  )
}
