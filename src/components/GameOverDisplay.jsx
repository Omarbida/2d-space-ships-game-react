import React from 'react'
import { useDispatch } from 'react-redux'
import { homeSean, startGame } from '../Slices/GameSlise'

function GameOverDisplay(props) {
  const dispatch = useDispatch()
  return (
    <div className="model">
      <div className="model-info">
        <h1 className="h1">Game Over</h1>
        <h2 className="h">
          <p>Ships Destroyed:</p>{' '}
          <p className="hammersmithfont wave-info-num">
            {props.shipsDestroyed}
          </p>
        </h2>
        <h2 className="h">
          <p>Score:</p>{' '}
          <p className="hammersmithfont wave-info-num">{props.score}</p>
        </h2>
        <button
          onClick={() => {
            dispatch(startGame())
          }}
        >
          Play Again
        </button>
        <button
          onClick={() => {
            dispatch(homeSean())
          }}
        >
          Home
        </button>
      </div>
    </div>
  )
}

export default GameOverDisplay
