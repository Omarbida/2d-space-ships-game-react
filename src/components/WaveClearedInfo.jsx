function WaveCleardInfo(props) {
  return (
    <div className="model">
      <div className="model-info">
        <h1 className="h1">Wave Cleared</h1>
        <h2 className="h">
          <p>Ships Destroyed {props.shipsDestroyed} :</p>{' '}
          <p className="hammersmithfont wave-info-num">{props.score}</p>
        </h2>
        <h2 className="h">
          {' '}
          <p>
            Wave <span className="hammersmithfont ">{props.wave}</span> Cleared
            :{' '}
          </p>{' '}
          <p className="hammersmithfont wave-info-num">
            {props.waveClearedScore}
          </p>
        </h2>
        <h2 className="h">
          <p>Total points:</p>{' '}
          <p className="hammersmithfont wave-info-num">{props.total}</p>
        </h2>
        <h2 className="h1">Next Wave in : {props.time}</h2>
      </div>
    </div>
  )
}
export default WaveCleardInfo
