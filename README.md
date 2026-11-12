# Site Oficial dos PETs USP

Site geral dos 22 grupos do Programa de Educação Tutorial (PET) da USP, mantido pelo **PET Computação ICMC-USP (CEPETUSP)**.

- Especificação completa: [`docs/SPEC.md`](docs/SPEC.md)
- Modelo de dados e opções de banco (para a reunião com o professor de BD): [`docs/modelo-de-dados.md`](docs/modelo-de-dados.md)
- Referências do protótipo (Figma): [`docs/figma-refs/`](docs/figma-refs/)
- Stack: React + Vite (JavaScript), React Router e CSS Modules

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # build de produção
npm run lint    # lint (oxlint)
```

## Como funciona

- **Cada PET edita a própria página** em *Área dos PETs* (textos, fotos, membros, atividades, galeria e contatos). Cada seção tem o próprio botão **Salvar**, e a mudança é publicada na hora. Fotos com pessoas exigem a confirmação de autorização de nome e imagem (LGPD).
- O **CEPETUSP** vê todos os PETs no painel, edita qualquer página (inclusive nome, unidade, campus e área) e pode **restaurar versões anteriores** pelo histórico.
- A **secretaria do PET USP** publica as **notícias** da página inicial (com rascunhos).

## Banco de dados: ainda em aberto

O site vai ficar numa VM da Reitoria (domínio usp.br), e o banco será escolhido com o professor de BD do ICMC
(opções em [`docs/modelo-de-dados.md`](docs/modelo-de-dados.md)). Até lá, tudo roda no **modo local**: os dados
ficam no `localStorage` do navegador, partindo do conteúdo de `src/content/`. As regras de permissão já são checadas
nesse modo, então ele se comporta como o sistema real.

**Contas de teste** (senha `demo1234` para todas; também aparecem na página `/entrar`):

| E-mail | Perfil | O que faz |
|---|---|---|
| `computacao@demo.pet` | PET | edita a página do PET Computação |
| `filosofia@demo.pet` | PET | edita a página do PET Filosofia |
| `cepet@demo.pet` | CEPETUSP | painel com os 22 PETs, histórico e notícias |
| `secretaria@demo.pet` | secretaria | notícias da Home |

Para recomeçar do zero, limpe os dados do site no navegador (DevTools → Application → Local Storage).
As edições feitas num navegador **não aparecem em outros**: isso só muda quando houver um banco.

## Fotos

```bash
npm run fotos            # baixa as fotos (Node 18+, precisa de internet)
npm run fotos:otimizar   # reduz as fotos do PET Computação (Python 3 + Pillow + Chrome)
```

- `npm run fotos` (`scripts/baixar-fotos.mjs`) baixa as imagens do PET Computação do site oficial do grupo e as
  fotos dos campi pelo Wikimedia Commons (só licenças livres), e gera `public/fotos/creditos.json`, usado pela página
  `/creditos`. As fotos escolhidas à mão ficam em `ESCOLHAS_MANUAIS`. **Depois de baixar, abra cada foto e confira se
  ela mostra mesmo o lugar.**
- `npm run fotos:otimizar` (`scripts/otimizar-fotos.py`) deixa as fotos leves e converte as ilustrações das frentes
  (SVGs com fotos de vários MB dentro) em WebP. Se precisar, instale o Pillow com `pip install pillow`.
- Toda foto de terceiros precisa de licença compatível e crédito em `public/fotos/creditos.json`.

## Onde fica cada coisa

```
src/
  App.jsx                 rotas
  styles/                 tokens.css (cores, fontes, tamanhos) e global.css
  components/             Header, Footer, Carousel, PetCard, EstadoVazio, CreditoFoto, icons/…
  components/Editor/      editor da página do PET (usado na Área do PET e no Painel)
  pages/                  uma pasta por página; area/, painel/ e noticiasAdmin/ são as áreas logadas
  content/                conteúdo inicial: home, notícias, sobre, institucional e pets/<slug>.js
  services/               ÚNICO lugar que acessa dados (pets, notícias, imagens, login)
  services/local/         implementação com localStorage, com as regras de permissão
  context/AuthContext.jsx quem está logado
public/pets/<slug>/       logos e fotos de cada PET
public/fotos/             fotos dos campi (Commons) + creditos.json
scripts/                  baixar-fotos.mjs e otimizar-fotos.py
```

### Tarefas comuns

- **Trocar o logo de um PET:** salve como `public/pets/<slug>/logo.png` (ou peça para o PET enviar pelo editor).
  O site nunca amplia o logo além do tamanho natural, então use imagens com pelo menos ~300 px.
- **Adicionar um PET novo:** crie `src/content/pets/<slug>.js` (copie um existente), importe-o em
  `src/content/pets/index.js` e crie a conta dele (no modo local: `services/local/authLocal.js`).
- **PET com site próprio:** o CEPETUSP preenche "Site externo" no painel; o card da galeria passa a abrir esse link.
- **Ligar um banco de verdade:** reescreva só as funções de `src/services/` (cada uma diz, num comentário, o que o
  servidor precisa conferir). As páginas não mudam.
- Textos provisórios estão marcados com `TODO` (procure por `TODO` no projeto).

## Deploy

**GitHub Pages (teste):** o workflow `.github/workflows/github-pages.yml` publica o site a cada push na `main`, em
`https://<usuario>.github.io/<repositorio>/`. Na primeira vez, ative em *Settings → Pages → Source: GitHub Actions*.
Como o site fica numa subpasta, o build usa `BASE_PATH` e os caminhos de `public/` passam por `src/utils/urlPublica.js`.

**Definitivo:** VM da Reitoria, domínio usp.br (a definir com a Reitoria e o professor de BD). O site é estático
(`dist/`); o servidor precisa devolver o `index.html` para qualquer rota (rewrite de SPA), como faz o `vercel.json`.
