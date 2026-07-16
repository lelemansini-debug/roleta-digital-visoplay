const VIEWBOX_SIZE = 640
const CENTER = VIEWBOX_SIZE / 2
const SLICE_RADIUS = 260
const RIM_RADIUS = 302
const INNER_RING_RADIUS = 266
const CENTER_RADIUS = 34
const LABEL_RADIUS = 176

export default function PrizeWheel({ prizes, rotation, durationMs }) {
  const sliceAngle = 360 / prizes.length
  const labelLayout = getLabelLayout(prizes.length)

  return (
    <div className="simple-prize-wheel-shell" style={{ '--slice-count': prizes.length }}>
      <div className="simple-prize-pointer" aria-hidden="true" />

      <svg
        className="simple-prize-wheel-svg"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        role="img"
        aria-label="Roleta de prêmios"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${durationMs}ms` }}
      >
        <defs>
          <filter id="simpleLabelShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        <circle className="simple-wheel-rim" cx={CENTER} cy={CENTER} r={RIM_RADIUS} />
        <circle className="simple-wheel-inner-line" cx={CENTER} cy={CENTER} r={INNER_RING_RADIUS} />

        {prizes.map((prize, index) => {
          const startAngle = -90 + index * sliceAngle
          const endAngle = startAngle + sliceAngle
          const midAngle = startAngle + sliceAngle / 2
          const labelPoint = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, midAngle)
          const lines = splitPrizeName(prize.name, labelLayout.maxChars)
          const fontSize = getFontSize(lines, labelLayout.fontSize)
          const lineHeight = Math.round(fontSize * 1.12)

          return (
            <g key={prize.id} className={prize.active ? '' : 'is-inactive'}>
              <path className="simple-wheel-slice" d={describeSlice(CENTER, CENTER, SLICE_RADIUS, startAngle, endAngle)} fill={prize.active ? prize.color : '#9aa3ad'} />
              <g transform={`rotate(${midAngle} ${labelPoint.x} ${labelPoint.y})`} filter="url(#simpleLabelShadow)">
                <text
                  className="simple-wheel-label"
                  x={labelPoint.x}
                  y={labelPoint.y - ((lines.length - 1) * lineHeight) / 2}
                  textAnchor="middle"
                  style={{ fontSize }}
                >
                  {lines.map((line) => (
                    <tspan key={line} x={labelPoint.x} dy={line === lines[0] ? 0 : lineHeight}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            </g>
          )
        })}

        <g className="simple-wheel-dividers">
          {prizes.map((_, index) => {
            const angle = -90 + index * sliceAngle
            const outer = polarToCartesian(CENTER, CENTER, INNER_RING_RADIUS, angle)
            return <line key={index} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} />
          })}
        </g>

        <circle className="simple-wheel-center" cx={CENTER} cy={CENTER} r={CENTER_RADIUS} />
      </svg>
    </div>
  )
}

function getLabelLayout(sliceCount) {
  if (sliceCount <= 6) return { maxChars: 12, fontSize: 22 }
  if (sliceCount <= 8) return { maxChars: 10, fontSize: 19 }
  return { maxChars: 8, fontSize: 16 }
}

function getFontSize(lines, baseSize) {
  const longestLine = Math.max(...lines.map((line) => line.length))
  const totalChars = lines.join('').length
  let size = baseSize

  if (longestLine > 12) size -= 3
  if (totalChars > 22) size -= 2
  if (lines.length >= 3) size -= 2

  return Math.max(12, size)
}

function splitPrizeName(name, maxChars) {
  const words = (name || 'Prêmio').toUpperCase().split(' ').filter(Boolean)
  if (words.length === 0) return ['PRÊMIO']

  const lines = []
  words.forEach((word) => {
    const currentLine = lines.at(-1)
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (!currentLine) {
      lines.push(word)
      return
    }

    if (nextLine.length <= maxChars) {
      lines[lines.length - 1] = nextLine
      return
    }

    if (lines.length < 3) {
      lines.push(word)
      return
    }

    lines[2] = `${lines[2]} ${word}`.trim()
  })

  return lines.slice(0, 3)
}

function describeSlice(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ')
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  }
}
