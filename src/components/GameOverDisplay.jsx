import React from 'react'
import { useDispatch } from 'react-redux'
import { homeSean, startGame } from '../Slices/GameSlise'
import { Header } from './ShopDisplay'

function GameOverDisplay(props) {
  const dispatch = useDispatch()
  return (
    <div className="model">
      <div className="model-info">
        <Header fnZ={30}>Game Over</Header>
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
          className="normal-btn"
          onClick={() => {
            dispatch(startGame())
          }}
        >
          Play Again
        </button>
        <button
          className="normal-btn"
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
