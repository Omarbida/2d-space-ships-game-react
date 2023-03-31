import styled from 'styled-components'

export const Projectile = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 20px;
  width: 8px;
  position: absolute;
  z-index: 99;
`
const PlayerProjImg = styled.img`
  height: 20px;
  width: 8px;
  position: absolute;
  left: 0px;
  z-index: 98;
  filter: contrast(0) brightness(1.5) drop-shadow(0 0 8px rgba(0, 162, 255, 1));
  transform: scaleY(1.6);
`
function PlayerProjectile(props) {
  return (
    <Projectile x={props.x} y={props.y}>
      <PlayerProjImg className="projectile-img" src="projectile.png" alt="" />
    </Projectile>
  )
}
export default PlayerProjectile
