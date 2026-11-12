# Site Oficial dos PETs USP — Especificação

> Documento de referência para quem for construir o site (pessoas ou agente de código).
> Última atualização: 12/11/2026 (incorpora as decisões de 11/11). **Apresentação aos tutores: sexta, 13/11/2026.**

---

## 1. Contexto

- O **PET (Programa de Educação Tutorial)** é um programa do MEC com grupos de alunos de graduação orientados por um professor tutor, atuando no tripé **ensino, pesquisa e extensão**. A USP tem 22 grupos PET (os do Figma) em vários campi.
- O **PET Computação (ICMC-USP, São Carlos)** ficou responsável por criar o site geral dos PETs da USP. Quem cuida disso é a frente **CEPETUSP**, dentro do PET Computação.
- O site é apresentado **como produto** (sem "Beta" nem faixas de demonstração).
- **Ideia central:** **cada PET edita a própria página** (textos, fotos, membros, projetos, redes) pelo site, e a mudança **é publicada na hora**. Não há fila de pedidos. O CEPETUSP cria as contas, pode editar qualquer página e restaurar versões anteriores. As **notícias** da Home são publicadas pela **secretaria do PET USP** e falam do programa como um todo.
- **Arquitetura:** é **um único site**. Cada PET tem uma página em `/pets/:slug`, gerada por um template a partir dos dados do PET. Se algum PET preferir manter o site próprio, o card aponta para o link externo (`siteExterno`).
- **Hospedagem:** VM da **Reitoria**, domínio **usp.br** (não icmc.usp.br, porque atende vários PETs).
- **Banco de dados: ainda NÃO decidido.** A escolha será feita com o professor que administra os bancos do ICMC. O documento para essa reunião é [`docs/modelo-de-dados.md`](modelo-de-dados.md). Até lá, tudo roda no **modo local** (§7.4).

## 2. Escopo

1. **Páginas públicas:** Home, Todos os PETs (filtros e ordenação), Sobre o programa, Institucional, página de cada PET (os 22), Notícias (`/noticias` e `/noticias/:id`), Créditos das imagens e 404.
2. **Login** (contas criadas pelo CEPETUSP, sem cadastro público) com três perfis: `pet`, `cepet` e `secretaria`.
3. **Área do PET:** editor "Editar minha página", publicado na hora.
4. **Painel do CEPETUSP:** lista dos 22 PETs com completude, o mesmo editor para qualquer PET (com os campos estruturais liberados) e o histórico com restauração.
5. **Notícias:** administração pela secretaria (e pelo CEPETUSP).
6. **Fotos reais:** campi (Wikimedia Commons, com crédito) e o PET Computação completo, como vitrine.
7. Responsivo (desktop e celular).

**Fora do escopo agora:** banco/servidor reais (dependem da decisão de §1), notícias automáticas do Jornal da USP e i18n.

**Conteúdo:** nunca inventar dados pessoais (nomes, fotos, tutores) de PETs reais. Os PETs ainda não preenchidos mostram logo, capa (foto do campus), um parágrafo curto e factual ("Grupo PET da FFLCH-USP, em São Paulo, na área de Ciências Humanas.") e, nas seções vazias, o estado vazio *"Esta seção ainda está sendo preenchida pelo grupo."* Isso também mostra aos tutores o que eles mesmos vão preencher.

## 3. Stack e restrições

- **React + Vite com JavaScript puro (sem TypeScript).** A equipe não usa TS.
- **React Router** (`react-router-dom`) com `BrowserRouter` e rotas declarativas.
- **CSS Modules** (`*.module.css`) + variáveis CSS globais (`src/styles/tokens.css`). **Sem** Tailwind e **sem** biblioteca de componentes.
- **Nenhum provedor de banco** (Supabase, Firebase etc.) até a decisão de §1. Todo acesso a dados passa por `src/services/`.
- Fontes: `@fontsource/ubuntu` (títulos) e `@fontsource/open-sans` (texto).
- Ícones: SVG inline em `src/components/icons/`. Carrosséis próprios e simples.
- Todo texto da interface em **português (pt-BR)**; comentários de código em português, curtos, explicando o porquê.

