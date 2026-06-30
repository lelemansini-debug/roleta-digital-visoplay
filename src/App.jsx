import { useMemo, useState } from 'react'
import { clientConfig } from './config/clientConfig.js'
import AdminScreen from './components/AdminScreen.jsx'
import OperatorNav from './components/OperatorNav.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import StartScreen from './components/StartScreen.jsx'
import WheelScreen from './components/WheelScreen.jsx'
import { loadAdminSettings, saveAdminSettings, saveDraw } from './utils/history.js'

const initialAdminSettings = loadAdminSettings()

export default function App() {
  const [screen, setScreen] = useState('start')
  const [lastPrize, setLastPrize] = useState(null)
  const [spinDurationMs, setSpinDurationMs] = useState(initialAdminSettings?.spinDurationMs ?? clientConfig.spinDurationMs)
  const [prizes, setPrizes] = useState(() => mergePrizeSettings(clientConfig.prizes, initialAdminSettings?.prizes))

  const appConfig = useMemo(
    () => ({
      ...clientConfig,
      spinDurationMs,
      prizes,
    }),
    [prizes, spinDurationMs],
  )

  function persistSettings(nextSettings) {
    saveAdminSettings({
      spinDurationMs: nextSettings.spinDurationMs ?? spinDurationMs,
      prizes: (nextSettings.prizes ?? prizes).map(({ id, active, weight }) => ({ id, active, weight })),
    })
  }

  function handlePrizeDrawn(prize) {
    setLastPrize(prize)
    saveDraw(prize)
    setScreen('result')
  }

  function handleAdminChange(nextSettings) {
    if (nextSettings.spinDurationMs !== undefined) {
      setSpinDurationMs(nextSettings.spinDurationMs)
    }

    if (nextSettings.prizes) {
      setPrizes(nextSettings.prizes)
    }

    persistSettings(nextSettings)
  }

  return (
    <main className="app-shell" style={{ '--primary': appConfig.colors.primary, '--secondary': appConfig.colors.secondary }}>
      {screen === 'start' && <StartScreen config={appConfig} onStart={() => setScreen('wheel')} />}
      {screen === 'wheel' && <WheelScreen config={appConfig} onFinished={handlePrizeDrawn} />}
      {screen === 'result' && <ResultScreen config={appConfig} prize={lastPrize} onRestart={() => setScreen('wheel')} />}
      {screen === 'admin' && (
        <AdminScreen config={appConfig} prizes={prizes} spinDurationMs={spinDurationMs} onChange={handleAdminChange} onClose={() => setScreen('wheel')} />
      )}
      {screen !== 'admin' && <OperatorNav onAdmin={() => setScreen('admin')} />}
    </main>
  )
}

function mergePrizeSettings(basePrizes, savedPrizes = []) {
  return basePrizes.map((prize) => {
    const savedPrize = savedPrizes.find((item) => item.id === prize.id)
    return savedPrize ? { ...prize, active: savedPrize.active, weight: savedPrize.weight } : prize
  })
}
