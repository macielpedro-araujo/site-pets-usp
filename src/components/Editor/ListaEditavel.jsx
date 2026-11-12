import styles from './Editor.module.css'

// Lista com botões de adicionar, remover e mover para cima/baixo (sem arrastar).
// itens: a lista; aoMudar: recebe a lista nova; novoItem: função que cria um item vazio;
// renderItem(item, mudarItem, indice): desenha os campos de um item.
export default function ListaEditavel({ itens, aoMudar, novoItem, renderItem, maximo, rotuloItem = 'item' }) {
  function mudarItem(indice, novo) {
    aoMudar(itens.map((item, i) => (i === indice ? novo : item)))
  }

  function remover(indice) {
    aoMudar(itens.filter((_, i) => i !== indice))
  }

  // Troca o item de lugar com o vizinho (direcao: -1 sobe, +1 desce)
  function mover(indice, direcao) {
    const nova = [...itens]
    const destino = indice + direcao
    ;[nova[indice], nova[destino]] = [nova[destino], nova[indice]]
    aoMudar(nova)
  }

  const cheia = maximo && itens.length >= maximo

  return (
    <div>
      {itens.length === 0 && <p className={styles.listaVazia}>Nenhum {rotuloItem} ainda.</p>}
      <ol className={styles.lista}>
        {itens.map((item, i) => (
          <li key={i} className={styles.itemLista}>
            <div className={styles.itemCampos}>{renderItem(item, (novo) => mudarItem(i, novo), i)}</div>
            <div className={styles.itemAcoes}>
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Mover ${rotuloItem} ${i + 1} para cima`}>
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === itens.length - 1}
                aria-label={`Mover ${rotuloItem} ${i + 1} para baixo`}
              >
                ↓
              </button>
              <button type="button" onClick={() => remover(i)} className={styles.remover}>
                Remover
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-secundario" onClick={() => aoMudar([...itens, novoItem()])} disabled={cheia}>
        + Adicionar {rotuloItem}
      </button>
      {cheia && <span className={styles.limite}> Limite de {maximo} atingido.</span>}
    </div>
  )
}