## 4. Design (do protótipo no Figma)

Arquivo: https://www.figma.com/site/OhCHD6n1okEsLYDuLin22l/SIte-Oficial-dos-PETs-USP
O Pedro tem acesso de editor no Figma, mas a conta conectada ao MCP do Figma ainda não (ver §11). As referências visuais estão em `docs/figma-refs/` (capturas de tela do protótipo). Os valores abaixo foram medidos nessas capturas, então são aproximados.

### 4.1 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#2B17D0` | barra de navegação, destaques, botões primários |
| `--color-primary-dark` | `#222093` | títulos (ex.: "Desde 1979", "Últimas Notícias") |
| `--color-heading` | `#3F4092` | título "Programa de Educação Tutorial" no cabeçalho |
| `--color-muted` | `#AFAFAF` | subtítulo "Na Universidade de São Paulo" |
| `--color-text` | `#555555` | texto corrido |
| `--color-highlight` | `#F9D057` | fundo amarelo atrás de subtítulos ("na Universidade de São Paulo") |
| `--color-accent-shadow` | `#FEC23D` | sombra deslocada amarela do card ativo |
| `--gradient-cta` | `linear-gradient(90deg, #FF9002, #FAB905)` | botão "Veja mais!" |
| `--color-teal` | `#009AAD` | faixa do rodapé, detalhes |
| `--color-yellow` | `#FFB801` | faixa do rodapé |
| `--color-surface` | `#F5F5F5` | cards de logo, áreas placeholder |
| `--color-border` | `#E3E3E3` | bordas de cards |
| `--radius` | `12px` (cards), `8px` (botões, chips) | |
| `--container` | `1100px` máx., padding lateral 24px | frame de 1280 no Figma |

Fontes: títulos em **Ubuntu Bold**; texto em **Open Sans** (400/600/700). O título do cabeçalho ("Programa de Educação Tutorial") é Open Sans Bold.

### 4.2 Componentes globais

- **Cabeçalho** (`docs/figma-refs/05-cabecalho-200pct.jpg`): faixa branca com o logo **PET | USP** (`public/brand/logo-pet-usp.png`, provisório e em baixa resolução) + "Programa de Educação Tutorial" / "Na Universidade de São Paulo". Abaixo vem a **barra azul** (`--color-primary`) com os links brancos: *Todos os PETs da USP*, *Sobre o programa na USP*, *Institucional*.
  - **Acréscimo (não está no Figma):** um link discreto **"Área dos PETs"** à direita da barra azul. Ele leva a `/entrar` ou, para quem já entrou, ao lugar do perfil: `pet` → editor da página, `secretaria` → notícias, `cepet` → painel.
  - No celular, a barra vira um menu hambúrguer.
- **Rodapé** (`04-home-rodape.jpg`): duas faixas horizontais, uma **teal** (`#009AAD`) e uma **amarela** (`#FFB801`), separadas por uma faixa branca fina. Acrescente acima delas um bloco simples com o nome do programa, os links principais e "Mantido pelo PET Computação ICMC-USP (CEPETUSP)".
- **Breadcrumb** pequeno no topo das páginas internas (ex.: `Início › Todos os PETs da USP`).
- **Título de seção:** título em Ubuntu Bold azul-escuro centralizado + subtítulo com **fundo amarelo** (`--color-highlight`), como em "Desde 1979 / na Universidade de São Paulo".

## 5. Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home | público |
| `/todos-os-pets-da-usp` | Galeria de todos os PETs | público |
| `/pets/:slug` | Página de um PET | público |
| `/sobre-o-programa-na-usp` | Sobre o programa | público |
| `/institucional` | Institucional | público |
| `/noticias` | Todas as notícias publicadas | público |
| `/noticias/:id` | Página de uma notícia | público (rascunhos só para quem edita notícias) |
| `/creditos` | Créditos das imagens | público |
| `/entrar` | Login | público |
| `/area-do-pet` | Editar minha página | perfil `pet` |
| `/painel` | Lista dos PETs (CEPETUSP) | perfil `cepet` |
| `/painel/pets/:slug` | Editor de qualquer PET | perfil `cepet` |
| `/painel/pets/:slug/historico` | Histórico de versões | perfil `cepet` |
| `/noticias-admin` | Lista de notícias | perfis `secretaria` e `cepet` |
| `/noticias-admin/nova`, `/noticias-admin/:id` | Formulário de notícia | perfis `secretaria` e `cepet` |
| `*` | 404 | público |

