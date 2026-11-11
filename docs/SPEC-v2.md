# SPEC v2 — Alterações de 11/11/2026

> Este documento **substitui** as partes correspondentes de `docs/SPEC.md`. Em caso de conflito, vale este.
> Seções da SPEC original afetadas: §2 (beta), §5 (rotas da área/painel), §6.5–§6.8, §7.1, §7.3, §7.4, §11.
> Ao terminar a implementação, incorpore este conteúdo ao `SPEC.md` e apague este arquivo.

## 1. O que mudou

Principais mudanças:

1. **Sem "Beta" nem faixa de demonstração.** O site será apresentado como produto.
2. **Sem fila de pedidos.** Agora **cada PET edita a própria página** (textos, fotos, membros, projetos, redes), e a mudança **é publicada na hora**.
3. **Fotos reais** no site.
4. **Página do PET Computação completa e real**, como vitrine de como as páginas vão ficar.
5. Os logos estão em baixa resolução e precisam ser trocados.
6. Identificação dos logos sem nome:
   - o **pássaro rosa** (`pet-mariposa`) é o **PET Filosofia** (FFLCH, São Paulo);
   - a **árvore** (`pet-arvore`) é o logo do **Cursinho Popular do PET-Medicina**, projeto do **PET FMRP** (Medicina de Ribeirão Preto), que já tem card próprio (`fmrp`). Ou seja, é um card **duplicado**: remova `pet-arvore`, porque são 21 PETs e não 22. Deixe isso anotado nas pendências para confirmação com a frente.

## 2. Novo modelo: cada PET edita a própria página

### 2.1 Impacto no banco de dados

**Antes:** o conteúdo ficava em arquivos `.js` no repositório, e o banco guardava só contas e pedidos.
**Agora:** o conteúdo das páginas precisa estar **no banco**, porque quem edita não tem acesso ao repositório e a mudança tem que valer sem novo deploy.

| Tabela / bucket | Situação | Para quê |
|---|---|---|
| `profiles` | **mantém** | liga cada conta a um PET (`pet_slug`) ou ao CEPETUSP (`perfil = 'cepet'`). Um PET pode ter mais de uma conta (tutor e membros autorizados). |
| `pets` | **nova** | conteúdo de cada página (uma linha por PET). Leitura pública; escrita só pelo próprio PET ou pelo CEPETUSP. |
| `pets_versoes` | **nova** | histórico automático (trigger): toda alteração salva a versão anterior. Permite ao CEPETUSP **desfazer** uma edição errada ou vandalismo, sem precisar aprovar nada antes. |
| bucket `fotos-pets` | **novo, público** | imagens enviadas pelos PETs (logo, capa, grupo, membros, projetos, galeria). Escrita só na pasta `<slug>/` do próprio PET. |
| `solicitacoes` + bucket `anexos` | **sai** | não existe mais fila de pedidos. Remova tabelas, policies, telas e serviços. |

### 2.2 Tabela `pets`

```sql
create table public.pets (
  slug text primary key,
  -- campos estruturais (só o CEPETUSP altera)
  nome text not null,
  unidade text,
  campus text,
  area text not null,
  ano_criacao int,
  site_externo text,
  ativo boolean not null default true,
  -- conteúdo (o próprio PET altera)
  logo_url text,
  cor_destaque text check (cor_destaque is null or cor_destaque ~ '^#[0-9a-fA-F]{6}$'),
  foto_capa_url text,
  foto_grupo_url text,
  sobre text[] not null default '{}',          -- parágrafos
  tutor jsonb not null default '{}',           -- { nome, foto, descricao }
  membros jsonb not null default '[]',         -- [{ nome, curso, foto }]
  projetos jsonb not null default '[]',        -- [{ titulo, descricao, imagem, link }]
  galeria jsonb not null default '[]',         -- [{ src, legenda }]
  redes jsonb not null default '{}',           -- { instagram, linktree, linkedin, youtube, telegram, site }
  email text,
  endereco text,
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users
);
```

Regras (RLS e triggers), todas em `supabase/schema.sql`:
- `select`: liberado para todos (`anon` inclusive) quando `ativo = true`. O CEPETUSP vê todos.
- `update`: `meu_pet() = slug` **ou** `meu_perfil() = 'cepet'`.
- `insert`/`delete`: só o CEPETUSP.
- **Trigger `before update`:** se quem edita não é CEPETUSP, bloqueia mudanças nos campos estruturais (`slug, nome, unidade, campus, area, ano_criacao, site_externo, ativo`), preenche `atualizado_em = now()` e `atualizado_por = auth.uid()`.
- **Trigger `after update`:** insere a linha antiga em `pets_versoes (id, pet_slug, dados jsonb, editado_por, editado_em)`. `select` em `pets_versoes`: PET vê as próprias versões, CEPETUSP vê todas. Ninguém altera ou apaga versões pelo cliente.
- Limites de tamanho no banco (ex.: `check (array_length(sobre,1) <= 10)`, `jsonb_array_length(membros) <= 60`, `projetos <= 30`, `galeria <= 30`). Assim um erro não vira um registro gigante.

Bucket `fotos-pets`: público para leitura; `insert/update/delete` só quando `(storage.foldername(name))[1] = meu_pet()` ou o usuário é CEPETUSP. Configure `file_size_limit` de 5 MB e `allowed_mime_types` = jpeg, png e webp.

