# SPEC v2 — Alterações de 11/11/2026

> Este documento **substitui** as partes correspondentes de `docs/SPEC.md`. Em caso de conflito, vale este.
> Seções da SPEC original afetadas: §2 (beta), §5 (rotas da área/painel), §6.1 (notícias), §6.5–§6.8, §7.1–§7.4, §11.
> Revisado às 22h30 de 11/11: continuam **22 PETs**, as **notícias** têm um editor próprio (secretaria) e o **banco de dados ainda não foi decidido**. Por isso, nada de Supabase agora: veja §2.1.
> Ao terminar a implementação, incorpore este conteúdo ao `SPEC.md` e apague este arquivo.

## 1. O que mudou

Principais mudanças:

1. **Sem "Beta" nem faixa de demonstração.** O site será apresentado como produto.
2. **Sem fila de pedidos.** Agora **cada PET edita a própria página** (textos, fotos, membros, projetos, redes), e a mudança **é publicada na hora**.
3. **Fotos reais** no site.
4. **Página do PET Computação completa e real**, como vitrine de como as páginas vão ficar.
5. Os logos estão em baixa resolução e precisam ser trocados.
6. **Notícias** da Home: quem publica é o **secretário(a) do PET USP**, não os PETs. As notícias falam do programa como um todo (eventos em comum, CEPETUSP etc.), não de um PET específico. Ver §2.5.
7. Identificação dos logos sem nome:
   - o **pássaro rosa** (`pet-mariposa`) é o **PET Filosofia** (FFLCH, São Paulo);
   - a **árvore** (`pet-arvore`) é o logo do **Cursinho Popular do PET-Medicina**, que é gerido pelo PET FMRP. Pode ser um card duplicado do `fmrp`, mas a frente decidiu **manter os 22 cards do Figma** até discutir isso. **Não remova `pet-arvore`.** Exiba como "PET Medicina – Cursinho Popular" (unidade FMRP, Ribeirão Preto, Ciências da Saúde) e registre a dúvida nas pendências.

## 2. Novo modelo: cada PET edita a própria página

### 2.1 Banco de dados: ainda NÃO decidido

O site será hospedado pela **Reitoria** (domínio **usp.br**, não icmc.usp.br, porque atende vários PETs) numa **VM**. O banco será decidido junto com o professor que administra os bancos de dados do ICMC. Portanto:

- **Não escreva código específico de um provedor** (Supabase, Firebase etc.) agora. Apague a pasta `supabase/` e o `services/supabaseClient.js` (o histórico do git guarda o que existia). Remova também `@supabase/supabase-js` do `package.json`.
- **Para a apresentação, tudo roda no modo local** (`localStorage`), que já existe. Não há banco nem servidor, e o site funciona igual na frente dos tutores.
- A **camada de serviço** (§2.3) é o "contrato": as páginas só falam com `src/services/`. Quando o backend for escolhido, só os arquivos de `services/` mudam.
- Escreva **`docs/modelo-de-dados.md`**, o documento para levar à reunião com o professor de BD. Ele deve conter:
  - as entidades (abaixo) com seus campos;
  - quem pode ler e escrever o quê (tabela de permissões);
  - o fluxo de login (contas criadas pelo CEPETUSP, sem cadastro público);
  - o armazenamento de imagens (onde ficam, limites de tamanho e tipo);
  - o histórico de versões (para desfazer edições);
  - os requisitos não funcionais: HTTPS, backups, LGPD (fotos e nomes de alunos), quem administra as contas e quantas pessoas usam (≈ 22 PETs + CEPETUSP + secretaria);
  - as **opções de arquitetura**, para o professor escolher, cada uma com prós e contras curtos e sem recomendação fechada: PostgreSQL na VM + uma API pequena (Node/Express, por exemplo); Supabase *self-hosted* na VM; serviço gerenciado externo;
  - as perguntas em aberto: autenticação pela conta USP (Senha Única)? quem faz backup? limite de armazenamento?

### 2.2 Entidades e permissões (independentes de tecnologia)

