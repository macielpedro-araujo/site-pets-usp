// Ícones SVG simples, desenhados à mão (sem biblioteca externa).
// Todos usam "currentColor", então herdam a cor do texto.

function Svg({ tamanho = 24, children, ...props }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconeMenu(props) {
  return (
    <Svg {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </Svg>
  )
}

export function IconeFechar(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

// Capelo de formatura (pilar Ensino)
export function IconeCapelo(props) {
  return (
    <Svg {...props}>
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v6" />
    </Svg>
  )
}

// Livro aberto (pilar Pesquisa)
export function IconeLivro(props) {
  return (
    <Svg {...props}>
      <path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z" />
      <path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z" />
    </Svg>
  )
}

// Rede de pontos conectados (pilar Extensão)
export function IconeRede(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M6.5 6.5l3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7" />
    </Svg>
  )
}

export function IconeFunil(props) {
  return (
    <Svg {...props}>
      <path d="M3 4h18l-7 9v6l-4 2v-8z" fill="currentColor" />
    </Svg>
  )
}

export function IconeSetaEsquerda(props) {
  return (
    <Svg {...props}>
      <path d="M15 18l-6-6 6-6" />
    </Svg>
  )
}

export function IconeSetaDireita(props) {
  return (
    <Svg {...props}>
      <path d="M9 18l6-6-6-6" />
    </Svg>
  )
}

export function IconeSetaBaixo(props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

export function IconeInstagram(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </Svg>
  )
}

export function IconeLinktree(props) {
  return (
    <Svg {...props}>
      <path d="M12 2v20M5 6l7 6 7-6M4 13h16M6 18l6-5 6 5" />
    </Svg>
  )
}

export function IconeLinkedin(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </Svg>
  )
}

export function IconeYoutube(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </Svg>
  )
}

export function IconeSite(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </Svg>
  )
}

export function IconeEmail(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Svg>
  )
}


export function IconeLinkExterno(props) {
  return (
    <Svg {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Svg>
  )
}

// Avião de papel (Telegram)
export function IconeTelegram(props) {
  return (
    <Svg {...props}>
      <path d="M21 4L3 11l6 2 2 6 3-4 5 4z" />
      <path d="M9 13l12-9" />
    </Svg>
  )
}

// Marcador de mapa (endereço)
export function IconeLocal(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  )
}

// Moldura de foto (estados vazios de imagem)
export function IconeImagem(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-8 9" />
    </Svg>
  )
}
