import { Settings } from 'lucide-react'

export default function OperatorNav({ onAdmin }) {
  return (
    <button className="operator-nav" type="button" aria-label="Abrir admin" onClick={onAdmin}>
      <Settings size={22} strokeWidth={2.4} />
    </button>
  )
}
