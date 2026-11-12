// Para onde o link "Área dos PETs" leva cada perfil (SPEC §2.5)
const AREAS = {
  pet: '/area-do-pet', // editor da página do próprio PET
  cepet: '/painel', // painel do CEPETUSP
  secretaria: '/noticias-admin', // notícias
}

export default function areaDoPerfil(perfil) {
  return AREAS[perfil] ?? '/entrar'
}