As rotas logadas usam `<RotaProtegida perfis={[...]}>`: quem não entrou vai para `/entrar`, e quem tem outro perfil vai para a própria área. **Isso só esconde a tela:** as permissões de verdade são checadas nos services (e, no futuro, no servidor). Configure o *rewrite* de SPA no deploy.

## 6. Páginas

### 6.1 Home (`01`, `02`, `03`, `04`, `06` em figma-refs)
1. **Carrossel de destaque** (4 slides, troca a cada 6 s): fotos dos campi Cidade Universitária (Praça do Relógio), São Carlos, Piracicaba (ESALQ) e Ribeirão Preto, com legenda, título e link (`src/content/home.js`). Crédito pequeno sobre cada foto.
2. **"Desde 1979" / "na Universidade de São Paulo"** (título de seção).
3. Duas colunas: **"Rápida História dos PETs dentro da USP"** com o botão **"Veja mais!"**, e **"Conheça nossos pilares"** (Ensino, Pesquisa, Extensão), com o *hover* azul e a sombra amarela.
4. **"Últimas Notícias"**: as **6 mais recentes já publicadas**, lidas de `services/noticias.js`, com miniatura, data, título e resumo. O card abre `/noticias/:id` ou, se a notícia tiver só link externo, o próprio link. Botão "Ver todas as notícias".
5. Rodapé (com link para "Créditos das imagens").

### 6.2 Todos os PETs (`07`, `08`, `09`)
- Breadcrumb. Título **"Galeria de Todos os Programas"** + subtítulo azul **"de Educação Tutorial da USP"** à esquerda.
- À direita, a **Ordenação**: botões segmentados **"Ano de Criação"** e **"A → Z"**. O padrão é A → Z; PETs sem ano vão para o fim.
- **Painel "Filtros"** recolhível (ícone de funil, fundo `--color-surface`):
  - *Área de Conhecimento:* chips de seleção múltipla: Ciências Humanas, Ciências Sociais Aplicadas, Ciências da Saúde, Engenharia, Ciências Exatas e da Terra, Ciências Agrárias.
  - *Campus USP:* `<select>` com "Selecionar" e depois a lista de campi presentes nos dados.
  - Mostre um link "Limpar filtros" e o contador "N programas".
- **Grade de cards:** 4 colunas no desktop, 2 no tablet, 1 ou 2 no celular. Cada card tem fundo `--color-surface`, cantos arredondados e o logo centralizado. No *hover*, ele sobe levemente com sombra. Clicar leva a `/pets/:slug` (ou abre `siteExterno` em nova aba). O nome do PET fica em `alt` e `aria-label`. O logo aparece com `object-fit: contain` e `max-height` de 96 px, **sem largura fixa**, para nunca ser ampliado além do tamanho natural (não borrar). PETs com `ativo: false` não aparecem.
- Mensagem amigável quando nenhum PET combina com os filtros.

### 6.3 Sobre o programa (`11`)
- Título **"Sobre o Programa de Educação Tutorial"** + subtítulo amarelo **"na Universidade de São Paulo"**.
- Seções: **História do PET na USP**, **O que é Educação Tutorial?** (com a foto `computacao/galeria/2025-imersao.png` à direita), **Como funciona um PET?** (com lista) e **Organograma** (imagem placeholder).
- O conteúdo fica em `src/content/sobre.js`. **Os textos do Figma são lorem ipsum.** Escreva um texto provisório factual e curto (o PET foi criado em 1979 pela CAPES como *Programa Especial de Treinamento*, passou ao MEC/SESu e foi renomeado *Programa de Educação Tutorial* em 2004, e é regido pela Lei nº 11.180/2005 e pela Portaria MEC nº 976/2010; tripé ensino-pesquisa-extensão; grupo de até 12 bolsistas e um tutor) e marque com `// TODO: texto oficial`.

