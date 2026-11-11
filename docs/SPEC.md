# Site Oficial dos PETs USP — Especificação

> **⚠️ Atualização de 11/11/2026:** partes deste documento foram substituídas por [`docs/SPEC-v2.md`](SPEC-v2.md)
> (sem "Beta", cada PET edita a própria página, fotos reais, 21 PETs). Em caso de conflito, vale o v2.

> Documento de referência para quem for construir o site (pessoas ou agente de código).
> Última atualização: 08/11/2026. **Apresentação: sexta, 13/11/2026.**

---

## 1. Contexto

- O **PET (Programa de Educação Tutorial)** é um programa do MEC com grupos de alunos de graduação orientados por um professor tutor, atuando no tripé **ensino, pesquisa e extensão**. A USP tem cerca de 22 grupos PET em vários campi.
- O **PET Computação (ICMC-USP, São Carlos)** ficou responsável por criar o site geral dos PETs da USP. Quem cuida disso é a frente **CEPETUSP**, dentro do PET Computação.
- **Prazo:** o site precisa estar funcionando na apresentação de **sexta, 13/11**.
- **Ideia central:** o CEPETUSP mantém **todos** os sites. Os outros PETs não programam: eles **pedem** alterações (textos, fotos, membros, projetos) e o CEPETUSP aplica.
  - Antes a ideia era um Google Forms, mas não dava pra saber quem estava pedindo. Por isso, **cada PET terá um login** e fará os pedidos por um formulário dentro do próprio site.
  - O CEPETUSP tem um **painel** pra ver, responder e acompanhar os pedidos.
- **Decisão de arquitetura:** é **um único site**. Cada PET tem uma página em `/pets/:slug` gerada a partir de um **template + arquivo de dados**. Se algum PET já tiver site próprio e preferir mantê-lo, o card dele aponta para o link externo (`siteExterno`).
- O site do PET Computação **não** é uma dessas páginas padrão (ele é um site à parte). Aqui, o PET Computação aparece só como mais um card ou página padrão, como os outros.

## 2. Escopo da entrega de 13/11 (tudo obrigatório)

1. **Páginas públicas:** Home, Todos os PETs (com filtros e ordenação), Sobre o programa, Institucional, Página de cada PET (os 22) e página 404.
2. **Login por PET** e **Área do PET**: criar um pedido de alteração (com anexos) e acompanhar os pedidos e seus status.
3. **Painel do CEPETUSP:** lista de todos os pedidos com filtros, detalhe, mudança de status e resposta ao PET.
4. **Modo demonstração:** se o Supabase não estiver configurado, o login e os pedidos funcionam com `localStorage` e contas de teste, para a apresentação nunca depender de backend.
5. Responsivo (desktop e celular), deploy público (Vercel ou Netlify).

**Fora do escopo agora:** edição de conteúdo pelo próprio PET (publicação direta), notícias automáticas do Jornal da USP, domínio usp.br e i18n.

**Versão de demonstração (beta).** Requisitos:
- Um selo **"Beta"** discreto ao lado do logo no cabeçalho.
- Uma faixa fina no topo de todas as páginas: *"Versão de demonstração — conteúdos ilustrativos, sujeitos a validação pelos grupos PET."*, controlada por uma constante `MODO_BETA` em `src/config.js`, para ser desligada no lançamento.
- O conteúdo provisório dos PETs deve parecer bem acabado visualmente, mas **sem dados pessoais reais**: nada de nomes e fotos de alunos reais (use avatares genéricos e nomes fictícios claramente de exemplo, como "Membro 1").

## 3. Stack e restrições

