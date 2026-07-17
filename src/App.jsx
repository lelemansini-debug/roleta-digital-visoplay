import { useMemo, useState } from 'react'
import { clientConfig } from './config/clientConfig.js'
import AdminScreen from './components/AdminScreen.jsx'
import OperatorNav from './components/OperatorNav.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import StartScreen from './components/StartScreen.jsx'
import WheelScreen from './components/WheelScreen.jsx'
import { loadAdminSettings, saveAdminSettings, saveDraw, saveLead } from './utils/history.js'

const initialAdminSettings = loadAdminSettings()
const editablePrizeFields = ['id', 'name', 'color', 'active', 'weight']
const defaultSliceCount = clientConfig.defaultSliceCount ?? 8
const defaultResultLayout = clientConfig.resultLayout
const defaultLeadCapture = clientConfig.leadCapture

export default function App() {
  const [screen, setScreen] = useState('start')
  const [lastPrize, setLastPrize] = useState(null)
  const [currentLead, setCurrentLead] = useState(null)
  const [leadGateComplete, setLeadGateComplete] = useState(false)
  const [spinDurationMs, setSpinDurationMs] = useState(initialAdminSettings?.spinDurationMs ?? clientConfig.spinDurationMs)
  const [sliceCount, setSliceCount] = useState(() => normalizeSliceCount(initialAdminSettings?.sliceCount ?? defaultSliceCount))
  const [prizes, setPrizes] = useState(() => mergePrizeSettings(clientConfig.prizes, initialAdminSettings?.prizes))
  const [wheelBackgroundColor, setWheelBackgroundColor] = useState(initialAdminSettings?.wheelBackgroundColor ?? clientConfig.colors.wheelBackground)
  const [spinButtonColor, setSpinButtonColor] = useState(initialAdminSettings?.spinButtonColor ?? clientConfig.colors.spinButton)
  const [resultLayout, setResultLayout] = useState(() => ({ ...defaultResultLayout, ...(initialAdminSettings?.resultLayout ?? legacyResultLayout(initialAdminSettings)) }))
  const [leadCapture, setLeadCapture] = useState(() => ({ ...defaultLeadCapture, ...(initialAdminSettings?.leadCapture ?? {}) }))

  const visiblePrizes = useMemo(() => sanitizePrizes(ensurePrizeCount(prizes).slice(0, sliceCount)), [prizes, sliceCount])

  const appConfig = useMemo(
    () => ({
      ...clientConfig,
      colors: {
        ...clientConfig.colors,
        wheelBackground: wheelBackgroundColor,
        spinButton: spinButtonColor,
      },
      resultLayout,
      leadCapture,
      spinDurationMs,
      sliceCount,
      prizes: visiblePrizes,
      allPrizes: prizes,
    }),
    [leadCapture, prizes, resultLayout, sliceCount, spinButtonColor, spinDurationMs, visiblePrizes, wheelBackgroundColor],
  )

  function persistSettings(nextSettings) {
    const nextSliceCount = normalizeSliceCount(nextSettings.sliceCount ?? sliceCount)
    const nextPrizes = sanitizePrizes(ensurePrizeCount(nextSettings.prizes ?? prizes))
    const nextResultLayout = { ...resultLayout, ...(nextSettings.resultLayout ?? {}) }
    const nextLeadCapture = { ...leadCapture, ...(nextSettings.leadCapture ?? {}) }

    saveAdminSettings({
      spinDurationMs: nextSettings.spinDurationMs ?? spinDurationMs,
      sliceCount: nextSliceCount,
      prizes: nextPrizes.map((prize) => pickPrizeSettings(prize)),
      wheelBackgroundColor: nextSettings.wheelBackgroundColor ?? wheelBackgroundColor,
      spinButtonColor: nextSettings.spinButtonColor ?? spinButtonColor,
      resultLayout: nextResultLayout,
      leadCapture: nextLeadCapture,
    })
  }

  function handlePrizeDrawn(prize) {
    const drawEntry = saveDraw(prize, { sliceCount })
    if (leadCapture.enabled && currentLead) {
      saveLead(currentLead, prize)
    }
    setLastPrize({ ...prize, drawnAt: drawEntry.drawnAt })
    setScreen('result')
  }

  function handleAdminChange(nextSettings) {
    if (nextSettings.spinDurationMs !== undefined) setSpinDurationMs(nextSettings.spinDurationMs)
    if (nextSettings.sliceCount !== undefined) setSliceCount(normalizeSliceCount(nextSettings.sliceCount))
    if (nextSettings.prizes) setPrizes(sanitizePrizes(ensurePrizeCount(nextSettings.prizes)))
    if (nextSettings.wheelBackgroundColor !== undefined) setWheelBackgroundColor(nextSettings.wheelBackgroundColor)
    if (nextSettings.spinButtonColor !== undefined) setSpinButtonColor(nextSettings.spinButtonColor)
    if (nextSettings.resultLayout) setResultLayout((current) => ({ ...current, ...nextSettings.resultLayout }))
    if (nextSettings.leadCapture) setLeadCapture((current) => ({ ...current, ...nextSettings.leadCapture }))

    persistSettings(nextSettings)
  }

  function handleResetPrizes() {
    handleAdminChange({ prizes: clientConfig.prizes })
  }

  function handleStart() {
    setLastPrize(null)
    setCurrentLead(null)
    setLeadGateComplete(!leadCapture.enabled)
    setScreen('wheel')
  }

  function handleLeadSubmit(lead) {
    setCurrentLead(lead)
    setLeadGateComplete(true)
  }

  function handleLeadSkip() {
    setCurrentLead(null)
    setLeadGateComplete(true)
  }

  function handleRestart() {
    setLastPrize(null)
    setCurrentLead(null)
    setLeadGateComplete(!leadCapture.enabled)
    setScreen('wheel')
  }

  function handleTestResult() {
    const testPrize = visiblePrizes.find((prize) => prize.active) ?? visiblePrizes[0] ?? clientConfig.prizes[0]
    setLastPrize(testPrize)
    setScreen('result')
  }

  return (
    <main
      className="app-shell"
      style={{
        '--primary': appConfig.colors.primary,
        '--secondary': appConfig.colors.secondary,
        '--wheel-bg-color': appConfig.colors.wheelBackground,
        '--spin-button-bg': appConfig.colors.spinButton,
        '--spin-button-text': appConfig.colors.spinButtonText,
      }}
    >
      {screen === 'start' && <StartScreen config={appConfig} onStart={handleStart} />}
      {screen === 'wheel' && (
        <WheelScreen
          config={appConfig}
          leadGateComplete={leadGateComplete}
          onLeadSubmit={handleLeadSubmit}
          onLeadSkip={handleLeadSkip}
          onFinished={handlePrizeDrawn}
        />
      )}
      {screen === 'result' && <ResultScreen config={appConfig} prize={lastPrize} onRestart={handleRestart} />}
      {screen === 'admin' && (
        <AdminScreen
          config={appConfig}
          prizes={prizes}
          sliceCount={sliceCount}
          spinDurationMs={spinDurationMs}
          resultLayout={resultLayout}
          leadCapture={leadCapture}
          onChange={handleAdminChange}
          onResetPrizes={handleResetPrizes}
          onTestResult={handleTestResult}
          onClose={() => setScreen('wheel')}
        />
      )}
      {screen !== 'admin' && <OperatorNav onAdmin={() => setScreen('admin')} />}
    </main>
  )
}