### 6.4 Institucional (`14`)
- Está **vazia no Figma**. Crie uma página simples com: o papel da Pró-Reitoria de Graduação e do CLAA (Comitê Local de Acompanhamento e Avaliação), uma lista de documentos (links, em `src/content/institucional.js`) e o contato. Marque o conteúdo com `TODO`.

### 6.5 Página de um PET (`12` = V1 e V2, `13` = base)
Os dados vêm de `services/pets.js` (com estados de carregando e de erro). As seções, na mesma ordem do editor:
1. **Capa:** faixa larga com a `fotoCapa` (foto da unidade ou do campus, ver §7.2) e um gradiente da `corDestaque` por cima (padrão: `--color-primary`); nome, "Programa de Educação Tutorial da USP", unidade · campus · área e o logo numa caixa branca. Crédito da foto no canto, quando for do Commons.
2. **Foto do grupo** grande e arredondada (só aparece se existir).
3. **Sobre nós:** parágrafos.
4. **Membros:** tutor(a) em destaque e carrossel de avatares (foto ou iniciais) com nome e curso/frente.
5. **Atividades e Projetos:** carrossel de cards (imagem, título, descrição e link opcional).
6. **Galeria:** fotos com legenda.
7. **Redes Sociais e Contato:** Instagram, Linktree, LinkedIn, YouTube, Telegram, site, e-mail e endereço (só o que existir).

As seções 3 a 7 sem dados mostram o estado vazio *"Esta seção ainda está sendo preenchida pelo grupo."* No fim da página: *"Faz parte deste PET? Edite esta página na Área dos PETs."*

### 6.6 Login (`/entrar`)
E-mail + senha e o botão "Entrar". Sem cadastro público: o texto diz que as contas são criadas pelo CEPETUSP. "Esqueci minha senha" mostra um aviso por enquanto. As contas de teste aparecem **só num quadro discreto** nesta página.

### 6.7 Área do PET (`/area-do-pet`): "Editar minha página"
- Topo com o nome do PET, o link "Ver a página" (nova aba) e "Última alteração em … por …".
- Campos estruturais (nome, unidade, campus, área e ano) **só para leitura**, com a nota "para alterar, fale com o CEPETUSP".
- Formulário dividido nas seções da página pública, cada uma num **bloco recolhível com o próprio botão Salvar**:
  1. **Identidade:** logo (upload), cor de destaque (input color, com "usar as cores padrão") e foto de capa (upload).
  2. **Foto do grupo** (upload).
  3. **Sobre nós:** parágrafos (adicionar, remover, reordenar).
  4. **Tutor(a):** nome, foto e descrição curta.
  5. **Membros:** nome, curso/frente e foto opcional, com adicionar, remover e reordenar por botões ↑↓ (sem arrastar).
  6. **Atividades e projetos:** título, descrição, imagem e link.
  7. **Galeria:** fotos com legenda.
  8. **Contato e redes:** e-mail, endereço, Instagram, Linktree, LinkedIn, YouTube, Telegram e site.
- **LGPD:** ao salvar foto do grupo, tutor, membros ou galeria, é obrigatório marcar *"Confirmo que as pessoas identificadas autorizaram a publicação de nome e imagem."*
- Feedback: "Salvo! Já está no ar." e mensagens de erro em português.
- Uploads: a imagem é reduzida no navegador antes de enviar (canvas, lado maior até 1600 px; 480 px para fotos de pessoas; WebP ou JPEG com qualidade 0,85). Aceita JPEG, PNG e WebP de até 5 MB.

