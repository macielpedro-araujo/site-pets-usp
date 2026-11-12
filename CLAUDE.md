# Site Oficial dos PETs USP

Site geral dos grupos PET da USP, mantido pelo PET Computação (ICMC-USP), na frente CEPETUSP.
**Leia `docs/SPEC.md` antes de qualquer coisa.** Ela tem o contexto, o design, as rotas e os critérios de aceite: sem "Beta", cada PET edita a própria página (publicada na hora), notícias editadas pela secretaria, fotos reais e 22 PETs. **O banco de dados ainda não foi escolhido** (vai ser decidido com o professor de BD do ICMC; o site ficará numa VM da Reitoria, domínio usp.br). O documento para essa decisão é `docs/modelo-de-dados.md`.
As referências visuais do protótipo do Figma estão em `docs/figma-refs/`. Abra as imagens antes de construir cada página.

## Regras do projeto
- React + Vite com **JavaScript puro**. Não use TypeScript (a equipe não usa).
- Estilo com **CSS Modules** + variáveis em `src/styles/tokens.css`. Sem Tailwind e sem bibliotecas de componentes.
- Rotas com `react-router-dom`. Todo acesso a dados passa **só por `src/services/`**. Não adicione nenhum provedor de banco (Supabase, Firebase etc.) até a decisão com o professor de BD.
- Por enquanto, os dados ficam no **modo local** (`localStorage`, em `src/services/local/`), descrito na SPEC §7.4, com as regras de permissão checadas também nele (`services/local/permissoes.js`), mas **sem nenhuma faixa ou selo de "demonstração" visível** no site público. Imagens de conteúdo usam `urlImagem()` de `services/imagens.js`.
- Nunca invente dados pessoais (nomes, fotos ou tutores) de PETs reais. Seções sem conteúdo mostram um estado vazio.
- Toda foto de terceiros precisa de licença compatível e crédito registrado em `public/fotos/creditos.json`.
- Interface, comentários e mensagens de commit em português (pt-BR).
- Código simples e legível: quem vai manter são alunos de graduação aprendendo React. Prefira componentes pequenos e nomes claros, e evite abstrações desnecessárias.
- Conteúdo público (PETs, notícias, textos) fica em `src/content/`. Texto provisório deve ser marcado com `TODO`, e não invente fatos que pareçam reais.
- Nunca commitar `.env`.

## Comandos
- `npm run dev`: servidor local
- `npm run build`: build de produção (precisa passar sem erros)
- `npm run lint`: lint (oxlint)
- `npm run fotos`: baixa as fotos (PET Computação + campi do Commons) e gera `public/fotos/creditos.json`
- `npm run fotos:otimizar`: reduz as fotos baixadas (Python 3 + Pillow + Chrome)

## Prazo
Apresentação aos tutores dos PETs na **sexta, 13/11/2026**. Confira os critérios da SPEC §10 antes de dar por pronto.