**Seed:** um script `scripts/gerar-seed.mjs` lê `src/content/pets/*.js` e gera `supabase/seed.sql` com os `insert` dos 21 PETs. Os arquivos `.js` continuam no repositório como **conteúdo inicial** e **fallback do modo demonstração**.

### 2.3 Camada de serviço

Substitua `services/solicitacoes.js` e `services/demo/solicitacoesDemo.js` por:

```
services/pets.js          listarPets(), buscarPet(slug), atualizarPet(slug, campos),
                          enviarImagem(slug, arquivo, pasta) → url,
                          listarVersoes(slug), restaurarVersao(slug, idVersao)   // restaurar: só CEPET
services/demo/petsDemo.js mesma interface: conteúdo dos arquivos .js + alterações salvas no localStorage
                          (imagens como data URL redimensionada; avise se o localStorage encher)
```

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
- Lista dos 21 PETs: logo, nome, última alteração (data e autor) e indicadores de completude (tem capa? tem membros? tem projetos?).
- **Editar** abre o mesmo editor da Área do PET, para qualquer PET e com os campos estruturais liberados.
- **Histórico** mostra as versões, com o botão "Restaurar esta versão" e confirmação.

**Modo demonstração:** continua existindo, mas **sem faixas visíveis no site público**. As contas de teste aparecem só num quadro na página `/entrar`, e apenas quando não há Supabase configurado. As contas de teste viram `computacao@demo.pet` (PET), `filosofia@demo.pet` (PET) e `cepet@demo.pet` (CEPETUSP), todas com `demo1234`.

## 3. Remover "Beta" e a faixa de demonstração

Apague `MODO_BETA` de `src/config.js`, os componentes `FaixaBeta`, `FaixaDemo` e o selo do `Header`, e todo uso deles. Faça uma busca por `beta`, `Beta`, `demonstração` e `MODO_BETA` e não deixe nenhuma ocorrência na interface pública.

## 4. PETs: ajustes nos dados

- `pet-mariposa` → renomear para **`filosofia`**: nome "PET Filosofia", unidade **FFLCH**, campus **São Paulo**, área **Ciências Humanas**, site `https://petfilosofia.fflch.usp.br`. Mova a pasta `public/pets/pet-mariposa` para `public/pets/filosofia`.
- `pet-arvore` → **remover** (duplicado do PET FMRP; ver §1). Atualize `index.js`, os logos e os testes.
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
| direitos-fdrp, enfermagem-eerp, fmrp, quimica-rp | `campus-ribeirao` |
| eefe | `campus-butanta` |
| engenharia-de-alimentos, zootecnia-fzea | `campus-pirassununga` |
| fonoaudiologia | `campus-bauru` |
| iqsc, mecanica, mecatronica | `campus-sao-carlos` |
| si-each | `each` |

Depois do seed, as URLs passam a viver no banco. O PET pode trocar a capa pelo editor quando quiser.

## 6. Logos

Os logos atuais são recortes de captura de tela, e as imagens dentro do próprio Figma também são pequenas. Faça na ordem:

1. **Figma MCP:** o arquivo é `OhCHD6n1okEsLYDuLin22l`, e a grade de logos está no frame da página `/todos-os-pets-da-usp`, nó `19:735`. Use `download_assets` (campo `rawImages`, imagens originais) e salve cada uma em `public/pets/<slug>/logo.png`. Se o MCP responder "you don't have edit access", a conta do Figma conectada não é a que recebeu o convite de editor: avise o Pedro e siga para o passo 2.
2. **Fallback manual (Pedro):** no Figma, selecione as imagens dos logos e use Export → PNG 3x. Coloque os arquivos numa pasta e o agente renomeia e move para `public/pets/<slug>/logo.png`.
3. Para o PET Computação, use o logo do site oficial (§5.2).
4. Depois, cada PET pode trocar o próprio logo no editor (§2.4), e esse é o caminho definitivo.

Em todos os casos, mostre os logos com `object-fit: contain`, sem esticar, com `max-height` fixa no card.

## 7. Critérios de aceite (além dos da SPEC §10)

- Nenhuma ocorrência visível de "Beta" ou "demonstração" no site público.
- 21 PETs; o card do PET Filosofia aparece e `pet-arvore` não existe mais.
- Modo demo: entrar como `computacao@demo.pet` → editar o "Sobre nós" e trocar a foto de um membro → salvar → a página pública mostra a mudança na hora. Entrar como `filosofia@demo.pet` → não consegue editar outro PET (nem pela URL). Entrar como `cepet@demo.pet` → vê os 21 PETs, edita qualquer um e restaura uma versão anterior.
- `supabase/schema.sql` roda limpo num projeto novo, e `supabase/seed.sql` popula os 21 PETs. Quando possível, teste as policies com dois usuários reais.
- Todas as fotos do Commons têm crédito em `/creditos`. Nenhuma foto sem licença compatível.
- Home, página do PET Computação e página de um PET "vazio" ficam bonitas em 375 px e 1280 px. Tire screenshots e confira.
- `npm run build` e `npm run lint` sem erros. README e SPEC atualizados.
