# Site Oficial dos PETs USP

Site geral dos grupos PET da USP, mantido pelo PET Computação (ICMC-USP), na frente CEPETUSP.
**Leia `docs/SPEC.md` antes de qualquer coisa**: ele tem o contexto, o escopo, o design, as rotas, os dados, o Supabase e os critérios de aceite.
As referências visuais do protótipo do Figma estão em `docs/figma-refs/`. Abra as imagens antes de construir cada página.

## Regras do projeto
- React + Vite com **JavaScript puro**. Não use TypeScript (a equipe não usa).
- Estilo com **CSS Modules** + variáveis em `src/styles/tokens.css`. Sem Tailwind e sem bibliotecas de componentes.
- Rotas com `react-router-dom`. Backend com Supabase **só através de `src/services/`**.
- O site precisa funcionar sem Supabase (**modo demonstração** com `localStorage`), como descrito em SPEC §7.4.
- Interface, comentários e mensagens de commit em português (pt-BR).
- Código simples e legível: quem vai manter são alunos de graduação aprendendo React. Prefira componentes pequenos e nomes claros, e evite abstrações desnecessárias.
- Conteúdo público (PETs, notícias, textos) fica em `src/content/`. Texto provisório deve ser marcado com `TODO`, e não invente fatos que pareçam reais.
- Nunca commitar `.env`.

## Comandos
- `npm run dev`: servidor local
- `npm run build`: build de produção (precisa passar sem erros)
- `npm run lint`: lint (oxlint)

## Prazo
Apresentação na **sexta, 13/11/2026**: tudo da SPEC §2 precisa estar funcionando.
Siga a ordem da SPEC §9 e confira a §10 antes de dar por pronto.