### 6.8 Painel do CEPETUSP (`/painel`)
- Lista dos 22 PETs: logo, nome, última alteração (data e autor) e indicadores de completude (capa, membros, projetos), com contadores no topo. Atalho para as notícias.
- **Editar** abre o mesmo editor da Área do PET, para qualquer PET, com um bloco extra de **dados estruturais** liberado (nome, unidade, campus, área, ano, site externo e "ativo").
- **Histórico** lista as versões (a mais recente marcada como "atual") com o botão **"Restaurar esta versão"** e confirmação na própria página.

### 6.9 Notícias (`/noticias-admin`, perfis `secretaria` e `cepet`)
- Lista com o status Publicada/Rascunho e os botões nova, editar e excluir (com confirmação na própria página).
- Formulário: título, resumo, texto (simples, com parágrafos separados por linha em branco), imagem (upload com redução), link externo opcional, data e "publicada".
- A secretaria **não** edita páginas de PETs.

## 7. Dados

### 7.1 Entidades e permissões (independentes de tecnologia)

| Entidade | Campos principais | Leitura | Escrita |
|---|---|---|---|
| **Conta** | id, nome, e-mail, perfil (`pet` · `cepet` · `secretaria`), pet_slug (só perfil `pet`) | a própria conta; CEPETUSP vê todas | só o CEPETUSP cria e desativa contas |
| **PET** | slug, nome, unidade, campus, area, anoCriacao, siteExterno, ativo (*estruturais*); logo, corDestaque, fotoCapa, fotoGrupo, sobre[], tutor{}, membros[], projetos[], galeria[], redes{}, email, endereco (*conteúdo*); atualizadoEm, atualizadoPor | público | conteúdo: o próprio PET ou o CEPETUSP; estruturais: só o CEPETUSP |
| **Versão de PET** | id, pet_slug, dados (cópia completa), editadoPor, editadoEm, descricao | o próprio PET e o CEPETUSP | automática a cada alteração; só o CEPETUSP restaura |
| **Notícia** | id, titulo, resumo, texto, imagem, linkExterno, dataPublicacao, publicada (bool), autor | público (só as publicadas) | secretaria e CEPETUSP |
| **Imagem** | caminho `<dono>/<arquivo>`, tipo, tamanho | público | só na pasta do próprio PET (`pets/<slug>/`) ou de notícias (`noticias/`, secretaria) |

Limites: imagens de até 5 MB (jpeg, png, webp); até 10 parágrafos no "sobre", 60 membros, 30 projetos e 30 fotos na galeria. Textos sempre como texto puro (sem HTML ou Markdown renderizado). Links só com `https://`. O detalhamento para a escolha do banco está em [`docs/modelo-de-dados.md`](modelo-de-dados.md).

### 7.2 Conteúdo inicial (no repositório)

`src/content/pets/<slug>.js` e `src/content/noticias.js` são o **conteúdo inicial**: o modo local parte deles e, no futuro, eles servem para popular o banco. `src/content/pets/index.js` exporta a lista (`listaPets`) e as 6 áreas. As imagens ficam em `public/pets/<slug>/` e `public/fotos/`.

```js
// src/content/pets/<slug>.js
export default {
  slug: 'computacao', nome: 'PET Computação', unidade: 'ICMC', campus: 'São Carlos',
  area: 'Ciências Exatas e da Terra', anoCriacao: 1995, siteExterno: null,
  logo: '/pets/computacao/logo.png', corDestaque: '#127E3F',
  fotoCapa: '/pets/computacao/capa.jpg', fotoGrupo: '/pets/computacao/grupo.png',
  sobre: ['Parágrafo 1'],
  tutor: { nome, foto, descricao },          // ou null
  membros: [{ nome, curso, foto }],
  projetos: [{ titulo, descricao, imagem, link }],
  galeria: [{ src, legenda }],
  redes: { instagram, linktree, linkedin, youtube, telegram, site },
  email: null, endereco: null,
}
```

**Os 22 PETs** (o que está com ⚠️ precisa ser confirmado com a frente):