function mergePrizeSettings(basePrizes, savedPrizes = []) {
  return sanitizePrizes(
    ensurePrizeCount(
      basePrizes.map((prize) => {
        const savedPrize = savedPrizes.find((item) => item.id === prize.id)
        if (!savedPrize) return prize

        const { image: _legacyImage, imageOverride, ...savedFields } = savedPrize
        return {
          ...prize,
          ...savedFields,
          image: isUploadedPrizeImage(imageOverride) ? imageOverride : prize.image,
        }
      }),
    ),
  )
}

function sanitizePrizes(prizes) {
  const nextPrizes = prizes.map((prize, index) => ({
    ...prize,
    id: prize.id || `prize-${String(index + 1).padStart(2, '0')}`,
    name: typeof prize.name === 'string' && prize.name.trim() ? prize.name : 'Prêmio',
    image: prize.image || null,
    color: prize.color || clientConfig.wheelSliceColors[index % clientConfig.wheelSliceColors.length] || '#ed3a8a',
    weight: Math.max(1, Number(prize.weight) || 1),
    active: Boolean(prize.active),
  }))

  if (!nextPrizes.some((prize) => prize.active)) {
    return nextPrizes.map((prize, index) => (index === 0 ? { ...prize, active: true } : prize))
  }

  return nextPrizes
}

function ensurePrizeCount(prizes) {
  const nextPrizes = [...prizes]
  const targetCount = Math.max(...clientConfig.sliceOptions)

  while (nextPrizes.length < targetCount) {
    const index = nextPrizes.length
    const fallbackPrize = clientConfig.prizes[index]
    nextPrizes.push(
      fallbackPrize ?? {
        id: `prize-${String(index + 1).padStart(2, '0')}`,
        name: `Prêmio ${index + 1}`,
        image: null,
        color: clientConfig.wheelSliceColors[index % clientConfig.wheelSliceColors.length] || '#ed3a8a',
        weight: 1,
        active: true,
      },
    )
  }

  return nextPrizes
}

function normalizeSliceCount(value) {
  const numericValue = Number(value)
  return clientConfig.sliceOptions.includes(numericValue) ? numericValue : defaultSliceCount
}

function pickPrizeSettings(prize) {
  const settings = editablePrizeFields.reduce((result, field) => {
    result[field] = prize[field]
    return result
  }, {})

  settings.imageOverride = isUploadedPrizeImage(prize.image) ? prize.image : null
  return settings
}

function isUploadedPrizeImage(image) {
  return typeof image === 'string' && image.startsWith('data:image/')
}

function legacyResultLayout(settings) {
  if (!settings) return {}
  return {
    ...(settings.resultPrizeTop ? { resultPrizeNameTop: settings.resultPrizeTop } : {}),
    ...(settings.resultPrizeFontSize ? { resultPrizeNameFontSize: settings.resultPrizeFontSize } : {}),
    ...(settings.resultPrizeColor ? { resultPrizeNameColor: settings.resultPrizeColor } : {}),
  }
}
