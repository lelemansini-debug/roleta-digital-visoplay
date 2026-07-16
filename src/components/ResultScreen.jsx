export default function ResultScreen({ config, prize, onRestart }) {
  const resultLayout = config.resultLayout
  const backgroundImage = resultLayout.resultBackgroundImage ?? config.assets.resultScreenArt ?? config.assets.resultArt

  return (
    <section
      className="art-screen result-screen result-art-screen"
      style={{
        '--result-prize-image-top': resultLayout.resultPrizeImageTop,
        '--result-prize-image-left': resultLayout.resultPrizeImageLeft,
        '--result-prize-image-width': resultLayout.resultPrizeImageWidth,
        '--result-prize-image-height': resultLayout.resultPrizeImageHeight,
        '--result-prize-name-top': resultLayout.resultPrizeNameTop,
        '--result-prize-name-left': resultLayout.resultPrizeNameLeft,
        '--result-prize-name-width': resultLayout.resultPrizeNameWidth,
        '--result-prize-name-font-size': `${resultLayout.resultPrizeNameFontSize}px`,
        '--result-prize-name-color': resultLayout.resultPrizeNameColor,
        '--result-prize-name-align': resultLayout.resultPrizeNameAlign,
        '--result-hit-top': resultLayout.replayButtonTop,
        '--result-hit-left': resultLayout.replayButtonLeft,
        '--result-hit-width': resultLayout.replayButtonWidth,
        '--result-hit-height': resultLayout.replayButtonHeight,
      }}
    >
      <img className="screen-art" src={backgroundImage} alt="" />

      {prize?.image && <img className="result-dynamic-prize-image" src={prize.image} alt={prize.name} />}

      <h1 className="result-dynamic-prize-name">{prize?.name ?? config.texts.resultTitle}</h1>

      <button className="invisible-action result-hit-area" type="button" aria-label={config.texts.playAgain} onClick={onRestart} />
    </section>
  )
}