| Entidade | Campos principais | Leitura | Escrita |
|---|---|---|---|
| **Conta** | id, nome, e-mail, perfil (`pet` · `cepet` · `secretaria`), pet_slug (só perfil `pet`) | a própria conta; CEPETUSP vê todas | só o CEPETUSP cria e desativa contas |
| **PET** | slug, nome, unidade, campus, área, ano_criacao, site_externo, ativo (*estruturais*); logo, cor_destaque, foto_capa, foto_grupo, sobre[], tutor{}, membros[], projetos[], galeria[], redes{}, email, endereco (*conteúdo*); atualizado_em, atualizado_por | público | conteúdo: o próprio PET ou o CEPETUSP; estruturais: só o CEPETUSP |
| **Versão de PET** | id, pet_slug, dados (cópia completa), editado_por, editado_em | o próprio PET e o CEPETUSP | automática a cada alteração; só o CEPETUSP restaura |
| **Notícia** | id, titulo, resumo, texto, imagem, link_externo, data_publicacao, publicada (bool), autor | público (só publicadas) | secretaria e CEPETUSP |
| **Imagem** | caminho `<dono>/<arquivo>`, tipo, tamanho | público | só na pasta do próprio PET (`pets/<slug>/`) ou de notícias (`noticias/`, secretaria) |

Limites sugeridos: imagens até 5 MB (jpeg, png, webp); até 10 parágrafos no "sobre", 60 membros, 30 projetos e 30 fotos na galeria.

**Seed:** os arquivos `src/content/pets/*.js` e `src/content/noticias.js` continuam sendo o **conteúdo inicial**. O modo local parte deles, e no futuro eles servem para popular o banco.

### 2.3 Camada de serviço

Substitua `services/solicitacoes.js` e `services/demo/solicitacoesDemo.js` por:

```
services/pets.js        listarPets(), buscarPet(slug), atualizarPet(slug, campos),
                        enviarImagem(dono, arquivo) → url,
                        listarVersoes(slug), restaurarVersao(slug, idVersao)       // restaurar: só CEPET
services/noticias.js    listarNoticias({ incluirRascunhos }), buscarNoticia(id),
                        salvarNoticia(dados), excluirNoticia(id)                    // secretaria e CEPET
services/auth.js        entrar, sair, usuarioAtual, aoMudarSessao (já existe)
services/local/         implementação de TUDO acima com localStorage (o atual "demo/", renomeado)
```

Cada função de `services/` delega para `services/local/` e tem um comentário curto dizendo o que o backend futuro precisa fazer (ex.: "o servidor deve conferir se a conta é do PET `slug` ou CEPET"). **Toda regra de permissão também é checada na implementação local**, para que o comportamento na apresentação seja o mesmo do sistema real. As imagens no modo local são salvas como data URL redimensionada; avise se o `localStorage` encher.

- As páginas públicas (galeria, página do PET, cards da Home) passam a ler de `services/pets.js` (com estado de carregando e de erro), não mais importando os `.js` diretamente.
- **Antes de enviar,** reduza a imagem no navegador (canvas, lado maior até 1600 px, WebP ou JPEG com qualidade 0,85).
- Textos sempre como texto puro (sem HTML ou Markdown renderizado). Links de redes só com `https://`. Valide no cliente e confie nos `check` do banco.

### 2.4 Telas

**Removidas:** `/area-do-pet/novo`, `/area-do-pet/pedidos/:id`, `/painel/pedidos/:id`, `StatusBadge` e `DadosPedido`.

**`/area-do-pet` — "Editar minha página"** (perfil `pet`):
- Topo com o nome do PET, o link "Ver minha página" (nova aba) e "Última alteração em … por …".
- Formulário dividido nas mesmas seções da página pública, cada uma num bloco recolhível com o botão **Salvar** próprio:
  1. **Identidade:** logo (upload), cor de destaque (input color) e foto de capa (upload).
  2. **Foto do grupo** (upload).
  3. **Sobre nós:** parágrafos (adicionar, remover, reordenar).
  4. **Tutor(a):** nome, foto e descrição curta.
  5. **Membros:** lista editável (nome, curso/frente e foto opcional), com adicionar, remover e reordenar com botões ↑↓ (sem drag-and-drop).
  6. **Atividades e projetos:** título, descrição, imagem e link.
  7. **Galeria:** fotos com legenda.
  8. **Contato e redes:** e-mail, endereço, Instagram, Linktree, LinkedIn, YouTube, Telegram e site.
