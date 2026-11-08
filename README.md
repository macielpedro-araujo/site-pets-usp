# Site Oficial dos PETs USP

Site geral dos grupos do Programa de Educação Tutorial (PET) da USP, mantido pelo **PET Computação ICMC-USP (CEPETUSP)**.

- Especificação completa: [`docs/SPEC.md`](docs/SPEC.md)
- Referências do protótipo (Figma): [`docs/figma-refs/`](docs/figma-refs/)
- Stack: React + Vite (JavaScript), React Router, CSS Modules, Supabase

## Rodando localmente

```bash
npm install
cp .env.example .env   # opcional: sem Supabase, roda em modo demonstração
npm run dev            # http://localhost:5173
npm run build          # build de produção
npm run lint           # lint (oxlint)
```

## Modo demonstração

Sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env`, o login e os pedidos funcionam
com `localStorage` (os dados ficam só no navegador). Contas de teste, todas com a senha `demo1234`:

| E-mail | Perfil |
|---|---|
| `computacao@demo.pet` | PET Computação |
| `iqsc@demo.pet` | PET IQSC |
| `cepet@demo.pet` | CEPETUSP (painel) |

Para recomeçar do zero, limpe o `localStorage` do site no navegador (DevTools → Application).

## Onde fica cada coisa

```
src/
  App.jsx                 rotas
  styles/                 tokens.css (cores, fontes, tamanhos) e global.css
  components/             Header, Footer, Carousel, PetCard, StatusBadge, RotaProtegida, icons/…
  pages/                  uma pasta por página; area/ (Área do PET) e painel/ (CEPETUSP)
  content/                textos públicos: home, notícias, sobre, institucional e pets/<slug>.js
  services/               toda a comunicação com o Supabase (+ demo/ para o modo demonstração)
  context/AuthContext.jsx quem está logado
supabase/schema.sql       tabelas, regras de acesso (RLS) e bucket de anexos
public/pets/<slug>/       logos e fotos de cada PET
```

### Tarefas comuns

- **Mudar o conteúdo de um PET** (atender um pedido): edite `src/content/pets/<slug>.js` e coloque
  as imagens em `public/pets/<slug>/`. Faça um PR.
- **Adicionar um PET novo**: crie `src/content/pets/<slug>.js` (copie um existente) e importe-o em
  `src/content/pets/index.js`.
- **PET com site próprio**: preencha `siteExterno` no arquivo dele; o card passa a abrir esse link.
- Textos provisórios estão marcados com `TODO` (procure por `TODO` no projeto).

## Supabase (produção)

1. Crie um projeto no Supabase e rode `supabase/schema.sql` no SQL Editor.
2. Desligue o cadastro público e crie as contas (instruções no fim do `schema.sql`).
3. Coloque a URL e a chave `anon` no `.env` (local) e nas variáveis de ambiente do deploy.

## Deploy

**GitHub Pages (versão de teste, modo demonstração):** o workflow
`.github/workflows/github-pages.yml` publica o site a cada push na `main`, em
`https://<usuario>.github.io/<repositorio>/`. Na primeira vez, ative em
*Settings → Pages → Source: GitHub Actions*. Como o site fica numa subpasta, o build usa
`BASE_PATH` e os caminhos de `public/` passam por `src/utils/urlPublica.js`.

**Vercel (definitivo):** importe o repositório (framework Vite). O `vercel.json` já faz o *rewrite* de SPA,
então as rotas funcionam ao recarregar a página.
