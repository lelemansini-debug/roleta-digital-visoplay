import startArt from '../assets/clients/demo/start.png'
import resultArt from '../assets/clients/demo/result.png'
import wheelBackground from '../assets/clients/demo/background.png'
import logo from '../assets/clients/demo/logo.png'
import prize01 from '../assets/clients/demo/prizes/prize-01.png'
import prize02 from '../assets/clients/demo/prizes/prize-02.png'
import prize03 from '../assets/clients/demo/prizes/prize-03.png'

export const clientConfig = {
  clientName: 'Demo Viso Play',
  colors: {
    primary: '#12b981',
    secondary: '#f7c948',
    accent: '#ef4444',
    background: '#07111f',
    surface: '#101827',
    text: '#ffffff',
  },
  assets: {
    logo,
    startArt,
    resultArt,
    wheelBackground,
  },
  texts: {
    startButtonLabel: 'Iniciar roleta',
    spinButton: 'GIRAR',
    resultTitle: 'Premio sorteado',
    playAgain: 'Jogar novamente',
    adminTitle: 'Admin',
    exportCsv: 'Exportar CSV',
    clearHistory: 'Limpar historico',
  },
  spinDurationMs: 4500,
  soundsEnabled: false,
  wheelSliceColors: ['#13b981', '#f59f00', '#ef4444', '#3b82f6', '#a855f7', '#14b8a6', '#f97316', '#ec4899'],
  prizes: [
    { id: 'prize-01', name: 'Brinde Especial', color: '#13b981', image: prize01, weight: 3, active: true },
    { id: 'prize-02', name: 'Copo Personalizado', color: '#f59f00', image: prize02, weight: 2, active: true },
    { id: 'prize-03', name: 'Desconto 10%', color: '#ef4444', image: prize03, weight: 4, active: true },
    { id: 'prize-04', name: 'Tente Novamente', color: '#3b82f6', image: null, weight: 6, active: true },
    { id: 'prize-05', name: 'Chaveiro', color: '#a855f7', image: null, weight: 2, active: true },
    { id: 'prize-06', name: 'Vale Surpresa', color: '#14b8a6', image: null, weight: 1, active: true },
    { id: 'prize-07', name: 'Adesivo', color: '#f97316', image: null, weight: 3, active: true },
    { id: 'prize-08', name: 'Desconto 20%', color: '#ec4899', image: null, weight: 1, active: true },
  ],
}