- Campos estruturais (nome, unidade, campus, área e ano) aparecem **só para leitura**, com a nota "para alterar, fale com o CEPETUSP".
- **LGPD:** ao salvar membros ou fotos com pessoas, exija o checkbox *"Confirmo que as pessoas identificadas autorizaram a publicação de nome e imagem."*
- Feedback claro: "Salvo! Já está no ar." e mensagens de erro em português.
- O nome da rota pode continuar `/area-do-pet`. Renomeie o link do cabeçalho para **"Área dos PETs"**.

**`/painel` — CEPETUSP** (perfil `cepet`):
- Lista dos 22 PETs: logo, nome, última alteração (data e autor) e indicadores de completude (tem capa? tem membros? tem projetos?).
- **Editar** abre o mesmo editor da Área do PET, para qualquer PET e com os campos estruturais liberados.
- **Histórico** mostra as versões, com o botão "Restaurar esta versão" e confirmação.

**Modo local:** é o que roda na apresentação, **sem faixas visíveis no site público**. As contas de teste aparecem só num quadro discreto na página `/entrar`. As contas de teste viram `computacao@demo.pet` (PET), `filosofia@demo.pet` (PET), `cepet@demo.pet` (CEPETUSP) e `secretaria@demo.pet` (secretaria), todas com `demo1234`.

### 2.5 Notícias (perfil `secretaria`)

- Novo perfil **`secretaria`** (secretário/a do PET USP). Ele **não** edita páginas de PETs.
- Rota **`/noticias-admin`** (perfil `secretaria` ou `cepet`): lista de notícias com status Publicada/Rascunho, botões novo, editar e excluir (com confirmação), e um formulário com título, resumo, texto, imagem (upload com redimensionamento), link externo opcional e data.
- **Home:** "Últimas Notícias" mostra as 6 mais recentes já publicadas, lidas de `services/noticias.js`. Crie também **`/noticias`** (todas) e **`/noticias/:id`** (página da notícia; se tiver só link externo, o card abre o link).
- O link do cabeçalho "Área dos PETs" leva cada perfil ao lugar certo: `pet` → editor da página, `secretaria` → notícias, `cepet` → painel (que tem atalho para as notícias).
- Notícias iniciais: as de `src/content/noticias.js`, com fotos de campus da §5. Nada de notícias inventadas que pareçam reais: use textos claramente institucionais e genéricos ou marque com `TODO`.

## 3. Remover "Beta" e a faixa de demonstração

Apague `MODO_BETA` de `src/config.js`, os componentes `FaixaBeta`, `FaixaDemo` e o selo do `Header`, e todo uso deles. Faça uma busca por `beta`, `Beta`, `demonstração` e `MODO_BETA` e não deixe nenhuma ocorrência na interface pública.

## 4. PETs: ajustes nos dados

- `pet-mariposa` → renomear para **`filosofia`**: nome "PET Filosofia", unidade **FFLCH**, campus **São Paulo**, área **Ciências Humanas**, site `https://petfilosofia.fflch.usp.br`. Mova a pasta `public/pets/pet-mariposa` para `public/pets/filosofia`.
- `pet-arvore` → **manter** (22 PETs). Nome de exibição "PET Medicina – Cursinho Popular", unidade FMRP, Ribeirão Preto, Ciências da Saúde, com um comentário `// TODO: confirmar com a frente se é duplicado do PET FMRP`.
- `computacao` → já atualizado com **conteúdo real** em `src/content/pets/computacao.js` (texto, 16 membros, 8 atividades, redes, galeria). Os campos novos `fotoCapa`, `galeria` e `endereco` precisam ser suportados no template e no editor.
- Demais PETs: **sem dados pessoais inventados.** Mostre logo, capa (foto do campus ou da unidade, ver §5), um parágrafo curto genérico e factual (ex.: "Grupo PET da FFLCH-USP, em São Paulo, na área de Ciências Humanas.") e, nas seções vazias, um estado vazio elegante: *"Esta seção ainda está sendo preenchida pelo grupo."* Não use mais "Membro de exemplo 1". Isso também mostra aos tutores o que eles mesmos vão preencher.

## 5. Fotos

### 5.1 Onde entram fotos

