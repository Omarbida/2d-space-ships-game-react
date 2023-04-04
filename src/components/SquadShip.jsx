import styled from 'styled-components'

const Ship = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 50px;
  width: 50px;
  position: absolute;
  z-index: 97;
`
const SquadShipImg = styled.img`
  height: 100%;
  width: 100%;
`
const ThrusterImg = styled.img`
  position: absolute;
  height: 30px;
  width: 21px;
  top: 50px;
  left: 15px;
  animation: thrusterAnim1 170ms infinite ease-in-out;
  filter: contrast(0.5) brightness(1.5) saturate(1.5)
    drop-shadow(0 0 10px #2da4b6);
  z-index: 95;
`
const SquadShipHealth = styled.div`
  height: 5px;
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 99;
  width: 100%;
  border-radius: 5px;
  background: #00ffff30;
  box-shadow: 0 0 5px 1px aqua;
`
const SquadShipHealthFill = styled.div.attrs((props) => ({
  style: {
    width: props.width + '%',
  },
}))`
  height: 100%;
  border-radius: 5px;
  background: aqua;
`
const SquadShip = (props) => {
  return (
    <Ship x={props.x} y={props.y}>
      <SquadShipImg src={props.ship} />
      <ThrusterImg src="thrusters.png" />
      {props.health < 100 && (
        <SquadShipHealth>
          <SquadShipHealthFill width={props.health} />
        </SquadShipHealth>
      )}
    </Ship>
  )
}
export default SquadShip
