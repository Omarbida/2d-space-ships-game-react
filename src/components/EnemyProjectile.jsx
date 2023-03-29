import { Projectile } from './PlayerProjectile'

function EnemyProjectile(props) {
  return (
    <Projectile x={props.x} y={props.y}>
      <img
        className={`enemy-projectile-img ${props.type}`}
        src="projectile.png"
        alt=""
      />
    </Projectile>
  )
}
export default EnemyProjectile
