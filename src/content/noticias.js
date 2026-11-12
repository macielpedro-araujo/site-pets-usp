// Notícias iniciais (conteúdo de partida do modo local e, no futuro, do banco).
// Quem publica notícias é a secretaria do PET USP, pela página /noticias-admin (SPEC §2.5).
// TODO (secretaria): trocar estes textos institucionais por notícias reais do programa.
// Campos: id, titulo, resumo, texto, imagem, linkExterno, dataPublicacao ('AAAA-MM-DD'),
// publicada (true/false) e autor.
export const noticias = [
  {
    id: 'conheca-os-grupos',
    titulo: 'Conheça os grupos PET da USP',
    resumo: 'Os grupos do Programa de Educação Tutorial estão em vários campi e áreas do conhecimento da universidade.',
    texto:
      'A USP tem grupos PET em São Paulo, São Carlos, Ribeirão Preto, Piracicaba, Pirassununga e Bauru, ' +
      'em áreas que vão das Ciências Humanas às Engenharias.\n\n' +
      'Na página "Todos os PETs da USP" é possível filtrar os grupos por área de conhecimento e por campus ' +
      'e conhecer a página de cada um.',
    imagem: '/fotos/campus-butanta.jpg',
    linkExterno: null,
    dataPublicacao: '2026-11-10',
    publicada: true,
    autor: 'Secretaria do PET USP',
  },
  {
    id: 'tripe-ensino-pesquisa-extensao',
    titulo: 'Ensino, pesquisa e extensão: o tripé do PET',
    resumo: 'Entenda como as atividades dos grupos PET combinam formação, investigação científica e ações com a comunidade.',
    texto:
      'Os grupos PET desenvolvem atividades de ensino (como minicursos e grupos de estudo), de pesquisa ' +
      '(com a orientação do professor tutor) e de extensão (ações que levam o conhecimento da universidade ' +
      'para a comunidade).\n\n' +
      'Saiba mais sobre o programa na página "Sobre o programa na USP".',
    imagem: '/fotos/campus-sao-carlos.jpg',
    linkExterno: null,
    dataPublicacao: '2026-11-05',
    publicada: true,
    autor: 'Secretaria do PET USP',
  },
  {
    id: 'paginas-dos-grupos',
    titulo: 'Cada grupo PET cuida da própria página',
    resumo: 'Pela Área dos PETs, cada grupo atualiza textos, fotos, membros, atividades e contatos da sua página.',
    texto:
      'Cada grupo PET da USP tem uma conta para editar a própria página neste site. As alterações são ' +
      'publicadas na hora.\n\n' +
      'As contas são criadas pelo CEPETUSP, frente do PET Computação (ICMC-USP) que mantém o site.',
    imagem: '/fotos/campus-ribeirao.jpg',
    linkExterno: null,
    dataPublicacao: '2026-10-28',
    publicada: true,
    autor: 'Secretaria do PET USP',
  },
]