| slug | nome | unidade | campus | área | obs. |
|---|---|---|---|---|---|
| `adm` | PET ADM | FEA | São Paulo | Ciências Sociais Aplicadas | |
| `biotecnologia-agricola` | PET Biotecnologia Agrícola | ESALQ | Piracicaba | Ciências Agrárias | |
| `ciencias-sociais` | PET Ciências Sociais | FFLCH | São Paulo | Ciências Humanas | ⚠️ unidade |
| `computacao` | PET Computação | ICMC | São Carlos | Ciências Exatas e da Terra | |
| `direitos-fdrp` | PET Direitos | FDRP | Ribeirão Preto | Ciências Sociais Aplicadas | |
| `ecologia` | PET Ecologia | ESALQ | Piracicaba | Ciências Agrárias | ⚠️ área (não há "Biológicas" no filtro) |
| `eefe` | PET EEFE | EEFE | São Paulo | Ciências da Saúde | ⚠️ |
| `enfermagem-eerp` | PET Enfermagem | EERP | Ribeirão Preto | Ciências da Saúde | |
| `engenharia-de-alimentos` | PET Engenharia de Alimentos | FZEA | Pirassununga | Engenharia | ⚠️ |
| `filosofia` | PET Filosofia | FFLCH | São Paulo | Ciências Humanas | logo do pássaro rosa; site https://petfilosofia.fflch.usp.br |
| `fonoaudiologia` | PET Fonoaudiologia | FOB | Bauru | Ciências da Saúde | |
| `gaea` | PET Gaea | ESALQ | Piracicaba | Ciências Agrárias | ⚠️ |
| `historia` | PET História | FFLCH | São Paulo | Ciências Humanas | |
| `mecanica` | PET Mecânica | EESC | São Carlos | Engenharia | ⚠️ unidade |
| `mecatronica` | PET Mecatrônica | EESC | São Carlos | Engenharia | ⚠️ unidade |
| `pet-arvore` | PET Medicina – Cursinho Popular | FMRP | Ribeirão Preto | Ciências da Saúde | ⚠️ logo do Cursinho Popular do PET-Medicina, gerido pelo PET FMRP: pode ser duplicado do `fmrp` |
| `fmrp` | PET FMRP (Medicina) | FMRP | Ribeirão Preto | Ciências da Saúde | |
| `quimica-rp` | PET Química USP RP | FFCLRP | Ribeirão Preto | Ciências Exatas e da Terra | |
| `iqsc` | PET IQSC (Química) | IQSC | São Carlos | Ciências Exatas e da Terra | |
| `si-each` | PET SI | EACH | São Paulo | Ciências Exatas e da Terra | ⚠️ |
| `direito-fdusp` | PET Direito | FDUSP | São Paulo | Ciências Sociais Aplicadas | |
| `zootecnia-fzea` | PET Zootecnia | FZEA | Pirassununga | Ciências Agrárias | ⚠️ |

O **PET Computação** tem conteúdo real (texto, 16 membros, 8 atividades, redes e galeria), tirado do site oficial do grupo, como vitrine. Os outros 21 têm só os dados estruturais, um parágrafo factual e a capa.

**Capa de cada PET** (o PET pode trocar pelo editor):

| PET (slug) | capa (`public/fotos/`) |
|---|---|
| adm | `fea` |
| biotecnologia-agricola, ecologia, gaea | `campus-piracicaba` |
| ciencias-sociais, historia, filosofia | `fflch` |
| computacao | foto própria (`public/pets/computacao/capa.jpg`) |
| direito-fdusp | `fd-largo-sao-francisco` |
| direitos-fdrp, enfermagem-eerp, fmrp, pet-arvore, quimica-rp | `campus-ribeirao` |
| eefe | `campus-butanta` |
| engenharia-de-alimentos, zootecnia-fzea | `campus-pirassununga` |
| fonoaudiologia | `campus-bauru` |
| iqsc, mecanica, mecatronica | `campus-sao-carlos` |
| si-each | `each` |

### 7.3 Fotos e créditos

