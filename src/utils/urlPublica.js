// Arquivos de public/ são referenciados como "/pets/x/logo.png".
// Quando o site não fica na raiz do domínio (ex.: GitHub Pages em /site-cepetusp/),
// é preciso colocar esse prefixo na frente. Links externos (http...) ficam iguais.
export default function urlPublica(caminho) {
  if (!caminho || !caminho.startsWith('/')) return caminho
  return import.meta.env.BASE_URL + caminho.slice(1)
}
