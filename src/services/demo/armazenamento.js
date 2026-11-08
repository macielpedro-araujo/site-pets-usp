// Funções pequenas para ler/gravar JSON no localStorage com segurança

export function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave)
    return texto ? JSON.parse(texto) : padrao
  } catch {
    return padrao
  }
}

export function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

export function remover(chave) {
  localStorage.removeItem(chave)
}

// Simula a demora de um servidor, para a tela de "carregando" aparecer
export function esperar(ms = 250) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}
