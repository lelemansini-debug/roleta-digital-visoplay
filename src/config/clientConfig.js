import startArt from '../assets/clients/demo/start.jpg'
import resultArt from '../assets/clients/demo/result.png'
import resultScreenArt from '../assets/clients/demo/result-screen.jpg'
import wheelScreenArt from '../assets/clients/demo/wheel-screen.jpg'
import logo from '../assets/clients/demo/logo.png'

const prizeImageModules = import.meta.glob(
  [
    '../assets/clients/demo/prizes/prize-*.png',
    '../assets/clients/demo/prizes/prize-*.jpg',
    '../assets/clients/demo/prizes/prize-*.jpeg',
    '../assets/clients/demo/prizes/prize-*.webp',
  ],
  { eager: true, import: 'default' },
)

const prizeImages = Object.entries(prizeImageModules).reduce((images, [path, image]) => {
  const match = path.match(/\/prize-(\d+)\.(?:png|jpe?g|webp)$/i)
  if (!match) return images

  const prizeId = `prize-${String(Number(match[1])).padStart(2, '0')}`
  images[prizeId] ??= image
  return images
}, {})

export const clientConfig = {
  clientName: 'Demo Viso Play',
  colors: {
    primary: '#12b981',
    secondary: '#f7c948',
    accent: '#ef4444',
    background: '#07111f',
    surface: '#101827',
    text: '#ffffff',
    wheelBackground: '#e9e6df',
    spinButton: '#1d3f69',
    spinButtonText: '#ffffff',
  },
  assets: {
    logo,
    startArt,
    resultArt,
    resultScreenArt,
    wheelScreenArt,
  },
  texts: {
    startButtonLabel: 'Iniciar roleta',
    wheelTitle: 'Roleta de Prêmios',
    spinButton: 'GIRAR',
    resultTitle: 'Prêmio sorteado',
    playAgain: 'Jogar novamente',
    adminTitle: 'Admin',
    exportCsv: 'Exportar CSV',
    clearHistory: 'Limpar historico',
  },
  wheelLayout: {
    wheelTop: '30%',
    wheelLeft: '14.25%',
    wheelSize: '71.5%',
    spinButtonTop: '72.1%',
    spinButtonLeft: '30%',
    spinButtonWidth: '40%',
    spinButtonHeight: '6.2%',
  },
  sliceOptions: [6, 8, 10, 12],
  defaultSliceCount: 8,
  prizeImages,
  resultLayout: {
    resultBackgroundImage: resultScreenArt,
    resultPrizeImageTop: '23%',
    resultPrizeImageLeft: '25%',
    resultPrizeImageWidth: '50%',
    resultPrizeImageHeight: '28%',
    resultPrizeNameTop: '56%',
    resultPrizeNameLeft: '12%',
    resultPrizeNameWidth: '76%',
    resultPrizeNameFontSize: 68,
    resultPrizeNameColor: '#1d3f69',
    resultPrizeNameAlign: 'center',
    replayButtonTop: '65.4%',
    replayButtonLeft: '14%',
    replayButtonWidth: '72%',
    replayButtonHeight: '10.6%',
  },
  leadCapture: {
    enabled: false,
    requireName: true,
    requireWhatsapp: true,
    showEmail: true,
    allowSkip: true,
    buttonText: 'Liberar giro',
  },
  spinDurationMs: 5200,
  soundsEnabled: false,
  wheelSliceColors: ['#4cc0a1', '#3f94d8', '#f8b516', '#ec3c88', '#4cc0a1', '#3f94d8', '#f8b516', '#ec3c88', '#f59f00', '#8b5cf6'],
  prizes: [
    { id: 'prize-01', name: 'Brinde Especial', color: '#4cc0a1', icon: '🎁', image: prizeImages['prize-01'] ?? null, weight: 3, active: true },
    { id: 'prize-02', name: 'Copo Personalizado', color: '#3f94d8', icon: '☕', image: prizeImages['prize-02'] ?? null, weight: 2, active: true },
    { id: 'prize-03', name: 'Desconto 10%', color: '#f8b516', icon: '%', image: prizeImages['prize-03'] ?? null, weight: 4, active: true },
    { id: 'prize-04', name: 'Tente Novamente', color: '#ec3c88', icon: '★', image: prizeImages['prize-04'] ?? null, weight: 6, active: true },
    { id: 'prize-05', name: 'Chaveiro', color: '#4cc0a1', icon: '◆', image: prizeImages['prize-05'] ?? null, weight: 2, active: true },
    { id: 'prize-06', name: 'Vale Surpresa', color: '#3f94d8', icon: '%', image: prizeImages['prize-06'] ?? null, weight: 1, active: true },
    { id: 'prize-07', name: 'Adesivo', color: '#f8b516', icon: '▣', image: prizeImages['prize-07'] ?? null, weight: 3, active: true },
    { id: 'prize-08', name: 'Desconto 20%', color: '#ec3c88', icon: '✎', image: prizeImages['prize-08'] ?? null, weight: 1, active: true },
    { id: 'prize-09', name: 'Sacola Personalizada', color: '#f59f00', icon: '▣', image: prizeImages['prize-09'] ?? null, weight: 2, active: true },
    { id: 'prize-10', name: 'Caneta Personalizada', color: '#8b5cf6', icon: '✎', image: prizeImages['prize-10'] ?? null, weight: 2, active: true },
    { id: 'prize-11', name: 'Prêmio 11', color: '#4cc0a1', icon: '★', image: prizeImages['prize-11'] ?? null, weight: 1, active: true },
    { id: 'prize-12', name: 'Prêmio 12', color: '#3f94d8', icon: '★', image: prizeImages['prize-12'] ?? null, weight: 1, active: true },
  ],
}
