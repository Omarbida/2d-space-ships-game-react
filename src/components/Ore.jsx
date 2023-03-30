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
`
const Img = styled.img`
  height: 100%;
  width: 100%;
`

function Ore(props) {
  return (
    <Orediv x={props.x} y={props.y} className="ore">
      <Img src={`ores/${props.img}.png`} />
    </Orediv>
  )
}
export default Ore
