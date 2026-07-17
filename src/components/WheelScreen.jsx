import { useState } from 'react'
import PrizeWheel from './PrizeWheel.jsx'
import { getActivePrizes, getPrizeRotation, pickWeightedPrize } from '../utils/wheel.js'

export default function WheelScreen({ config, leadGateComplete, onLeadSubmit, onLeadSkip, onFinished }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const activePrizes = getActivePrizes(config.prizes)
  const layout = config.wheelLayout
  const showLeadForm = config.leadCapture.enabled && !leadGateComplete

  function handleSpin() {
    if (showLeadForm || isSpinning || activePrizes.length === 0) return

    const selectedPrize = pickWeightedPrize(config.prizes)
    if (!selectedPrize) return

    const targetRotation = getPrizeRotation(config.prizes, selectedPrize.id, rotation)
    setIsSpinning(true)
    setRotation(targetRotation)

    window.setTimeout(() => {
      setIsSpinning(false)
      window.setTimeout(() => onFinished(selectedPrize), 1000)
    }, config.spinDurationMs)
  }

  return (
    <section
      className="wheel-screen wheel-art-screen"
      style={{
        '--wheel-top': layout.wheelTop,
        '--wheel-left': layout.wheelLeft,
        '--wheel-size': layout.wheelSize,
        '--spin-hit-top': layout.spinButtonTop,
        '--spin-hit-left': layout.spinButtonLeft,
        '--spin-hit-width': layout.spinButtonWidth,
        '--spin-hit-height': layout.spinButtonHeight,
      }}
    >
      <img className="wheel-screen-art" src={config.assets.wheelScreenArt} alt="" />

      <div className="wheel-art-wheel-slot">
        <div className="wheel-platform">
          <PrizeWheel prizes={config.prizes} rotation={rotation} durationMs={config.spinDurationMs} />
        </div>
      </div>

      <button
        className="invisible-action wheel-spin-hit-area"
        type="button"
        disabled={showLeadForm || isSpinning || activePrizes.length === 0}
        aria-label={config.texts.spinButton}
        onClick={handleSpin}
      />

      {showLeadForm && <LeadCaptureModal settings={config.leadCapture} onSubmit={onLeadSubmit} onSkip={onLeadSkip} />}
    </section>
  )
}

function LeadCaptureModal({ settings, onSubmit, onSkip }) {
  const [lead, setLead] = useState({ name: '', whatsapp: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const needsName = settings.requireName && !lead.name.trim()
  const needsWhatsapp = settings.requireWhatsapp && !lead.whatsapp.trim()
  const hasError = submitted && (needsName || needsWhatsapp)

  function updateLead(field, value) {
    setLead((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (needsName || needsWhatsapp) return
    onSubmit({
      name: lead.name.trim(),
      whatsapp: lead.whatsapp.trim(),
      email: lead.email.trim(),
    })
  }

  return (
    <div className="lead-modal-backdrop">
      <form className="lead-modal" onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <label className="admin-text-field">
          <span>Nome{settings.requireName ? ' *' : ''}</span>
          <input type="text" value={lead.name} onChange={(event) => updateLead('name', event.target.value)} />
        </label>
        <label className="admin-text-field">
          <span>WhatsApp{settings.requireWhatsapp ? ' *' : ''}</span>
          <input type="tel" value={lead.whatsapp} onChange={(event) => updateLead('whatsapp', event.target.value)} />
        </label>
        {settings.showEmail && (
          <label className="admin-text-field">
            <span>E-mail</span>
            <input type="email" value={lead.email} onChange={(event) => updateLead('email', event.target.value)} />
          </label>
        )}
        {hasError && <p className="lead-error">Preencha os campos obrigatórios para liberar o giro.</p>}
        <button className="secondary-button" type="submit">{settings.buttonText || 'Liberar giro'}</button>
        {settings.allowSkip && <button className="lead-skip-button" type="button" onClick={onSkip}>Pular cadastro</button>}
      </form>
    </div>
  )
}
