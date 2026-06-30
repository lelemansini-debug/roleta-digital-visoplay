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

export function getPrizeRotation(prizes, prizeId) {
  const index = prizes.findIndex((prize) => prize.id === prizeId)
  const sliceAngle = 360 / prizes.length
  const prizeCenter = index * sliceAngle + sliceAngle / 2
  const pointerAngle = 270
  return 360 * 6 + pointerAngle - prizeCenter
}
