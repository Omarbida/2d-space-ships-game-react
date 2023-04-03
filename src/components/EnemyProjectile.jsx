import { Projectile } from './PlayerProjectile'
import styled from 'styled-components'

const EnemyProjImg = styled.img.attrs((props) => ({
  style: {
    filter: `contrast(0.5) brightness(1.5) hue-rotate(180deg) saturate(0.5)
    drop-shadow(0 0 5px ${props.type})`,
  },
}))`
  rotate: 180deg;
  height: 20px;
  width: 8px;
  position: absolute;
  left: 0px;
  z-index: 98;
  transform: scaleY(1.5);
`

function EnemyProjectile(props) {
  return (
    <Projectile x={props.x} y={props.y}>
      <EnemyProjImg type={props.type} src="projectileSMALl.png" alt="" />
    </Projectile>
  )
}
export default EnemyProjectile
