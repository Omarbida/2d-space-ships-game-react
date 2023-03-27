function WaveCleardInfo(props) {
  return (
    <div className="wave-cleared-info-model">
      <div className="wave-cleared-info-content">
        <h1 className="h">
          Wave <span>{props.wave}</span> Cleared
        </h1>
        <h2 className="h">Ships Destroyed: {props.shipsDestroyed}</h2>
        <h2 className="h">Reward: {props.score}</h2>
        <h2 className="h">Next Wave in : {props.time}</h2>
      </div>
    </div>
  )
}
export default WaveCleardInfo
