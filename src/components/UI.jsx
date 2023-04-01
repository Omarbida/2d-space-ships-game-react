import styled from 'styled-components'

export const Healthbar = styled.div`
  position: relative;
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 327px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(255, 68, 0, 0.5) 0%,
    rgba(255, 174, 0, 0.5) 0%,
    rgba(50, 127, 160, 0.5) 80%
  );
  background: rgba(50, 127, 160, 0.5);
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  transform: skewX(-8deg);
  z-index: 1000;
`

export const HealthBarFill = styled.div.attrs((props) => ({
  style: {
    width: props.width + '%',
    background:
      props.width > 90
        ? 'aqua'
        : props.width > 80
        ? '#03e0e0'
        : props.width > 70
        ? '#03c1c1'
        : props.width > 60
        ? '#03c195'
        : props.width > 50
        ? '#3ead70'
        : props.width > 40
        ? '#6ead3e'
        : props.width > 30
        ? '#8aad3e'
        : props.width > 20
        ? '#abad3e'
        : props.width > 10
        ? '#b88d31'
        : '#d35e28',
  },
}))`
  position: absolute;
  left: 0;
  top: 0;
  height: inherit;
  width: 100%;
  transition: width 400ms, background 1000ms;
`
export const UIparagraph = styled.div.attrs((props) => ({
  style: {
    bottom: props.bottom + 'px',
    left: props.left + 'px',
  },
}))`
  position: absolute;
  color: rgba(0, 255, 255, 0.5);
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 99;
`
export const UInumSpan = styled.span`
  color: rgb(111, 45, 158);
  text-shadow: 0 0 5px rgba(111, 45, 158, 0.884);
  font-family: 'Hammersmith One', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 99;
`
