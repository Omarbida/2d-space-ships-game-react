import { useState, useEffect } from 'react'
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
  filter: drop-shadow(0px 0px 10px #a424243a) contrast(1.3) brightness(1.3);
`
function ExplosionAnimation(props) {
  return (
    <Explosion x={props.x} y={props.y}>
      <img src={props.image} />
    </Explosion>
  )
}
export default ExplosionAnimation
