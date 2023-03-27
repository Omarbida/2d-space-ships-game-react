import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { deleteEnemys } from '../Slices/GameSlise'
import { Ship } from './PlayerShip'

const EnemyShip = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (props.y < -100) {
      dispatch(deleteEnemys(props.index))
    }
  }, [props.y])
  return (
    <Ship x={props.x} y={props.y}>
      <img className="enemy-ship-img" src="enemy-ship.png" />
      <img className="ship-thruster-img enemy" src="Untitled.png" />
    </Ship>
  )
}

export default EnemyShip
