import { useMemo, useState } from 'react'
import { ArrowLeft, Download, Eye, RotateCcw, Trash2 } from 'lucide-react'
import { clearHistory, clearLeads, exportHistoryCsv, exportLeadsCsv, loadHistory, loadLeads } from '../utils/history.js'

const resultImagePresets = [
  { label: 'Pequena', width: 34, height: 18 },
  { label: 'Média', width: 50, height: 28 },
  { label: 'Grande', width: 68, height: 38 },
  { label: 'Máxima', width: 88, height: 50 },
]

export default function AdminScreen({ config, prizes, sliceCount, spinDurationMs, resultLayout, leadCapture, onChange, onResetPrizes, onTestResult, onClose }) {
  const [history, setHistory] = useState(() => loadHistory())
  const [leads, setLeads] = useState(() => loadLeads())
  const seconds = useMemo(() => Math.round(spinDurationMs / 100) / 10, [spinDurationMs])
  const visiblePrizes = prizes.slice(0, sliceCount)

  function updatePrize(prizeId, patch) {
    const nextPrizes = prizes.map((prize) => (prize.id === prizeId ? normalizePrizePatch(prize, patch) : prize))
    onChange({ prizes: ensureOneActivePrize(nextPrizes, sliceCount) })
  }

  function handleSliceCountChange(event) {
    const nextSliceCount = Number(event.target.value)
    onChange({ sliceCount: nextSliceCount, prizes: ensureOneActivePrize(prizes, nextSliceCount) })
  }

  function updateResultLayout(patch) {
    onChange({ resultLayout: patch })
  }

  function updateResultImageWidth(width) {
    updateResultLayout({
      resultPrizeImageLeft: `${Math.max(0, (100 - width) / 2)}%`,
      resultPrizeImageWidth: `${width}%`,
    })
  }

  function applyResultImagePreset({ width, height }) {
    updateResultLayout({
      resultPrizeImageLeft: `${Math.max(0, (100 - width) / 2)}%`,
      resultPrizeImageWidth: `${width}%`,
      resultPrizeImageHeight: `${height}%`,
    })
  }

  function updateLeadCapture(patch) {
    onChange({ leadCapture: patch })
  }

  function handleImageChange(prizeId, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updatePrize(prizeId, { image: reader.result })
    reader.readAsDataURL(file)
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  function handleClearLeads() {
    if (!window.confirm('Limpar todos os leads salvos?')) return
    clearLeads()
    setLeads([])
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
        <section className="admin-panel result-settings-panel">
          <div className="admin-panel-title-row">
            <h2>Tela de resultado</h2>
            <button className="secondary-button compact-button" type="button" onClick={onTestResult}>
              <Eye size={17} />
              Testar tela de resultado
            </button>
          </div>

          <div className="result-image-size-control">
            <span>Tamanho rápido da imagem</span>
            <div className="result-image-size-presets" role="group" aria-label="Tamanho da imagem do prêmio">
              {resultImagePresets.map((preset) => (
                <button
                  className={Number.parseFloat(resultLayout.resultPrizeImageWidth) === preset.width ? 'is-active' : ''}
                  type="button"
                  aria-pressed={Number.parseFloat(resultLayout.resultPrizeImageWidth) === preset.width}
                  onClick={() => applyResultImagePreset(preset)}
                  key={preset.label}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-grid two-cols">
            <RangeField label="Posição vertical da imagem" value={resultLayout.resultPrizeImageTop} min={10} max={58} onChange={(value) => updateResultLayout({ resultPrizeImageTop: value + '%' })} />
            <RangeField label="Posição horizontal da imagem" value={resultLayout.resultPrizeImageLeft} min={0} max={90} onChange={(value) => updateResultLayout({ resultPrizeImageLeft: value + '%' })} />
            <RangeField label="Largura da imagem" value={resultLayout.resultPrizeImageWidth} min={18} max={92} onChange={updateResultImageWidth} />
            <RangeField label="Altura da imagem" value={resultLayout.resultPrizeImageHeight} min={10} max={52} onChange={(value) => updateResultLayout({ resultPrizeImageHeight: value + '%' })} />
            <RangeField label="Posição vertical do nome" value={resultLayout.resultPrizeNameTop} min={42} max={64} onChange={(value) => updateResultLayout({ resultPrizeNameTop: value + '%' })} />
            <RangeField label="Posição horizontal do nome" value={resultLayout.resultPrizeNameLeft} min={4} max={36} onChange={(value) => updateResultLayout({ resultPrizeNameLeft: value + '%' })} />
            <RangeField label="Largura do nome" value={resultLayout.resultPrizeNameWidth} min={40} max={92} onChange={(value) => updateResultLayout({ resultPrizeNameWidth: value + '%' })} />
            <RangeField label="Tamanho da fonte" value={resultLayout.resultPrizeNameFontSize} min={32} max={96} suffix="px" onChange={(value) => updateResultLayout({ resultPrizeNameFontSize: value })} />
            <label className="color-control result-color-control">
              <span>Cor do texto</span>
              <input type="color" value={resultLayout.resultPrizeNameColor} onChange={(event) => updateResultLayout({ resultPrizeNameColor: event.target.value })} />
            </label>
            <label className="slice-count-control">
              <span>Alinhamento</span>
              <select value={resultLayout.resultPrizeNameAlign} onChange={(event) => updateResultLayout({ resultPrizeNameAlign: event.target.value })}>
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </label>
          </div>
        </section>

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
          <div className="admin-panel-title-row">
            <h2>Prêmios da Roleta</h2>
            <button className="secondary-button compact-button" type="button" onClick={onResetPrizes}>
              <RotateCcw size={17} />
              Restaurar prêmios padrão
            </button>
          </div>

          <label className="slice-count-control">
            <span>Quantidade de fatias</span>
            <select value={sliceCount} onChange={handleSliceCountChange}>
              {config.sliceOptions.map((option) => (
                <option value={option} key={option}>
                  {option} fatias
                </option>
              ))}
            </select>
          </label>

          <div className="admin-prizes-list">
            {visiblePrizes.map((prize, index) => (
              <article className="admin-prize-editor" key={prize.id}>
                <strong className="slice-number">Fatia {index + 1}</strong>

                <label className="admin-text-field prize-name-field">
                  <span>Nome do prêmio</span>
                  <input type="text" value={prize.name} onChange={(event) => updatePrize(prize.id, { name: event.target.value })} onBlur={() => updatePrize(prize.id, { name: prize.name })} />
                </label>

                <label className="admin-image-field">
                  <span>Imagem do prêmio</span>
                  <input type="file" accept="image/*" onChange={(event) => handleImageChange(prize.id, event.target.files?.[0])} />
                </label>

                <div className="prize-image-preview">
                  {prize.image ? <img src={prize.image} alt="" /> : <span>Sem imagem</span>}
                  {prize.image && !isUploadedPrizeImage(prize.image) && <small>Imagem automática da pasta</small>}
                  {isUploadedPrizeImage(prize.image) && (
                    <button
                      className="compact-link-button"
                      type="button"
                      onClick={() => updatePrize(prize.id, { image: config.prizeImages?.[prize.id] ?? null })}
                    >
                      Usar imagem da pasta
                    </button>
                  )}
                </div>

                <label className="admin-color-field">
                  <span>Cor da fatia</span>
                  <input type="color" value={prize.color} onChange={(event) => updatePrize(prize.id, { color: event.target.value })} />
                </label>

                <label className="admin-number-field">
                  <span>Peso/probabilidade</span>
                  <input type="number" min="1" max="99" value={prize.weight} onChange={(event) => updatePrize(prize.id, { weight: event.target.value })} />
                </label>

                <label className="toggle-row admin-active-toggle">
                  <input type="checkbox" checked={prize.active} onChange={(event) => updatePrize(prize.id, { active: event.target.checked })} />
                  <span>{prize.active ? 'Ativo' : 'Inativo'}</span>
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel leads-panel">
          <h2>Captura de Leads</h2>
          <div className="lead-settings-list">
            <ToggleControl label="Ativar captura" checked={leadCapture.enabled} onChange={(value) => updateLeadCapture({ enabled: value })} />
            <ToggleControl label="Nome obrigatório" checked={leadCapture.requireName} onChange={(value) => updateLeadCapture({ requireName: value })} />
            <ToggleControl label="WhatsApp obrigatório" checked={leadCapture.requireWhatsapp} onChange={(value) => updateLeadCapture({ requireWhatsapp: value })} />
            <ToggleControl label="E-mail opcional" checked={leadCapture.showEmail} onChange={(value) => updateLeadCapture({ showEmail: value })} />
            <ToggleControl label="Permitir pular cadastro" checked={leadCapture.allowSkip} onChange={(value) => updateLeadCapture({ allowSkip: value })} />
            <label className="admin-text-field">
              <span>Texto do botão</span>
              <input type="text" value={leadCapture.buttonText} onChange={(event) => updateLeadCapture({ buttonText: event.target.value })} />
            </label>
          </div>

          <div className="history-actions">
            <button className="secondary-button" type="button" onClick={() => exportLeadsCsv(leads)}>
              <Download size={18} />
              Exportar leads
            </button>
            <button className="danger-button" type="button" onClick={handleClearLeads}>
              <Trash2 size={18} />
              Limpar leads
            </button>
          </div>
          <p className="admin-muted">Total de leads: {leads.length}</p>
          <div className="history-list leads-list">
            {leads.length === 0 && <p>Nenhum lead registrado.</p>}
            {leads.slice(0, 20).map((lead) => (
              <div className="history-entry lead-entry" key={lead.id}>
                <span>{lead.name || 'Sem nome'} · {lead.whatsapp || 'Sem WhatsApp'}</span>
                <small>{lead.email || 'Sem e-mail'} · {lead.prizeName || 'Sem prêmio'}</small>
                <time>{new Date(lead.createdAt).toLocaleString('pt-BR')}</time>
              </div>
            ))}
          </div>
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

function RangeField({ label, value, min, max, suffix = '%', onChange }) {
  const numericValue = Number.parseFloat(value)
  return (
    <label className="range-field">
      <span>{label}</span>
      <strong>{numericValue}{suffix}</strong>
      <input type="range" min={min} max={max} step="1" value={numericValue} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function ToggleControl({ label, checked, onChange }) {
  return (
    <label className="toggle-row lead-toggle-row">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

function normalizePrizePatch(prize, patch) {
  return {
    ...prize,
    ...patch,
    name: patch.name !== undefined ? patch.name || 'Prêmio' : prize.name || 'Prêmio',
    image: patch.image !== undefined ? patch.image : prize.image ?? null,
    weight: patch.weight !== undefined ? Math.max(1, Number(patch.weight) || 1) : Math.max(1, Number(prize.weight) || 1),
  }
}

function ensureOneActivePrize(prizes, sliceCount) {
  if (prizes.slice(0, sliceCount).some((prize) => prize.active)) return prizes
  return prizes.map((prize, index) => (index === 0 ? { ...prize, active: true } : prize))
}

function isUploadedPrizeImage(image) {
  return typeof image === 'string' && image.startsWith('data:image/')
}
