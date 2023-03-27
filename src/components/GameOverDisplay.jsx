import React from 'react'
import { useDispatch } from 'react-redux'
import { homeSean, startGame } from '../Slices/GameSlise'

function GameOverDisplay(props) {
  const dispatch = useDispatch()
  return (
    <div className="model">
      <div className="model-info">
        <h1 className="h">Game Over</h1>
        <h2 className="h">Ships Destroyed: {props.shipsDestroyed}</h2>
        <h2 className="h">Score: {props.score}</h2>
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
