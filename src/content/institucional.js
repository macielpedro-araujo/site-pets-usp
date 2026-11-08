// Conteúdo da página "Institucional".
// TODO: revisar todo o conteúdo com a Pró-Reitoria de Graduação / CLAA.

export const papeis = [
  {
    titulo: 'Pró-Reitoria de Graduação (PRG)',
    texto: 'A Pró-Reitoria de Graduação acompanha o programa dentro da USP e faz a ligação entre os grupos e o MEC. (texto provisório)',
  },
  {
    titulo: 'CLAA – Comitê Local de Acompanhamento e Avaliação',
    texto: 'O CLAA acompanha e avalia os grupos PET da universidade, analisando planejamentos e relatórios e apoiando os processos de seleção de tutores. (texto provisório)',
  },
]

// link: null quando ainda não temos o endereço certo
export const documentos = [
  {
    nome: 'Lei nº 11.180/2005 (institui o PET)',
    link: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11180.htm',
  },
  { nome: 'Portaria MEC nº 976/2010', link: null }, // TODO: link oficial
  { nome: 'Manual de Orientações Básicas do PET', link: null }, // TODO: link oficial
  { nome: 'Regimento do CLAA da USP', link: null }, // TODO: link oficial
]

// TODO: contato oficial
export const contato = {
  texto: 'Dúvidas sobre o programa na USP podem ser enviadas para a Pró-Reitoria de Graduação. Questões sobre este site: CEPETUSP (PET Computação ICMC-USP).',
  email: null,
}