- **React + Vite com JavaScript puro (sem TypeScript).** A equipe não usa TS.
- **React Router** (`react-router-dom`, já instalado) com `BrowserRouter` e rotas declarativas.
- **CSS Modules** (`*.module.css`) + variáveis CSS globais (design tokens em `src/styles/tokens.css`). **Sem** Tailwind e **sem** biblioteca de componentes. O código deve ser legível para alunos que estão aprendendo.
- **Supabase** (`@supabase/supabase-js`, já instalado) para autenticação, banco (Postgres) e armazenamento de anexos.
- Fontes: `@fontsource/ubuntu` (títulos) e `@fontsource/open-sans` (texto). Instale via npm.
- Ícones: SVG inline em componentes próprios (`src/components/icons/`). Evitar libs grandes.
- Carrossel: componente próprio simples (setas, pontinhos, swipe opcional). Nada de lib pesada.
- Todo texto da interface em **português (pt-BR)**.
- Comentários de código em português, curtos, explicando o porquê.

## 4. Design (do protótipo no Figma)

Arquivo: https://www.figma.com/site/OhCHD6n1okEsLYDuLin22l/SIte-Oficial-dos-PETs-USP
O acesso de edição (necessário para o MCP do Figma) **ainda não existe**. As referências visuais estão em `docs/figma-refs/` (capturas de tela do protótipo). Os valores abaixo foram medidos nessas capturas, então são aproximados.

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
  - **Acréscimo (não está no Figma):** um link discreto **"Área dos PETs"** à direita da barra azul. Ele leva a `/entrar`, ou à área ou painel quando a pessoa já está logada.
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
| `/entrar` | Login | público |
| `/area-do-pet` | Meus pedidos (lista) | perfil `pet` |
| `/area-do-pet/novo` | Novo pedido | perfil `pet` |
| `/area-do-pet/pedidos/:id` | Detalhe do pedido | perfil `pet` (só os do próprio PET) |
| `/painel` | Todos os pedidos (CEPETUSP) | perfil `cepet` |
| `/painel/pedidos/:id` | Detalhe com ações | perfil `cepet` |
| `*` | 404 | público |

As rotas da Área do PET e do Painel ficam protegidas por um componente `<RotaProtegida perfil="pet|cepet">`, que redireciona para `/entrar`. Configure o *rewrite* de SPA no deploy (`vercel.json` já incluso).

## 6. Páginas

### 6.1 Home (`01`, `02`, `03`, `04`, `06` em figma-refs)
1. **Carrossel de destaque:** card grande cinza-claro arredondado, com troca automática a cada 6 s e pontinhos embaixo. Os slides vêm de `src/content/home.js` (imagem, título opcional, link opcional). Sem imagens reais, use placeholders.
2. **"Desde 1979" / "na Universidade de São Paulo"** (título de seção).
3. Duas colunas:
   - Esquerda: **"Rápida História dos PETs dentro da USP"**, parágrafo curto e o botão **"Veja mais!"** (gradiente laranja) que leva a `/sobre-o-programa-na-usp`.
   - Direita: **"Conheça nossos pilares"**, com 3 cards (**Ensino** com ícone de capelo, **Pesquisa** com ícone de livro, **Extensão** com ícone de rede). Os cards são cinza-claros com borda; no *hover/foco*, ficam com borda e texto azuis e uma sombra amarela deslocada (como o card "Extensão" no Figma).
4. **"Últimas Notícias" / "Jornal da USP sobre o PET":** grade de cards de notícia (imagem, data, título, resumo e link externo), vinda de `src/content/noticias.js`. Mostre até 6.
5. Rodapé.

### 6.2 Todos os PETs (`07`, `08`, `09`)
- Breadcrumb. Título **"Galeria de Todos os Programas"** + subtítulo azul **"de Educação Tutorial da USP"** à esquerda.
- À direita, a **Ordenação**: botões segmentados **"Ano de Criação"** e **"A → Z"**. O padrão é A → Z; PETs sem ano vão para o fim.
- **Painel "Filtros"** recolhível (ícone de funil, fundo `--color-surface`):
  - *Área de Conhecimento:* chips de seleção múltipla: Ciências Humanas, Ciências Sociais Aplicadas, Ciências da Saúde, Engenharia, Ciências Exatas e da Terra, Ciências Agrárias.
  - *Campus USP:* `<select>` com "Selecionar" e depois a lista de campi presentes nos dados.
  - Mostre um link "Limpar filtros" e o contador "N programas".
