import React from 'react'
import { Ship } from './PlayerShip'

const EnemyShip = () => {
  return (
    <Ship x={100} y={600}>
      <img className="enemy-ship-img" src="enemy-ship.png" />
      <img className="ship-thruster-img enemy" src="Untitled.png" />
    </Ship>
  )
}

export default EnemyShip
