// Conteúdo REAL do PET Computação (ICMC-USP São Carlos), página-vitrine para a apresentação.
// Fonte: site oficial do grupo (https://pet.icmc.usp.br), consultado em 11/11/2026.
// As imagens referenciadas abaixo são baixadas por scripts/baixar-fotos.mjs (ver docs/SPEC-v2.md §5).
// TODO (grupo): confirmar o(a) tutor(a) atual e incluir os membros que entraram depois da última
// atualização do site oficial.
export default {
  slug: 'computacao',
  nome: 'PET Computação',
  unidade: 'ICMC',
  campus: 'São Carlos',
  area: 'Ciências Exatas e da Terra',
  anoCriacao: 1995,
  logo: '/pets/computacao/logo.png',
  corDestaque: '#127E3F', // verde da identidade visual do PET Computação
  fotoCapa: '/pets/computacao/capa.jpg',
  fotoGrupo: '/pets/computacao/grupo.png',
  sobre: [
    'O PET Computação é o grupo do Programa de Educação Tutorial do Instituto de Ciências Matemáticas e de Computação (ICMC) da USP, em São Carlos. Reúne estudantes de Ciências de Computação que desenvolvem, de forma colaborativa, projetos de ensino, pesquisa e extensão, integrando teoria e prática.',
    'O grupo foi criado em 1995, por iniciativa da professora Regina Helena Carlucci Santana, e celebrou 30 anos de história em 2025. Ao longo desse tempo, consolidou a organização da Semana da Computação (Semcomp) e projetos de extensão que levam o ensino gratuito de programação e informática a jovens de escolas públicas e a idosos.',
    'Hoje, mais de 20 membros atuam em 8 frentes que se complementam: Semana de Recepção, Codifique, Comunicação, Full-Stack, Gestão, Overclock, Pesquisa e Social. Além disso, o grupo mantém a frente CEPETUSP, responsável por este site que reúne todos os PETs da USP.',
  ],
  // Galeria de fotos (carrossel abaixo da foto do grupo)
  galeria: [
    { src: '/pets/computacao/galeria/2025-imersao.png', legenda: 'Atividade de imersão, 2025' },
    { src: '/pets/computacao/galeria/2025-amigo-secreto.jpg', legenda: 'Confraternização do grupo, 2025' },
    { src: '/pets/computacao/galeria/semana-recepcao.webp', legenda: 'Semana de Recepção dos calouros' },
    { src: '/pets/computacao/galeria/2018-informatica-idosos.jpg', legenda: 'Curso de informática para idosos, 2018' },
    { src: '/pets/computacao/galeria/2007-grupo.jpg', legenda: 'O grupo em 2007' },
  ],
  tutor: {
    nome: null, // TODO (grupo): nome do(a) tutor(a) atual
    foto: null,
    descricao: null,
  },
  // Membros e frentes conforme o site oficial do grupo.
  membros: [
    { nome: 'Arthur Dias', curso: 'Gestão · Social', foto: '/pets/computacao/membros/arthur.jpg' },
    { nome: 'Beatriz Aredes', curso: 'Comunicação · Pesquisa', foto: null },
    { nome: 'Giovanna Lopes', curso: 'Comunicação · Full-Stack', foto: '/pets/computacao/membros/gilopes.jpg' },
    { nome: 'Giovanna Noventa', curso: 'Codifique · Full-Stack', foto: '/pets/computacao/membros/noventa.jpg' },
    { nome: 'Gustavo Pires', curso: 'Gestão · Overclock', foto: '/pets/computacao/membros/darroca.jpg' },
    { nome: 'Gustavo Vidigal', curso: 'Comunicação · Gestão', foto: '/pets/computacao/membros/vidigal.jpg' },
    { nome: 'Jhonathan Alves', curso: 'Comunicação · Social', foto: '/pets/computacao/membros/jonas.jpg' },
    { nome: 'João Pedro Boiago', curso: 'Full-Stack · Gestão', foto: '/pets/computacao/membros/boiago.jpg' },
    { nome: 'Kattryel Rezende', curso: 'Full-Stack · Social', foto: '/pets/computacao/membros/kattryel.jpg' },
    { nome: 'Leonardo Bertho', curso: 'Codifique · Overclock', foto: null },
    { nome: 'Lorena Borges', curso: 'Codifique · Overclock', foto: '/pets/computacao/membros/lorena.jpg' },
    { nome: 'Luis Guilherme Zanetti', curso: 'Codifique · Full-Stack', foto: '/pets/computacao/membros/gui.jpg' },
    { nome: 'Pedro Henrique Oliveira', curso: 'Full-Stack · Pesquisa', foto: '/pets/computacao/membros/d.jpg' },
    { nome: 'Pedro Tiago Biffi', curso: 'Codifique · Gestão', foto: '/pets/computacao/membros/pt.jpg' },
    { nome: 'Rafaela Breseghello', curso: 'Comunicação · Gestão', foto: '/pets/computacao/membros/rafa.jpg' },
    { nome: 'Sofia Albuquerque', curso: 'Full-Stack · Pesquisa', foto: '/pets/computacao/membros/sofi.jpg' },
  ],
  // "Atividades e projetos": frentes e projetos do grupo.
  projetos: [
    {
      titulo: 'Codifique',
      descricao: 'Curso gratuito de lógica de programação e Python para estudantes do ensino médio de escolas públicas de São Carlos, com aulas dadas por membros do PET e monitores da USP.',
      imagem: '/pets/computacao/frentes/codifique.svg',
      link: null,
    },
    {
      titulo: 'CodifiKids',
      descricao: 'Aulas de lógica de programação com Scratch para turmas do ensino fundamental em escolas públicas de São Carlos.',
      imagem: null,
      link: null,
    },
    {
      titulo: 'Overclock',
      descricao: 'Aulas e listas de exercícios de Introdução à Computação em C para calouros da USP São Carlos, com o objetivo de nivelar o conhecimento e reduzir a evasão nos cursos de computação.',
      imagem: '/pets/computacao/frentes/overclock.svg',
      link: null,
    },
    {
      titulo: 'Semana de Recepção',
      descricao: 'Acolhida dos calouros com dinâmicas, atividades de computação e ações que ajudam na adaptação à vida universitária.',
      imagem: '/pets/computacao/galeria/semana-recepcao.webp',
      link: null,
    },
    {
      titulo: 'Full-Stack',
      descricao: 'Desenvolvimento de projetos completos, do front-end ao back-end, como este site dos PETs da USP e ferramentas para a comunidade acadêmica.',
      imagem: '/pets/computacao/frentes/fullstack.svg',
      link: null,
    },
    {
      titulo: 'Pesquisa',
      descricao: 'Produção de estudos sobre temas acadêmicos e do mercado de trabalho em computação.',
      imagem: '/pets/computacao/frentes/pesquisa.svg',
      link: null,
    },
    {
      titulo: 'Social',
      descricao: 'Ações para a comunidade externa à USP, como campanhas de doação de sangue, arrecadações e eventos beneficentes.',
      imagem: '/pets/computacao/frentes/social.svg',
      link: null,
    },
    {
      titulo: 'Comunicação e Gestão',
      descricao: 'Redes sociais, identidade visual e a organização interna que mantém o grupo funcionando.',
      imagem: '/pets/computacao/frentes/comunicacao.svg',
      link: null,
    },
  ],
  redes: {
    instagram: 'https://www.instagram.com/petcomputacaousp/',
    linktree: 'https://linktr.ee/petcomputacaousp',
    linkedin: 'https://www.linkedin.com/company/petcompusp/',
    youtube: 'https://www.youtube.com/@PETComputacaoUSP',
    telegram: 'https://t.me/PETcompUSP',
    site: 'https://pet.icmc.usp.br',
  },
  email: 'petcomp@icmc.usp.br',
  endereco: 'ICMC-USP, Bloco 1, sala 1-103 · Av. Trabalhador São-carlense, 400, São Carlos/SP',
  siteExterno: null, // a página fica no site geral; o site próprio aparece em "redes.site"
}
