import { Ship } from './PlayerShip'

const EnemyShip = (props) => {
  return (
    <Ship x={props.x} y={props.y}>
      <img className="enemy-ship-img" src="enemy-ship.png" />
      <img className="ship-thruster-img enemy" src="Untitled.png" />
    </Ship>
  )
}

export default EnemyShip
