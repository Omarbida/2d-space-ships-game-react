import styled from 'styled-components'

export const Ship = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 60px;
  width: 40px;
  position: absolute;
  z-index: 97;
  border-radius: 50%;
`
const ShipImg = styled.img`
  height: 100%;
  width: 100%;
  filter: drop-shadow(0px 0px 10px #a424243a) contrast(1.3) brightness(1.3)
    saturate(0.5);
`
const ThrusterImg = styled.img`
  position: absolute;
  height: 30px;
  width: 21px;
  top: 65px;
  left: 10.5px;
  animation: thrusterAnim1 170ms infinite ease-in-out;
  filter: contrast(0.5) brightness(1.5) saturate(1.5)
    drop-shadow(0 0 10px #2da4b6);
  z-index: 95;
`
const MissileLancher = styled.img`
  position: absolute;
  height: 100%;
  width: 80px;
  top: -10px;
  left: -20px;
  transform: scale(1.3);
  /* filter: contrast(0.5) brightness(1.5) saturate(1.5); */
`

function PlayerShip(props) {
  return (
    <Ship x={props.x} y={props.y}>
      {/*<ShipImg src="ship.png" />*/}
      <ShipImg src={'shipwithCanon.png'} />
      <ThrusterImg src="thrusters.png" />
      {props.missileLancher && <MissileLancher src="missileLancher.png" />}
    </Ship>
  )
}
export default PlayerShip
