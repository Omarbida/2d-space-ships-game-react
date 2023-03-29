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

function PlayerProjectile(props) {
  return (
    <Projectile x={props.x} y={props.y}>
      <img className="projectile-img" src="projectile.png" alt="" />
    </Projectile>
  )
}
export default PlayerProjectile