- `npm run fotos` (`scripts/baixar-fotos.mjs`, Node 18+, sem dependências) baixa:
  1. as imagens do **PET Computação** do site oficial do grupo (logo, banner do grupo, capa, galeria, fotos dos membros e ilustrações das frentes). Os nomes com hash mudam quando o site do grupo é republicado: se der 404, pegue o endereço atual em https://pet.icmc.usp.br;
  2. as fotos dos **campi e unidades** pela API do **Wikimedia Commons**, aceitando só imagens horizontais, com ≥ 1600 px e licença CC0, domínio público, CC BY ou CC BY-SA, salvas em 1920 px em `public/fotos/<chave>.jpg`. As escolhas conferidas à mão ficam em `ESCOLHAS_MANUAIS` e têm prioridade sobre a busca. **Abra cada foto baixada e confira se ela mostra mesmo o lugar.**
- `npm run fotos:otimizar` (`scripts/otimizar-fotos.py`, Python 3 + Pillow + Chrome) reduz as fotos do PET Computação (até 1600 px; membros 480 px), recomprime as dos campi e converte as ilustrações das frentes (SVGs com fotos de vários MB embutidas) em WebP.
- `public/fotos/creditos.json` (`{ arquivo, titulo, autor, licenca, urlLicenca, urlOrigem }`) alimenta a página **`/creditos`** e o crédito pequeno sobre cada capa e slide ("Foto: Autor / Wikimedia Commons, CC BY-SA 4.0"). Toda foto de terceiros precisa de licença compatível e de crédito.

### 7.4 Camada de serviço e modo local

```
src/services/
  auth.js       entrar, sair, usuarioAtual, aoMudarSessao, recuperarSenha (+ CONTAS_TESTE)
  pets.js       listarPets(), buscarPet(slug), atualizarPet(slug, campos, descricao),
                enviarImagem(dono, arquivo), listarVersoes(slug), restaurarVersao(slug, idVersao)
  noticias.js   listarNoticias({ incluirRascunhos }), buscarNoticia(id), salvarNoticia(dados), excluirNoticia(id)
  imagens.js    enviarImagem(dono, arquivo, ladoMaximo) → caminho; urlImagem(caminho) → src do <img>
  creditos.js   listarCreditos(), buscarCredito(caminho)
  local/        implementação de tudo acima com localStorage, incluindo permissoes.js e validacao.js
```

- As páginas **só** falam com `src/services/`. Cada função delega para `services/local/` e tem um comentário dizendo o que o backend futuro precisa fazer. **Quando o banco for escolhido, só os arquivos de `services/` mudam.**
- **Toda regra de permissão e validação também é checada no modo local**, para que o comportamento na apresentação seja o mesmo do sistema real.
- No modo local, os PETs editados e o histórico ficam no `localStorage` (até 30 versões por PET, incluindo a versão inicial). Cada imagem enviada fica numa chave própria, como data URL, e os dados guardam só a referência `local-imagem:<id>`; se o `localStorage` encher, aparece um aviso em português.
- Contas de teste (senha `demo1234`): `computacao@demo.pet` (PET Computação), `filosofia@demo.pet` (PET Filosofia), `cepet@demo.pet` (CEPETUSP) e `secretaria@demo.pet` (secretaria). Elas aparecem só no quadro discreto de `/entrar`; **não há faixa nem selo de demonstração no site público**.
- O `AuthContext` (React Context) expõe `{ usuario, perfil, petSlug, carregando, entrar, sair }`.

## 8. Estrutura de pastas

```
src/
  main.jsx, App.jsx            rotas
  styles/                      tokens.css, global.css
  components/                  Header, Footer, Breadcrumb, SectionTitle, Carousel, CarrosselRolagem, PetCard,
                               Avatar, EstadoVazio, CreditoFoto, NoticiaCard, CabecalhoArea, RotaProtegida, icons/,
                               Editor/ (EditorPet, Blocos, Bloco, ListaEditavel, CampoImagem)
  pages/                       Home, TodosPets, PetPage, Sobre, Institucional, Noticias, Creditos, Entrar, NotFound,
                               area/EditarPagina, painel/(Painel, EditarPetPainel, Historico),
                               noticiasAdmin/(NoticiasAdmin, EditarNoticia)
  content/                     conteúdo inicial: home.js, noticias.js, sobre.js, institucional.js, pets/*.js
  services/                    ver §7.4
  context/AuthContext.jsx
  hooks/                       useDados (carregando/erro), useTituloPagina
  utils/                       datas, urlPublica, areaDoPerfil, redimensionarImagem
public/brand/, public/pets/<slug>/, public/fotos/ (+ creditos.json)
scripts/                       baixar-fotos.mjs, otimizar-fotos.py
docs/                          SPEC.md, modelo-de-dados.md, figma-refs/
```

