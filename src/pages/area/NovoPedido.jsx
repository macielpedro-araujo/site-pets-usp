import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CabecalhoArea from '../../components/CabecalhoArea/CabecalhoArea.jsx'
import {
  LIMITE_TITULO,
  MAX_ANEXOS,
  MAX_TAMANHO_ANEXO,
  SECOES,
  TIPOS,
  TIPOS_ANEXO,
} from '../../services/constantes.js'
import { criar } from '../../services/solicitacoes.js'
import useTituloPagina from '../../hooks/useTituloPagina.js'
import styles from './Area.module.css'

// Confere os campos e devolve um objeto { campo: 'mensagem de erro' }
function validar(dados, arquivos) {
  const erros = {}
  if (!dados.tipo) erros.tipo = 'Escolha o tipo de pedido.'
  if (!dados.secao) erros.secao = 'Escolha a seção da página.'
  if (!dados.titulo.trim()) erros.titulo = 'Escreva um título.'
  else if (dados.titulo.length > LIMITE_TITULO) erros.titulo = `O título pode ter até ${LIMITE_TITULO} caracteres.`
  if (!dados.descricao.trim()) erros.descricao = 'Descreva o que precisa ser mudado.'

  if (arquivos.length > MAX_ANEXOS) {
    erros.anexos = `Envie no máximo ${MAX_ANEXOS} arquivos.`
  } else {
    const invalido = arquivos.find((a) => !TIPOS_ANEXO.includes(a.type))
    const grande = arquivos.find((a) => a.size > MAX_TAMANHO_ANEXO)
    if (invalido) erros.anexos = `"${invalido.name}" não é imagem nem PDF.`
    else if (grande) erros.anexos = `"${grande.name}" tem mais de 5 MB.`
  }
  return erros
}

export default function NovoPedido() {
  useTituloPagina('Novo pedido')
  const navigate = useNavigate()

  const [dados, setDados] = useState({ tipo: '', secao: '', titulo: '', descricao: '' })
  const [arquivos, setArquivos] = useState([])
  const [erros, setErros] = useState({})
  const [erroEnvio, setErroEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Atualiza um campo do formulário pelo "name" do input
  function aoMudar(e) {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  function aoEscolherArquivos(e) {
    // Junta com os que já estavam escolhidos
    setArquivos([...arquivos, ...Array.from(e.target.files)])
    e.target.value = '' // permite escolher o mesmo arquivo de novo
  }

  function removerArquivo(indice) {
    setArquivos(arquivos.filter((_, i) => i !== indice))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    setErroEnvio('')
    const novosErros = validar(dados, arquivos)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) {
      // Leva o foco para o primeiro campo com erro
      document.getElementById(`campo-${Object.keys(novosErros)[0]}`)?.focus()
      return
    }

    setEnviando(true)
    try {
      const pedido = await criar(
        { ...dados, titulo: dados.titulo.trim(), descricao: dados.descricao.trim() },
        arquivos,
      )
      navigate(`/area-do-pet/pedidos/${pedido.id}`, { state: { criado: true } })
    } catch (err) {
      setErroEnvio(err.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <CabecalhoArea titulo="Área do PET" />
      <div className={`container ${styles.estreito}`}>
        <p className={styles.voltar}>
          <Link to="/area-do-pet">← Voltar para meus pedidos</Link>
        </p>
        <h1>Novo pedido de alteração</h1>
        <p>Descreva o que deve mudar na página do seu PET. O CEPETUSP vai analisar e responder por aqui.</p>

        <form onSubmit={aoEnviar} noValidate className={styles.formulario}>
          {erroEnvio && <p className="aviso-erro" role="alert">{erroEnvio}</p>}

          <div className={styles.duasColunas}>
            <div className="campo">
              <label htmlFor="campo-tipo">Tipo de pedido *</label>
              <select id="campo-tipo" name="tipo" value={dados.tipo} onChange={aoMudar} aria-invalid={!!erros.tipo}>
                <option value="">Selecione…</option>
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {erros.tipo && <span className="campo-erro">{erros.tipo}</span>}
            </div>

            <div className="campo">
              <label htmlFor="campo-secao">Seção da página *</label>
              <select id="campo-secao" name="secao" value={dados.secao} onChange={aoMudar} aria-invalid={!!erros.secao}>
                <option value="">Selecione…</option>
                {SECOES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {erros.secao && <span className="campo-erro">{erros.secao}</span>}
            </div>
          </div>

          <div className="campo">
            <label htmlFor="campo-titulo">Título *</label>
            <input
              id="campo-titulo"
              name="titulo"
              value={dados.titulo}
              onChange={aoMudar}
              maxLength={LIMITE_TITULO}
              placeholder="Ex.: Atualizar a lista de membros"
              aria-invalid={!!erros.titulo}
              aria-describedby="ajuda-titulo"
            />
            <span id="ajuda-titulo" className="campo-ajuda">
              {dados.titulo.length}/{LIMITE_TITULO} caracteres
            </span>
            {erros.titulo && <span className="campo-erro">{erros.titulo}</span>}
          </div>

          <div className="campo">
            <label htmlFor="campo-descricao">Descrição *</label>
            <textarea
              id="campo-descricao"
              name="descricao"
              value={dados.descricao}
              onChange={aoMudar}
              aria-invalid={!!erros.descricao}
              aria-describedby="ajuda-descricao"
            />
            <span id="ajuda-descricao" className="campo-ajuda">
              Explique o que mudar e, se for texto, escreva o texto novo completo.
            </span>
            {erros.descricao && <span className="campo-erro">{erros.descricao}</span>}
          </div>

          <div className="campo">
            <label htmlFor="campo-anexos">Anexos (opcional)</label>
            <input
              id="campo-anexos"
              type="file"
              multiple
              accept={TIPOS_ANEXO.join(',')}
              onChange={aoEscolherArquivos}
              disabled={arquivos.length >= MAX_ANEXOS}
              aria-describedby="ajuda-anexos"
            />
            <span id="ajuda-anexos" className="campo-ajuda">
              Até {MAX_ANEXOS} arquivos (imagens ou PDF), com até 5 MB cada.
            </span>
            {erros.anexos && <span className="campo-erro">{erros.anexos}</span>}

            {arquivos.length > 0 && (
              <ul className={styles.arquivos}>
                {arquivos.map((arquivo, i) => (
                  <li key={i}>
                    <span>{arquivo.name}</span>
                    <button type="button" onClick={() => removerArquivo(i)}>
                      Remover <span className="sr-only">{arquivo.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.acoes}>
            <button type="submit" className="btn btn-primario" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar pedido'}
            </button>
            <Link to="/area-do-pet" className="btn btn-secundario">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