- **Grade de cards:** 4 colunas no desktop, 2 no tablet, 1 ou 2 no celular. Cada card tem fundo `--color-surface`, cantos arredondados e o logo centralizado. No *hover*, ele sobe levemente com sombra. Clicar leva a `/pets/:slug` (ou abre `siteExterno` em nova aba). O nome do PET fica em `alt` e `aria-label`.
- Mensagem amigável quando nenhum PET combina com os filtros.

### 6.3 Sobre o programa (`11`)
- Título **"Sobre o Programa de Educação Tutorial"** + subtítulo amarelo **"na Universidade de São Paulo"**.
- Seções: **História do PET na USP**, **O que é Educação Tutorial?** (com imagem à direita), **Como funciona um PET?** (com lista) e **Organograma** (imagem placeholder).
- O conteúdo fica em `src/content/sobre.js`. **Os textos do Figma são lorem ipsum.** Escreva um texto provisório factual e curto (o PET foi criado em 1979 pela CAPES como *Programa Especial de Treinamento*, passou ao MEC/SESu e foi renomeado *Programa de Educação Tutorial* em 2004, e é regido pela Lei nº 11.180/2005 e pela Portaria MEC nº 976/2010; tripé ensino-pesquisa-extensão; grupo de até 12 bolsistas e um tutor) e marque com `// TODO: texto oficial`.

### 6.4 Institucional (`14`)
- Está **vazia no Figma**. Crie uma página simples com: o papel da Pró-Reitoria de Graduação e do CLAA (Comitê Local de Acompanhamento e Avaliação), uma lista de documentos (links, em `src/content/institucional.js`) e o contato. Marque o conteúdo com `TODO`.

### 6.5 Página de um PET (`12` = V1 e V2, `13` = base)
O conteúdo vem de `src/content/pets/<slug>.js`. As seções, na ordem da nota do Figma:
1. **Topo:** nome ("PET Química"), logo, unidade e campus. Fundo em gradiente usando a `corDestaque` do PET (padrão: `--color-primary` → `--color-teal`).
2. **Foto do grupo** grande e arredondada (com placeholder se faltar).
3. **Membros:** carrossel de avatares redondos com nome e curso. Destaque o **tutor** separadamente.
4. **Sobre nós:** parágrafos.
5. **Atividades / Projetos Realizados:** carrossel de cards (imagem, título, descrição e link opcional).
6. **Redes Sociais e contato:** Instagram, Linktree, LinkedIn, YouTube, site e e-mail. Mostre só o que existir.
7. Rodapé global.

Seções sem dados não aparecem. No fim da página, coloque uma linha discreta: *"Faz parte deste PET? Peça alterações na Área dos PETs."*

### 6.6 Login (`/entrar`)
E-mail + senha e o botão "Entrar". Sem cadastro público: o texto diz que as contas são criadas pelo CEPETUSP. Também tem o link "Esqueci minha senha" (Supabase `resetPasswordForEmail`; no modo demo, mostra um aviso). No modo demo, mostre um quadro com as contas de teste.

### 6.7 Área do PET
- **Lista de pedidos** do próprio PET: título, tipo, seção, data, **status** (badge colorido) e o botão "Novo pedido". Também um link "Ver minha página".
- **Novo pedido** (formulário):
  - *Tipo:* Alterar texto · Adicionar/remover membro · Adicionar projeto/atividade · Trocar/adicionar fotos · Atualizar redes/contato · Outro.
  - *Seção da página:* Topo/Logo · Foto do grupo · Membros · Sobre nós · Projetos · Redes sociais · Outra.
  - *Título* (obrigatório, até 120 caracteres).
  - *Descrição* (obrigatória): o que mudar, com o texto novo completo.
  - *Anexos:* até 5 arquivos (imagens ou PDF, até 5 MB cada).
  - Validação no cliente. Depois de enviar, ir para o detalhe com uma mensagem de sucesso.
