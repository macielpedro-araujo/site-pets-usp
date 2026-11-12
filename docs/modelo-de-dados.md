# Site dos PETs USP: modelo de dados e opções de infraestrutura

> Documento para a reunião com o professor responsável pelos bancos de dados do ICMC.
> Preparado pelo CEPETUSP (PET Computação ICMC-USP), novembro de 2026.
> **Objetivo da reunião:** escolher onde e como o banco de dados e o login vão rodar.

## 1. Contexto em uma página

- Um único site reúne os **22 grupos PET da USP**. Cada grupo tem uma página (textos, fotos, membros, atividades, contatos).
- **Cada PET edita a própria página** pelo site, e a alteração é publicada na hora. O **CEPETUSP** administra as contas e pode editar qualquer página. A **secretaria do PET USP** publica as notícias da página inicial.
- O site será hospedado pela **Reitoria**, numa **VM**, com domínio **usp.br**.
- O front-end já está pronto (React, gerando arquivos estáticos). Hoje ele roda num **modo local**, com os dados no navegador (`localStorage`), só para demonstração. Todo acesso a dados passa por uma camada única (`src/services/`), então **trocar o modo local pelo backend real muda só essa pasta**.
- **Volume:** cerca de 25 contas (22 PETs + CEPETUSP + secretaria), poucas dezenas de edições por semana e algumas centenas de imagens no total. A leitura é pública e o tráfego é baixo, típico de um site institucional.

## 2. Entidades

| Entidade | Campos | Observações |
|---|---|---|
| **Conta** | id, nome, e-mail, perfil (`pet` · `cepet` · `secretaria`), pet_slug, ativa, criada_em | `pet_slug` é obrigatório se perfil = `pet`. Não há cadastro público. |
| **PET** | *estruturais:* slug (chave), nome, unidade, campus, área, ano_criacao, site_externo, ativo · *conteúdo:* logo, cor_destaque, foto_capa, foto_grupo, sobre[], tutor{nome, foto, descricao}, membros[{nome, curso, foto}], projetos[{titulo, descricao, imagem, link}], galeria[{src, legenda}], redes{instagram, linktree, linkedin, youtube, telegram, site}, email, endereco · *controle:* atualizado_em, atualizado_por | As listas (membros, projetos, galeria) podem ser JSON ou tabelas filhas: a ser decidido. |
| **Versão de PET** | id, pet_slug, dados (cópia completa do PET), editado_por, editado_em, descricao | Criada automaticamente a cada alteração. Serve para desfazer edições. |
| **Notícia** | id, titulo, resumo, texto, imagem, link_externo, data_publicacao, publicada (bool), autor | Rascunhos (`publicada = false`) não são públicos. |
| **Imagem** | caminho `<dono>/<arquivo>`, tipo, tamanho, enviada_por, enviada_em | Dono: `pets/<slug>` ou `noticias`. |

**Limites:** imagens de até 5 MB (JPEG, PNG ou WebP); no "sobre", até 10 parágrafos; até 60 membros, 30 projetos e 30 fotos na galeria. O navegador já reduz as imagens para no máximo 1600 px antes de enviar (≈ 150–400 KB cada).

**Validações (devem existir também no banco/servidor):** links só com `https://`; e-mail válido; cor no formato `#RRGGBB`; textos sempre como texto puro (o site nunca renderiza HTML ou Markdown vindo do banco).

## 3. Quem pode ler e escrever o quê

| | Público (sem login) | PET (perfil `pet`) | CEPETUSP (`cepet`) | Secretaria (`secretaria`) |
|---|---|---|---|---|
| Ler páginas dos PETs | ✅ | ✅ | ✅ | ✅ |
| Editar **conteúdo** de um PET | — | só o **próprio** | qualquer um | — |
| Editar **campos estruturais** (nome, unidade, campus, área, ano, site externo, ativo) | — | — | ✅ | — |
| Ver o histórico de versões | — | só o do próprio PET | todos | — |
| Restaurar uma versão | — | — | ✅ | — |
| Ler notícias publicadas | ✅ | ✅ | ✅ | ✅ |
| Ler rascunhos e criar/editar/excluir notícias | — | — | ✅ | ✅ |
| Enviar imagens | — | só em `pets/<seu slug>/` | em qualquer pasta | só em `noticias/` |
| Criar e desativar contas | — | — | ✅ | — |

Essas regras **precisam ser checadas no servidor/banco**, nunca só na tela. O modo local atual já as aplica (em `src/services/local/permissoes.js`), então o comportamento esperado está implementado e pode servir de referência para os testes.

## 4. Login

