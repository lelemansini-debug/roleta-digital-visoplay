export function getActivePrizes(prizes) {
  return prizes.filter((prize) => prize.active && Number(prize.weight) > 0)
}

export function pickWeightedPrize(prizes) {
  const activePrizes = getActivePrizes(prizes)
  const totalWeight = activePrizes.reduce((sum, prize) => sum + Number(prize.weight), 0)
  let cursor = Math.random() * totalWeight

  for (const prize of activePrizes) {
    cursor -= Number(prize.weight)
    if (cursor <= 0) {
      return prize
    }
  }

  return activePrizes.at(-1) ?? null
}

export function getPrizeRotation(prizes, prizeId, currentRotation = 0) {
  const index = prizes.findIndex((prize) => prize.id === prizeId)
  if (index < 0 || prizes.length === 0) return currentRotation

  const sliceAngle = 360 / prizes.length
  const prizeCenter = index * sliceAngle + sliceAngle / 2
  const pointerAngle = 0
  const baseTarget = pointerAngle - prizeCenter
  const normalizedCurrent = ((currentRotation % 360) + 360) % 360
  const normalizedTarget = ((baseTarget % 360) + 360) % 360
  const delta = (normalizedTarget - normalizedCurrent + 360) % 360

  return currentRotation + 360 * 7 + delta
}
