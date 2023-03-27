import { Ship } from './PlayerShip'

const EnemyShip = (props) => {
  return (
    <Ship className="enemy-ship" x={props.x} y={props.y}>
      <img className="enemy-ship-img" src={`ships/ship${props.ship}.png`} />
      <img
        className="ship-thruster-img enemy"
        src={`ships/thruster${props.ship}.png`}
      />
    </Ship>
  )
}

export default EnemyShip