- **Detalhe do pedido:** todos os campos, os anexos (miniaturas/links), a linha do tempo de status e a resposta do CEPETUSP.

### 6.8 Painel do CEPETUSP
- Tabela ou lista de **todos** os pedidos, com filtros por **status** e por **PET**, ordenada pelos mais recentes. Mostre contadores por status no topo.
- **Detalhe:** os mesmos dados, mais as ações **mudar status** (pendente → em andamento → concluído / recusado) e **escrever uma resposta** para o PET.
- Status e cores: `pendente` (amarelo), `em_andamento` (azul), `concluido` (verde), `recusado` (cinza/vermelho).

## 7. Dados

### 7.1 Conteúdo dos PETs (no repositório)
O conteúdo público fica em **arquivos JS** versionados no git. Assim, cada alteração passa por commit e PR, com histórico e revisão.

```js
// src/content/pets/computacao.js
export default {
  slug: 'computacao',              // usado na URL
  nome: 'PET Computação',
  unidade: 'ICMC',                 // instituto/faculdade
  campus: 'São Carlos',
  area: 'Ciências Exatas e da Terra', // uma das 6 áreas do filtro
  anoCriacao: null,                // número ou null
  logo: '/pets/computacao/logo.png',
  corDestaque: null,               // ex.: '#0B8F3A'; null = cores padrão
  fotoGrupo: null,                 // '/pets/computacao/grupo.jpg'
  sobre: ['Parágrafo 1', 'Parágrafo 2'],
  tutor: { nome: '', foto: null, descricao: '' },
  membros: [{ nome: '', curso: '', foto: null }],
  projetos: [{ titulo: '', descricao: '', imagem: null, link: null }],
  redes: { instagram: null, linktree: null, linkedin: null, youtube: null, site: null },
  email: null,
  siteExterno: null,               // se preenchido, o card abre este link
}
```

`src/content/pets/index.js` importa todos e exporta a lista (`listaPets`) e o `buscarPet(slug)`. Imagens ficam em `public/pets/<slug>/`.

**Os 22 PETs** (lidos dos logos no Figma; o que está com ⚠️ precisa ser confirmado com a frente):

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
| `pet-mariposa` | ⚠️ (logo de mariposa, sem nome) | ? | ? | ? | descobrir qual PET é |
| `fonoaudiologia` | PET Fonoaudiologia | FOB | Bauru | Ciências da Saúde | |
| `gaea` | PET Gaea | ESALQ | Piracicaba | Ciências Agrárias | ⚠️ |
| `historia` | PET História | FFLCH | São Paulo | Ciências Humanas | |
| `mecanica` | PET Mecânica | EESC | São Carlos | Engenharia | ⚠️ unidade |
| `mecatronica` | PET Mecatrônica | EESC | São Carlos | Engenharia | ⚠️ unidade |
| `pet-arvore` | ⚠️ (logo de árvore, nome ilegível) | ? | ? | ? | descobrir qual PET é |
| `fmrp` | PET FMRP (Medicina) | FMRP | Ribeirão Preto | Ciências da Saúde | |
| `quimica-rp` | PET Química USP RP | FFCLRP | Ribeirão Preto | Ciências Exatas e da Terra | |
| `iqsc` | PET IQSC (Química) | IQSC | São Carlos | Ciências Exatas e da Terra | |
| `si-each` | PET SI | EACH | São Paulo | Ciências Exatas e da Terra | ⚠️ |
| `direito-fdusp` | PET Direito | FDUSP | São Paulo | Ciências Sociais Aplicadas | |
| `zootecnia-fzea` | PET Zootecnia | FZEA | Pirassununga | Ciências Agrárias | ⚠️ |

Os logos em `public/pets/<slug>/logo.png` são **recortes provisórios em baixa resolução** das capturas do Figma. Troque pelos originais quando houver acesso (MCP do Figma: `download_assets`) ou quando os PETs enviarem.

