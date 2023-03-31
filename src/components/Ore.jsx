import styled from 'styled-components'

const Orediv = styled.div.attrs((props) => ({
  style: {
    bottom: props.y + 'px',
    left: props.x + 'px',
  },
}))`
  height: 25px;
  width: 25px;
  position: absolute;
  z-index: 95;
  animation: oreShine 100ms infinite linear;
`
const Img = styled.img`
  height: 100%;
  width: 100%;
  filter: contrast(2) brightness(1.5) saturate(0.5)
    drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  animation: oreRotate 5000ms infinite linear;
`

function Ore(props) {
  return (
    <Orediv x={props.x} y={props.y} className="ore">
      <Img src={`ores/${props.img}.png`} />
    </Orediv>
  )
}
export default Ore
