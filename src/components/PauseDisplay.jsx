import React from 'react'
import styled from 'styled-components'

export const PauseDisplay = styled.div.attrs((props) => ({
  style: {
    display: props.pause ? 'flex' : 'none',
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 50px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 10px;
`
