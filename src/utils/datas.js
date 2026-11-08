// Formata datas ISO (ex.: "2026-11-08T14:30:00Z") no padrão brasileiro

export function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function formatarDataHora(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
