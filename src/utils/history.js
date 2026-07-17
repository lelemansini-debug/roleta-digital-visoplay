const HISTORY_KEY = 'visoplay-wheel-history'
const ADMIN_KEY = 'visoplay-wheel-admin'
const LEADS_KEY = 'visoplay-wheel-leads'

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveDraw(prize, context = {}) {
  const entry = {
    id: crypto.randomUUID(),
    prizeId: prize.id,
    prizeName: prize.name,
    prizeWeight: Number(prize.weight) || 1,
    sliceCount: context.sliceCount ?? null,
    drawnAt: new Date().toISOString(),
  }

  const nextHistory = [entry, ...loadHistory()]
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  return entry
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function historyToCsv(history) {
  const rows = [['Premio', 'Data/Hora', 'Fatias', 'Peso']]

  history.forEach((entry) => {
    rows.push([entry.prizeName, new Date(entry.drawnAt).toLocaleString('pt-BR'), entry.sliceCount ?? '', entry.prizeWeight ?? ''])
  })

  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

export function exportHistoryCsv(history) {
  downloadCsv(historyToCsv(history), `historico-roleta-${new Date().toISOString().slice(0, 10)}.csv`)
}

export function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveLead(lead, prize) {
  const entry = {
    id: crypto.randomUUID(),
    name: lead?.name ?? '',
    whatsapp: lead?.whatsapp ?? '',
    email: lead?.email ?? '',
    prizeName: prize?.name ?? '',
    createdAt: new Date().toISOString(),
  }

  const nextLeads = [entry, ...loadLeads()]
  localStorage.setItem(LEADS_KEY, JSON.stringify(nextLeads))
  return entry
}

export function clearLeads() {
  localStorage.removeItem(LEADS_KEY)
}

export function leadsToCsv(leads) {
  const rows = [['nome', 'whatsapp', 'email', 'premio', 'dataHora']]

  leads.forEach((lead) => {
    rows.push([lead.name, lead.whatsapp, lead.email, lead.prizeName, new Date(lead.createdAt).toLocaleString('pt-BR')])
  })

  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}

export function exportLeadsCsv(leads) {
  downloadCsv(leadsToCsv(leads), `leads-roleta-${new Date().toISOString().slice(0, 10)}.csv`)
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

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}
