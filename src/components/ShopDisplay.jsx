import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { buyItem } from '../Slices/GameSlise'

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
const ItemsContainer = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.356));
`
const ItemWrapper = styled.div`
  width: 150px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`
const Item = styled.div.attrs((props) => ({
  style: {
    filter: props.disabled ? 'none' : 'grayscale(100%)',
  },
}))`
  height: 100px;
  width: 100px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.356);
  cursor: pointer;
`
const ItemInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`
const Img = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 5px;
`
const MisileDive = styled.div`
  height: 100%;
  width: 100%;
`
const MissileImg = styled.img`
  height: 100%;
  width: 100%;
`
const InfoPara = styled.p`
  width: 100%;
  font-family: 'Hammersmith One', sans-serif;
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.center || 'space-between'};
  margin: 0;
  padding: 0;
`

function ShopDisplay(props) {
  const { shopItems } = useSelector((state) => state.game)
  const dispatch = useDispatch()
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
        <ItemsContainer>
          {shopItems.map((item) => {
            return (
              <ItemWrapper
                onClick={() => {
                  if (item.canBuy) {
                    dispatch(buyItem(item.name))
                  }
                }}
                disabled={item.canBuy}
                key={item.name}
              >
                <InfoPara center={'center'}>{item.name}</InfoPara>
                <Item disabled={item.canBuy}>
                  <MisileDive>
                    <MissileImg src={item.lable} />
                  </MisileDive>
                </Item>
                <ItemInfo>
                  {item.level !== 0 && (
                    <InfoPara>
                      Level :{' '}
                      <span>{item.level === 5 ? 'max' : item.level}</span>
                    </InfoPara>
                  )}
                  <InfoPara>
                    Damage : <span>{item.damage}</span>
                  </InfoPara>
                  <InfoPara>
                    Rate : <span>1/{item.fireRate / 1000} s</span>
                  </InfoPara>
                  <InfoPara center={'center'}>
                    <Img src="ores/ore2.png" alt="" /> {item.cost}
                  </InfoPara>
                </ItemInfo>
              </ItemWrapper>
            )
          })}
        </ItemsContainer>
      </div>
    </div>
  )
}
export default ShopDisplay
