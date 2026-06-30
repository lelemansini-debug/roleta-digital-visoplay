import { useState } from 'react'
import PrizeWheel from './PrizeWheel.jsx'
import { getActivePrizes, getPrizeRotation, pickWeightedPrize } from '../utils/wheel.js'

export default function WheelScreen({ config, onFinished }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const activePrizes = getActivePrizes(config.prizes)

  function handleSpin() {
    if (isSpinning || activePrizes.length === 0) return

    const selectedPrize = pickWeightedPrize(config.prizes)
    if (!selectedPrize) return

    const targetRotation = rotation + getPrizeRotation(config.prizes, selectedPrize.id)
    setIsSpinning(true)
    setRotation(targetRotation)

    window.setTimeout(() => {
      setIsSpinning(false)
      onFinished(selectedPrize)
    }, config.spinDurationMs)
  }

  return (
    <section className="wheel-screen" style={{ backgroundImage: `url(${config.assets.wheelBackground})` }}>
      <header className="wheel-header">
        <img src={config.assets.logo} alt={config.clientName} />
      </header>
      <div className="wheel-stage">
        <div className="pointer" />
        <PrizeWheel prizes={config.prizes} rotation={rotation} durationMs={config.spinDurationMs} />
      </div>
      <button className="spin-button" type="button" disabled={isSpinning || activePrizes.length === 0} onClick={handleSpin}>
        {config.texts.spinButton}
      </button>
    </section>
  )
}
