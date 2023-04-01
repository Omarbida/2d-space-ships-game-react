import styled from 'styled-components'

const ShieldWrapper = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 90px;
  width: 90px;
  position: absolute;
  z-index: 98;
  border-radius: 50%;
  filter: drop-shadow(0px 0px 15px #1dc9c9ae);
  animation: ShieldRotate 1s infinite linear;
`
const ShieldImg = styled.img`
  height: 100%;
  width: 100%;
  opacity: 0.7;
`
const Shield = (props) => {
  return (
    <ShieldWrapper x={props.x} y={props.y}>
      <ShieldImg src="shield.png" />
    </ShieldWrapper>
  )
}
export default Shield
