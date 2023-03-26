import styled from 'styled-components'

export const Ship = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 70px;
  width: 50px;
  position: absolute;
  z-index: 99;
  border-radius: 50%;
`

function PlayerShip(props) {
  return (
    <Ship x={props.x} y={props.y}>
      <img className="ship-img" src="ship.png" />
      <img className="ship-thruster-img" src="thrusters.png" />
    </Ship>
  )
}
export default PlayerShip
