import { useMemo, useState } from 'react'
import { ArrowLeft, Download, Trash2 } from 'lucide-react'
import { clearHistory, exportHistoryCsv, loadHistory } from '../utils/history.js'

export default function AdminScreen({ config, prizes, spinDurationMs, onChange, onClose }) {
  const [history, setHistory] = useState(() => loadHistory())
  const seconds = useMemo(() => Math.round(spinDurationMs / 100) / 10, [spinDurationMs])

  function updatePrize(prizeId, patch) {
    const nextPrizes = prizes.map((prize) => (prize.id === prizeId ? { ...prize, ...patch } : prize))
    onChange({ prizes: nextPrizes })
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  return (
    <section className="admin-screen">
      <header className="admin-header">
        <button className="icon-button" type="button" aria-label="Voltar" onClick={onClose}>
          <ArrowLeft size={24} />
        </button>
        <h1>{config.texts.adminTitle}</h1>
        <img src={config.assets.logo} alt={config.clientName} />
      </header>

      <div className="admin-layout">
        <section className="admin-panel">
          <h2>Giro</h2>
          <label className="field-row">
            <span>Tempo</span>
            <strong>{seconds}s</strong>
          </label>
          <input
            type="range"
            min="2500"
            max="9000"
            step="500"
            value={spinDurationMs}
            onChange={(event) => onChange({ spinDurationMs: Number(event.target.value) })}
          />
        </section>

        <section className="admin-panel prizes-panel">
          <h2>Premios</h2>
          {prizes.map((prize) => (
            <article className="admin-prize" key={prize.id}>
              <label className="toggle-row">
                <input type="checkbox" checked={prize.active} onChange={(event) => updatePrize(prize.id, { active: event.target.checked })} />
                <span>{prize.name}</span>
              </label>
              <label className="weight-control">
                <span>Peso</span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={prize.weight}
                  onChange={(event) => updatePrize(prize.id, { weight: Number(event.target.value) })}
                />
              </label>
            </article>
          ))}
        </section>

        <section className="admin-panel">
          <h2>Historico</h2>
          <div className="history-actions">
            <button className="secondary-button" type="button" onClick={() => exportHistoryCsv(history)}>
              <Download size={18} />
              {config.texts.exportCsv}
            </button>
            <button className="danger-button" type="button" onClick={handleClearHistory}>
              <Trash2 size={18} />
              {config.texts.clearHistory}
            </button>
          </div>
          <div className="history-list">
            {history.length === 0 && <p>Nenhum sorteio registrado.</p>}
            {history.slice(0, 20).map((entry) => (
              <div className="history-entry" key={entry.id}>
                <span>{entry.prizeName}</span>
                <time>{new Date(entry.drawnAt).toLocaleString('pt-BR')}</time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
