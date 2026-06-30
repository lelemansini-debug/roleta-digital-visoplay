export default function PrizeWheel({ prizes, rotation, durationMs }) {
  const sliceAngle = 360 / prizes.length
  const gradient = prizes
    .map((prize, index) => {
      const start = index * sliceAngle
      const end = (index + 1) * sliceAngle
      return `${prize.active ? prize.color : '#6b7280'} ${start}deg ${end}deg`
    })
    .join(', ')

  return (
    <div
      className="prize-wheel"
      style={{
        background: `conic-gradient(from -90deg, ${gradient})`,
        transform: `rotate(${rotation}deg)`,
        transitionDuration: `${durationMs}ms`,
      }}
    >
      {prizes.map((prize, index) => (
        <div className="wheel-label" key={prize.id} style={{ transform: `rotate(${index * sliceAngle + sliceAngle / 2}deg)` }}>
          <span style={{ transform: `rotate(${90}deg)` }}>
            {prize.image && <img src={prize.image} alt="" />}
            <b>{prize.name}</b>
          </span>
        </div>
      ))}
      <div className="wheel-center">Viso Play</div>
    </div>
  )
}
