import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { deleteProjectile } from '../Slices/GameSlise'

const Projectile = styled.div.attrs((props) => ({
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
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.y > 800) {
      dispatch(deleteProjectile(props.index))
    }
  }, [props.y])
  return (
    <Projectile x={props.x} y={props.y}>
      <img className="projectile-img" src="projectile.png" alt="" />
    </Projectile>
  )
}
export default PlayerProjectile
