// Regras de permissão (SPEC §2.2). São as MESMAS que o servidor de verdade terá de checar:
// aqui elas valem só para o modo local, mas o comportamento na tela fica igual ao do sistema real.

// Campos que só o CEPETUSP pode mudar
export const CAMPOS_ESTRUTURAIS = ['slug', 'nome', 'unidade', 'campus', 'area', 'anoCriacao', 'siteExterno', 'ativo']

// Conteúdo da página: o próprio PET ou o CEPETUSP
export function podeEditarPet(usuario, slug) {
  if (!usuario) return false
  if (usuario.perfil === 'cepet') return true
  return usuario.perfil === 'pet' && usuario.petSlug === slug
}

// Histórico de versões: quem pode editar também pode ver
export const podeVerVersoes = podeEditarPet

export function podeRestaurarVersao(usuario) {
  return usuario?.perfil === 'cepet'
}

export function podeEditarCamposEstruturais(usuario) {
  return usuario?.perfil === 'cepet'
}

// Notícias: secretaria do PET USP e CEPETUSP
export function podeEditarNoticias(usuario) {
  return usuario?.perfil === 'secretaria' || usuario?.perfil === 'cepet'
}

// Imagens: "pets/<slug>" (quem edita aquele PET) ou "noticias" (quem edita notícias)
export function podeEnviarImagem(usuario, dono) {
  if (dono === 'noticias') return podeEditarNoticias(usuario)
  const [pasta, slug] = dono.split('/')
  return pasta === 'pets' && podeEditarPet(usuario, slug)
}