Para a apresentação, preencha **3 PETs com conteúdo completo de exemplo** (sugestão: `computacao`, `iqsc`, `mecanica`) e os outros com um `sobre` curto genérico. Os textos de exemplo devem ser marcados claramente como provisórios; não invente fatos (como ano de criação ou nomes de tutores) que pareçam reais.

### 7.2 Notícias e Home
`src/content/noticias.js` (lista de `{ titulo, data: 'AAAA-MM-DD', resumo, imagem, link }`) e `src/content/home.js` (slides e o texto da história curta). Use itens de exemplo marcados com `TODO`.

### 7.3 Login e pedidos (Supabase)

**Perfis:** `pet` (uma conta por PET, ligada a um `pet_slug`) e `cepet` (membros do CEPETUSP). O cadastro público fica **desligado**; as contas são criadas pelo painel do Supabase (*Authentication → Add user*) e depois ganham uma linha em `profiles`.

Crie `supabase/schema.sql` com o conteúdo abaixo, revise e mantenha atualizado:

```sql
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text not null,
  perfil text not null check (perfil in ('pet','cepet')),
  pet_slug text,                        -- obrigatório quando perfil = 'pet'
  created_at timestamptz default now(),
  check (perfil = 'cepet' or pet_slug is not null)
);

create table public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  pet_slug text not null,
  autor_id uuid not null references auth.users,
  tipo text not null,
  secao text not null,
  titulo text not null check (char_length(titulo) <= 120),
  descricao text not null,
  anexos jsonb not null default '[]',   -- [{ path, nome, tipo, tamanho }]
  status text not null default 'pendente'
    check (status in ('pendente','em_andamento','concluido','recusado')),
  resposta text,
  historico jsonb not null default '[]', -- [{ status, em, por }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- funções auxiliares para as regras de acesso
create function public.meu_perfil() returns text language sql stable security definer
  set search_path = public as $$ select perfil from profiles where id = auth.uid() $$;
create function public.meu_pet() returns text language sql stable security definer
  set search_path = public as $$ select pet_slug from profiles where id = auth.uid() $$;

alter table public.profiles enable row level security;
alter table public.solicitacoes enable row level security;

create policy "ver o próprio perfil" on profiles for select
  using (id = auth.uid() or meu_perfil() = 'cepet');

create policy "PET vê os seus; CEPET vê todos" on solicitacoes for select
  using (pet_slug = meu_pet() or meu_perfil() = 'cepet');
create policy "PET cria pedido do próprio PET" on solicitacoes for insert
  with check (meu_perfil() = 'pet' and pet_slug = meu_pet()
              and autor_id = auth.uid() and status = 'pendente');
create policy "só CEPET atualiza" on solicitacoes for update
  using (meu_perfil() = 'cepet');

-- Storage: bucket privado "anexos", caminho "<pet_slug>/<id_pedido>/<arquivo>"
insert into storage.buckets (id, name, public) values ('anexos','anexos', false);
create policy "PET envia anexos do próprio PET" on storage.objects for insert
  with check (bucket_id = 'anexos' and (storage.foldername(name))[1] = meu_pet());
create policy "ler anexos" on storage.objects for select
  using (bucket_id = 'anexos' and ((storage.foldername(name))[1] = meu_pet() or meu_perfil() = 'cepet'));
```

Anexos são exibidos por *signed URLs* (`createSignedUrl`, 1 h).

### 7.4 Camada de serviço e modo demonstração
Toda a comunicação passa por `src/services/`, e as páginas **nunca** chamam o Supabase diretamente:

```
src/services/
  supabaseClient.js   // cria o client só se houver VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
  auth.js             // entrar(email, senha), sair(), usuarioAtual(), aoMudarSessao(cb)
  solicitacoes.js     // listar(filtros), buscar(id), criar(dados, arquivos), atualizarStatus(id, status, resposta)
  demo/               // mesma interface, implementada com localStorage
```

