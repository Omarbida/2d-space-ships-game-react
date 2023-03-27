import styled from 'styled-components'

const Explosion = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 60px;
  width: 60px;
  position: absolute;
  z-index: 98;
  border-radius: 50%;
`
function ExplosionAnimation(props) {
  return (
    <Explosion className="explosion-anim" x={props.x} y={props.y}>
      <img src={`explosion/explosion${props.image}.png`} />
    </Explosion>
  )
}
export default ExplosionAnimation
