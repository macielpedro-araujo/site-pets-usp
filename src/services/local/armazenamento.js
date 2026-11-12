// Funções pequenas para ler/gravar JSON no localStorage com segurança

const MENSAGEM_CHEIO =
  'O armazenamento deste navegador encheu (limite de alguns MB). Use imagens menores ou ' +
  'remova fotos antigas. Para recomeçar do zero, limpe os dados do site no navegador.'

export function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave)
    return texto ? JSON.parse(texto) : padrao
  } catch {
    return padrao
  }
}

// Grava e avisa em português se o localStorage estiver cheio
export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch (erro) {
    if (erro?.name === 'QuotaExceededError') throw new Error(MENSAGEM_CHEIO)
    throw erro
  }
}

export function remover(chave) {
  localStorage.removeItem(chave)
}

// Simula a demora de um servidor, para a tela de "carregando" aparecer
export function esperar(ms = 200) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

// Cópia profunda, para ninguém alterar sem querer os dados guardados (ou o conteúdo inicial)
export function copiar(valor) {
  return structuredClone(valor)
}

export function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