- As contas são **criadas pelo CEPETUSP** (sem cadastro público): uma por PET, além das contas do CEPETUSP e da secretaria.
- Fluxo: e-mail + senha → sessão → o servidor informa o perfil e o `pet_slug` → o site leva cada perfil à sua área.
- É preciso: troca de senha por e-mail ("esqueci minha senha"), desativação de conta (quando a gestão de um PET muda) e, de preferência, limite de tentativas de login.
- **Pergunta em aberto:** usar a **Senha Única USP** (login institucional) em vez de senha própria? Isso resolveria a gestão de senhas, mas a conta deixaria de ser "do grupo" e passaria a ser de uma pessoa, e precisaríamos de uma tabela "pessoa → PET".

## 5. Imagens

- São enviadas pelo editor, já reduzidas no navegador (até 1600 px, WebP ou JPEG).
- Ficam numa pasta por dono (`pets/<slug>/…`, `noticias/…`) e são servidas publicamente.
- O servidor deve conferir o tipo real do arquivo e o tamanho (até 5 MB) e só permitir gravar na pasta do próprio dono.
- Volume estimado: 22 PETs × até ~100 imagens × ~300 KB ≈ **até 1 GB** no pior caso; o mais provável é bem menos.
- Imagens que deixaram de ser usadas podem ser limpas periodicamente (opcional).

## 6. Histórico de versões

- A cada "Salvar", o servidor grava uma **cópia completa** do PET (é um JSON pequeno, já que as imagens ficam só como referência).
- O CEPETUSP pode restaurar qualquer versão, e a restauração vira uma nova versão (nada se perde).
- Sugestão: manter as últimas 50 versões por PET, ou todas, já que o volume é pequeno.

## 7. Requisitos não funcionais

- **HTTPS** obrigatório (login e envio de fotos).
- **Domínio usp.br** e VM da Reitoria: o site em si é estático (HTML/JS/CSS), e o backend pode rodar na mesma VM.
- **Backups** do banco e das imagens: diários, com cópia fora da VM. Precisamos definir quem faz e onde ficam.
- **LGPD:** as páginas publicam **nomes e fotos de alunos e tutores**. O editor exige a confirmação "as pessoas identificadas autorizaram a publicação de nome e imagem", que deve ser **registrada** (quem confirmou e quando). Também é preciso conseguir remover os dados de uma pessoa quando ela pedir.
- **Administração das contas:** o CEPETUSP, que é uma frente de alunos e muda a cada ano. Por isso convém haver um responsável docente ou técnico com acesso de administrador.
- **Usuários:** cerca de 25 contas e poucos acessos simultâneos de escrita.
- **Manutenção:** o código é mantido por alunos de graduação. Quanto mais simples a operação, melhor.

## 8. Opções de arquitetura

Em todas as opções, o front-end continua o mesmo; só muda o conteúdo de `src/services/`.

### A. PostgreSQL na VM + uma API pequena (ex.: Node/Express)

- **Prós:** controle total; tudo dentro da USP; tecnologia padrão e didática para os alunos; as regras de permissão ficam explícitas no código da API.
- **Contras:** é preciso escrever e manter o login (hash de senha, sessão, recuperação de senha), o upload e a API; mais código para os alunos cuidarem; backups e atualizações por nossa conta.

### B. Supabase *self-hosted* na VM

- **Prós:** login, banco PostgreSQL, armazenamento de arquivos e regras de acesso por linha (RLS) já prontos; quase não há código de backend; o projeto já teve um esquema desse tipo (fica no histórico do git).
- **Contras:** são vários serviços em contêineres (Docker), o que pesa mais na VM e dá mais trabalho para atualizar; o *self-hosting* é menos documentado que a versão em nuvem; as regras de acesso ficam em SQL/RLS, mais difíceis para quem está começando.

### C. Serviço gerenciado externo (ex.: Supabase Cloud, Firebase)

- **Prós:** nada para instalar nem manter; backups e segurança cuidados pelo provedor; rápido de colocar no ar.
- **Contras:** os dados (incluindo os pessoais) ficam **fora da USP**, o que exige avaliar a LGPD e as normas da universidade; dependência de um fornecedor e de limites ou custos do plano gratuito; a Reitoria pode não aceitar.

## 9. Perguntas para a reunião

1. Qual das opções (A, B ou C) é viável na VM da Reitoria? Há alguma já usada no ICMC que possamos reaproveitar?
2. Dá para usar a **Senha Única USP** para o login?
3. Quem faz o **backup**, com que frequência e onde ele fica?
4. Qual o **limite de armazenamento** da VM para as imagens?
5. Quem será o **administrador técnico** permanente (já que a equipe de alunos muda)?
6. Precisamos de algum parecer sobre **LGPD** para publicar nomes e fotos de alunos?
7. Banco relacional com tabelas filhas (membros, projetos…) ou documentos JSON por PET?
