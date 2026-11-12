import { useEffect, useState } from 'react'

// Chama uma função assíncrona dos services e guarda o resultado, o "carregando" e o erro.
// Uso: const { dados, carregando, erro, recarregar } = useDados(() => buscarPet(slug), [slug])
export default function useDados(carregar, dependencias) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null })
  const [versao, setVersao] = useState(0) // muda para forçar uma nova leitura

  useEffect(() => {
    let ativo = true // evita atualizar a tela depois que o componente saiu
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }))
    carregar()
      .then((dados) => ativo && setEstado({ dados, carregando: false, erro: null }))
      .catch((erro) => ativo && setEstado({ dados: null, carregando: false, erro: erro.message }))
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, versao])

  return { ...estado, recarregar: () => setVersao((v) => v + 1) }
}