| Lugar | Foto |
|---|---|
| Home: carrossel (4 slides) | campi: Cidade Universitária (Praça do Relógio), São Carlos, Piracicaba (ESALQ, Edifício Central) e Ribeirão Preto |
| Home: "Últimas Notícias" | miniatura de cada notícia (pode reutilizar fotos do campus correspondente) |
| Sobre o programa: "O que é Educação Tutorial?" | `computacao/galeria/2025-imersao.png` (grupo PET em atividade) |
| Página de cada PET: **capa** (novo, faixa larga no topo, com gradiente da cor de destaque por cima) | foto da unidade ou do campus do PET (tabela 5.3) |
| Página do PET Computação | capa, foto do grupo, galeria, fotos dos membros e ilustrações das frentes, todas do site oficial do grupo |

### 5.2 Como obter (o script roda na sua máquina, que tem internet)

Crie `scripts/baixar-fotos.mjs` (Node 18+, `fetch` nativo, sem dependências) e um comando `npm run fotos`. O script deve:

1. **PET Computação**, a partir do site oficial do grupo (o próprio grupo é o autor):

| URL | destino |
|---|---|
| `https://pet.icmc.usp.br/assets/logo_com_tipo_hoz_preto-CdsxrVKb.png` | `public/pets/computacao/logo.png` |
| `https://pet.icmc.usp.br/assets/banner_pet_desktop-kRvtZsCH.png` | `public/pets/computacao/grupo.png` |
| `https://pet.icmc.usp.br/sobre-nos/historia/2025_amigo-secreto.jpg` | `public/pets/computacao/capa.jpg` **e** `public/pets/computacao/galeria/2025-amigo-secreto.jpg` |
| `https://pet.icmc.usp.br/sobre-nos/historia/2025-pet_imersao.png` | `public/pets/computacao/galeria/2025-imersao.png` |
| `https://pet.icmc.usp.br/assets/semana_recepcao-D48dHH7o.webp` | `public/pets/computacao/galeria/semana-recepcao.webp` |
| `https://pet.icmc.usp.br/sobre-nos/historia/2018_informatica-idosos.jpg` | `public/pets/computacao/galeria/2018-informatica-idosos.jpg` |
| `https://pet.icmc.usp.br/sobre-nos/historia/2007_grupo-pet.jpg` | `public/pets/computacao/galeria/2007-grupo.jpg` |
| `https://pet.icmc.usp.br/assets/{codifique-DQva83Fe,overclock-D61fjxHC,fullstack-CRnC6-Vj,pesquisa-DnjTQNiz,social-Dqa_Mkxq,comunicacao-DKbqej-7}.svg` | `public/pets/computacao/frentes/{codifique,overclock,fullstack,pesquisa,social,comunicacao}.svg` |
| `https://pet.icmc.usp.br/sobre-nos/membros/{arthur,gilopes,darroca,vidigal,jonas,boiago,kattryel,lorena,gui,pt,rafa,sofi}.jpg` e `noventa.jpeg`, `D.jpg` | `public/pets/computacao/membros/` (nomes em minúsculas, `.jpg`, como em `computacao.js`) |

   Os nomes com hash (`-CdsxrVKb` etc.) podem mudar se o site for republicado. Se algum download der 404, abra `https://pet.icmc.usp.br` e `https://pet.icmc.usp.br/sobrenos` e pegue o endereço atual da imagem.

2. **Campi e unidades**, pela **API do Wikimedia Commons** (`https://commons.wikimedia.org/w/api.php`, `generator=search`, `gsrnamespace=6`, `prop=imageinfo`, `iiprop=url|size|extmetadata`, `iiurlwidth=1920`). Envie um `User-Agent` descritivo (`site-pets-usp/1.0 (CEPETUSP, PET Computação ICMC-USP)`). Para cada chave, aceite só imagens **horizontais**, com largura ≥ 1600 px e licença **CC0, domínio público, CC BY ou CC BY-SA** (`extmetadata.LicenseShortName`). Salve a versão de 1920 px em `public/fotos/<chave>.jpg`.

| chave | busca sugerida |
|---|---|
| `campus-butanta` | "Praça do Relógio Cidade Universitária USP" |
| `campus-sao-carlos` | "USP São Carlos campus" (alternativa: "ICMC USP") |
| `campus-piracicaba` | "ESALQ Edifício Central" |
| `campus-ribeirao` | "campus USP Ribeirão Preto" (conhecida: `File:PortaoFMRPBandeirantes.jpg`) |
| `campus-pirassununga` | "FZEA USP Pirassununga" |
| `campus-bauru` | "Faculdade de Odontologia de Bauru USP" |
| `fd-largo-sao-francisco` | conhecida: `File:Faculdade de Direito da USP.jpg` (CC BY-SA 3.0) |
| `fflch` | "FFLCH USP prédio" |
| `fea` | "FEA USP" |
| `each` | "EACH USP Leste" |

   Mantenha no script um objeto `ESCOLHAS_MANUAIS = { chave: 'File:Nome exato.jpg' }`, que tem prioridade sobre a busca. **Abra cada imagem baixada e confira se ela mostra mesmo o lugar.** Se não mostrar, fixe outro arquivo em `ESCOLHAS_MANUAIS`. Quando não houver nenhuma foto boa, use a do campus mais próximo e registre isso.

