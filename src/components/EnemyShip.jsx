import styled from 'styled-components'
import { Ship } from './PlayerShip'

const EnemyHelthBar = styled.div`
  height: 5px;
  position: absolute;
  bottom: 110%;
  left: 0;
  z-index: 99;
  width: 100%;
  border-radius: 5px;
  background: #15c72441;
  box-shadow: 0 0 5px 1px #15c724;
`

const EnemyShip = (props) => {
  return (
    <Ship className="enemy-ship" x={props.x} y={props.y}>
      <img className="enemy-ship-img" src={`ships/ship${props.ship}.png`} />
      <img
        className="ship-thruster-img enemy"
        src={`ships/thruster${props.ship}.png`}
      />

      {props.health < 100 && (
        <EnemyHelthBar>
          <div
            style={{
              height: '100%',
              width: `${props.health}%`,
              backgroundColor: '#15c724',
              borderRadius: '5px',
            }}
          ></div>
        </EnemyHelthBar>
      )}
    </Ship>
  )
}

export default EnemyShip
