import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  padding: 5px;
  font-size: 25px;
`
const Img = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 5px;
`

function ShopDisplay(props) {
  return (
    <div className="model">
      <div className="model-info shop">
        <h1 className="h1">
          <span>Shop</span>
          <Span className="shop hammersmithfont">
            <Img src="ores/ore2.png" alt="" />
            {props.money}
          </Span>
        </h1>
        <div className="items">
          <div className="itemwrapper">
            <p className="item">Item 1</p>
            <p className="cost">Cost: 100</p>
          </div>
          <div className="itemwrapper">
            <p className="item">Item 2</p>
            <p className="cost">Cost: 100</p>
          </div>
          <div className="itemwrapper">
            <p className="item">Item 3</p>
            <p className="cost">Cost: 100</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ShopDisplay