## 9. Logos

1. **Para a apresentação:** usar as cópias do Figma ("Copy as PNG", ≈ 150 px), bem melhores que os recortes atuais (≈ 40–130 px). Renomeie cada uma para `public/pets/<slug>/logo.png`. O CSS nunca amplia o logo além do tamanho natural.
2. **Para melhorar:** pelo Figma MCP (`download_assets`, nó `19:735` do arquivo `OhCHD6n1okEsLYDuLin22l`, campo `rawImages`) ou pelo painel **Export → 4x** do Figma, com a imagem original selecionada.
3. **PET Computação:** logo do site oficial (1268 px), baixado por `npm run fotos`.
4. **Definitivo:** cada PET envia o próprio logo em boa resolução pelo editor.

## 10. Critérios de aceite

- `npm run build` e `npm run lint` sem erros.
- Todas as rotas de §5 funcionam, inclusive ao recarregar a página (rewrite de SPA).
- Os filtros e a ordenação da galeria funcionam combinados; os 22 PETs aparecem, e o card do PET Filosofia tem o nome certo.
- Nenhuma ocorrência visível de "Beta" ou "demonstração" no site público.
- Modo local: entrar como `computacao@demo.pet` → editar o "Sobre nós" e trocar a foto de um membro → salvar → a página pública mostra a mudança na hora. Entrar como `filosofia@demo.pet` → não consegue editar outro PET (nem pela URL). Entrar como `cepet@demo.pet` → vê os 22 PETs, edita qualquer um e restaura uma versão anterior. Entrar como `secretaria@demo.pet` → cria uma notícia com foto, que aparece na Home, e não consegue abrir o editor de nenhum PET. Um PET não consegue abrir `/noticias-admin`.
- Nenhuma dependência ou código de provedor de banco; `docs/modelo-de-dados.md` pronto para a reunião com o professor de BD.
- Todas as fotos do Commons têm crédito em `/creditos`; nenhuma foto sem licença compatível. Nenhum dado pessoal inventado.
- Home, página do PET Computação e página de um PET "vazio" ficam bonitas em 375 px e 1280 px (e o layout funciona em 768 px).
- Visual fiel às capturas em `docs/figma-refs/`.

## 11. Pendências e perguntas em aberto

- **Banco de dados e login reais:** decidir com o professor de BD do ICMC (opções em `docs/modelo-de-dados.md`), incluindo Senha Única USP, backups e limite de armazenamento.
- **Logos:** os 22 PETs usam as cópias do Figma (≈ 110–370 px). O definitivo é cada PET enviar o próprio logo em boa resolução pelo editor.
- `pet-arvore` (Cursinho Popular do PET-Medicina) pode ser duplicado do `fmrp`: discutir com a frente.
- Confirmar os itens com ⚠️ na tabela de PETs.
- PET Computação: confirmar o(a) tutor(a) atual e os membros novos (`TODO` em `computacao.js`).
- Conteúdo oficial: "Sobre o programa", "Institucional", história curta da Home e as primeiras notícias reais (secretaria).
- Fotos: Bauru usa o prédio do Centrinho (HRAC), no mesmo campus da FOB, porque não há foto livre boa da FOB; a FFLCH usa uma foto interna do Prédio das Sociais.
- LGPD: registrar no backend quem confirmou a autorização de nome e imagem, e quando.
- Hospedagem e domínio usp.br pela Reitoria; criar as contas dos 22 PETs, do CEPETUSP e da secretaria.
