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
const EnemyHelthBarFill = styled.div.attrs((props) => ({
  style: {
    width: props.width + '%',
  },
}))`
  height: 100%;
  border-radius: 5px;
  background: #15c724;
`
const EnemyShipImg = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  scale: 120%;
  z-index: 99;
  filter: drop-shadow(0px 0px 10px #a424243a) contrast(1.3) brightness(1.3)
    saturate(0.5);
`
const EnemyShipThruster = styled.img`
  position: absolute;
  height: 70px;
  width: 40px;
  rotate: 180deg;
  top: -10px;
  left: 0;
  z-index: 97;
  animation: thrusterAnim1 180ms infinite linear;
  filter: contrast(0.5) brightness(1.5) saturate(1.5)
    drop-shadow(0 0 10px rgba(216, 125, 20, 1));
`

const EnemyShip = (props) => {
  return (
    <Ship className="enemy-ship" x={props.x} y={props.y}>
      <EnemyShipImg src={`ships/ship${props.ship}.png`} />
      <EnemyShipThruster src={`ships/thruster${props.ship}.png`} />

      {props.health < 100 && (
        <EnemyHelthBar>
          <EnemyHelthBarFill width={props.health} />
        </EnemyHelthBar>
      )}
    </Ship>
  )
}

export default EnemyShip
