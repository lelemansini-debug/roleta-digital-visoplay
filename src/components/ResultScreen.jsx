export default function ResultScreen({ config, prize, onRestart }) {
  return (
    <section className="art-screen result-screen">
      <img className="screen-art" src={config.assets.resultArt} alt="" />
      <div className="result-prize">
        {prize?.image && <img src={prize.image} alt="" />}
        <span>{prize?.name ?? config.texts.resultTitle}</span>
      </div>
      <button className="invisible-action result-hit-area" type="button" aria-label={config.texts.playAgain} onClick={onRestart} />
    </section>
  )
}
