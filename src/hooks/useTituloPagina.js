import { useEffect } from 'react'

// Muda o título da aba do navegador em cada página
export default function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | PETs USP` : 'PETs USP – Programa de Educação Tutorial'
  }, [titulo])
}
