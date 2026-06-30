const HISTORY_KEY = 'visoplay-wheel-history'
const ADMIN_KEY = 'visoplay-wheel-admin'

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveDraw(prize) {
  const entry = {
    id: crypto.randomUUID(),
    prizeId: prize.id,
    prizeName: prize.name,
    drawnAt: new Date().toISOString(),
  }

  const nextHistory = [entry, ...loadHistory()]
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  return nextHistory
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function historyToCsv(history) {
  const rows = [['Premio', 'Data/Hora']]

  history.forEach((entry) => {
    rows.push([entry.prizeName, new Date(entry.drawnAt).toLocaleString('pt-BR')])
  })

  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

export function exportHistoryCsv(history) {
  const blob = new Blob([historyToCsv(history)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `historico-roleta-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function loadAdminSettings() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY)) ?? null
  } catch {
    return null
  }
}

export function saveAdminSettings(settings) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(settings))
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}