- O **modo demo** fica ativo quando as variáveis de ambiente não existem. Nesse modo, aparece uma faixa discreta "Modo demonstração" no topo da Área do PET e do Painel.
- Contas de teste no modo demo: `computacao@demo.pet` / `demo1234` (perfil `pet`, slug `computacao`), `iqsc@demo.pet` / `demo1234` (perfil `pet`) e `cepet@demo.pet` / `demo1234` (perfil `cepet`). Anexos no modo demo ficam como *data URL*, só para imagens pequenas, ou só com o nome do arquivo.
- Deixe 3 ou 4 pedidos de exemplo pré-carregados no modo demo, em status diferentes, para o painel não aparecer vazio na apresentação.
- Um `AuthContext` (React Context) expõe `{ usuario, perfil, petSlug, carregando, entrar, sair }`.

`.env.example` já está no repositório. **Nunca** commitar `.env`.

## 8. Estrutura de pastas sugerida

```
src/
  main.jsx, App.jsx          // rotas
  styles/tokens.css, global.css
  components/                // Header, Footer, Breadcrumb, SectionTitle, Carousel, PetCard, StatusBadge, RotaProtegida, icons/
  pages/                     // Home, TodosPets, Sobre, Institucional, PetPage, NotFound,
                             // Entrar, area/(MeusPedidos, NovoPedido, DetalhePedido), painel/(Painel, DetalhePainel)
  content/                   // home.js, noticias.js, sobre.js, institucional.js, pets/*.js
  services/                  // ver 7.4
  context/AuthContext.jsx
public/brand/, public/pets/<slug>/
supabase/schema.sql
docs/SPEC.md, docs/figma-refs/
```

## 9. Ordem de execução sugerida

1. Limpar o template do Vite, instalar as fontes, criar os tokens, o `global.css`, o Header, o Footer e as rotas com páginas vazias.
2. Conteúdo: os 22 arquivos de PET + `index.js`, com dados da tabela 7.1.
3. Todos os PETs (grade, filtros, ordenação).
4. Template da página do PET (+ carrossel).
5. Home, Sobre, Institucional e 404.
6. Serviços (modo demo primeiro), AuthContext, Login e rotas protegidas.
7. Área do PET (lista, novo pedido, detalhe).
8. Painel do CEPETUSP.
9. Supabase: `schema.sql` e o adaptador real (testar quando houver projeto criado).
10. Responsivo, acessibilidade básica (foco visível, `alt`, contraste, navegação por teclado), título da aba por página e o README.
11. Deploy.

## 10. Critérios de aceite

- `npm run build` sem erros e `npm run lint` sem erros.
- Todas as rotas da seção 5 funcionam, inclusive ao recarregar a página (rewrite de SPA).
- Os filtros e a ordenação da galeria funcionam combinados, e as 22 páginas de PET abrem.
- No modo demo: entrar como PET → criar um pedido com anexo → sair → entrar como CEPET → ver o pedido → mudar o status e responder → entrar de novo como PET → ver a resposta.
- Um PET **não** consegue ver pedidos de outro PET, nem acessar `/painel`.
- O layout funciona em 375 px, 768 px e 1280 px.
- Visual fiel às capturas em `docs/figma-refs/` (cores, fontes, cabeçalho, rodapé, títulos com fundo amarelo, cards).
- Selo "Beta" e faixa de versão de demonstração visíveis e desligáveis por `MODO_BETA`. Nenhum dado pessoal real no conteúdo de exemplo.

## 11. Pendências e perguntas em aberto

- Acesso de **editor** no Figma para obter os assets originais (logos, logo PET USP) e os valores exatos.
- Identificar os PETs dos logos de **mariposa** e de **árvore** e confirmar os itens com ⚠️ na tabela.
- **V1 ou V2** da página do PET? O template deve seguir a ordem de seções e permitir uma cor de destaque por PET.
- Conteúdo oficial: "Sobre o programa", "Institucional", história curta da Home e notícias.
- Repositório definitivo (GitHub do PET?) e hospedagem/domínio final.
- Criar o projeto no Supabase e as contas de cada PET (e definir quem do CEPETUSP terá perfil `cepet`).
- LGPD: ter o consentimento dos membros para publicar foto e nome.