3. Gerar **`public/fotos/creditos.json`** (`{ arquivo, titulo, autor, licenca, urlLicenca, urlOrigem }`) para cada foto do Commons. Fotos sob CC BY e CC BY-SA **exigem crédito**: crie a página **`/creditos`** ("Créditos das imagens", com link no rodapé) e mostre um crédito pequeno sobre cada capa ou slide (ex.: "Foto: Autor / Wikimedia Commons, CC BY-SA 4.0").

### 5.3 Capa de cada PET

| PET (slug) | capa |
|---|---|
| adm | `fea` |
| biotecnologia-agricola, ecologia, gaea | `campus-piracicaba` |
| ciencias-sociais, historia, filosofia | `fflch` |
| computacao | foto própria |
| direito-fdusp | `fd-largo-sao-francisco` |
| direitos-fdrp, enfermagem-eerp, fmrp, pet-arvore, quimica-rp | `campus-ribeirao` |
| eefe | `campus-butanta` |
| engenharia-de-alimentos, zootecnia-fzea | `campus-pirassununga` |
| fonoaudiologia | `campus-bauru` |
| iqsc, mecanica, mecatronica | `campus-sao-carlos` |
| si-each | `each` |

O PET pode trocar a capa pelo editor quando quiser.

## 6. Logos

O Pedro tem acesso de editor no Figma. Ele testou "Copy as PNG" e as cópias saem pequenas (≈150 px), porque as próprias imagens dentro do Figma são pequenas. Faça assim:

1. **Para a apresentação:** use as cópias do Figma. Elas são bem melhores que os recortes atuais (≈ 40–130 px). O Pedro vai salvar os PNGs numa pasta (ex.: `~/logos-figma/`). Renomeie e mova cada um para `public/pets/<slug>/logo.png`. No card, mostre o logo com `object-fit: contain` e `max-height` de ~96 px, **sem ampliar além do tamanho natural** (`max-width: 100%` e sem `width` fixa maior que a imagem), para não borrar.
2. **Tente melhorar:** pelo Figma MCP (`download_assets`, nó `19:735` do arquivo `OhCHD6n1okEsLYDuLin22l`, campo `rawImages` = imagem original enviada ao Figma); ou peça ao Pedro para selecionar a imagem e usar o painel direito **Export → 4x → Export**. Se a original for maior que a exibida, sai nítida.
3. **PET Computação:** use o logo do site oficial (§5.2), que tem 1268 px.
4. **Definitivo:** cada PET envia o próprio logo em boa resolução pelo editor (§2.4).

## 7. Critérios de aceite (além dos da SPEC §10)

- Nenhuma ocorrência visível de "Beta" ou "demonstração" no site público.
- 22 PETs; o card do PET Filosofia aparece com o nome certo.
- Modo demo: entrar como `computacao@demo.pet` → editar o "Sobre nós" e trocar a foto de um membro → salvar → a página pública mostra a mudança na hora. Entrar como `filosofia@demo.pet` → não consegue editar outro PET (nem pela URL). Entrar como `cepet@demo.pet` → vê os 22 PETs, edita qualquer um e restaura uma versão anterior. Entrar como `secretaria@demo.pet` → cria uma notícia com foto, que aparece na Home; não consegue abrir o editor de nenhum PET. Um PET não consegue abrir `/noticias-admin`.
- Nenhuma dependência ou código de provedor de banco. `docs/modelo-de-dados.md` está pronto para a reunião com o professor de BD.
- Todas as fotos do Commons têm crédito em `/creditos`. Nenhuma foto sem licença compatível.
- Home, página do PET Computação e página de um PET "vazio" ficam bonitas em 375 px e 1280 px. Tire screenshots e confira.
- `npm run build` e `npm run lint` sem erros. README e SPEC atualizados.
