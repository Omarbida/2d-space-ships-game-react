import styled from 'styled-components'

const MisileDive = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
    transform: `rotate(${props.rotation}rad)`,
  },
}))`
  height: 35px;
  width: 15px;
  position: absolute;
  z-index: 94;
`
const Img = styled.img`
  height: 100%;
  width: 100%;
  filter: drop-shadow(0px 0px 10px #a424243a) contrast(1.3) brightness(1.3)
    saturate(0.5);
`
const MissileSmoke = styled.img`
  height: 35px;
  width: 15px;
  position: absolute;
  z-index: 98;
  bottom: -27px;
  left: 0px;
  animation: thrusterAnim 150ms infinite linear;
  filter: contrast(0.8) brightness(1.5) saturate(0.5)
    drop-shadow(0 0 10px rgba(216, 125, 20, 1));
`

function Missile(props) {
  return (
    <MisileDive x={props.x} y={props.y} rotation={props.rotation}>
      <Img className="missile-img" src="missile.png" alt="" />
      <MissileSmoke
        className="missile-thruster"
        src="missile-thruster.png"
        rotation={props.rotation}
      />
    </MisileDive>
  )
}
export default Missile
