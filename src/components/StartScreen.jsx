export default function StartScreen({ config, onStart }) {
  return (
    <section className="art-screen">
      <img className="screen-art" src={config.assets.startArt} alt="" />
      <button className="invisible-action start-hit-area" type="button" aria-label={config.texts.startButtonLabel} onClick={onStart} />
    </section>
  )
}
