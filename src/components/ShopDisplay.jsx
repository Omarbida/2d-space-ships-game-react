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
  min-height: 300px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.356));
`
const ItemWrapper = styled.div.attrs((props) => ({
  style: {
    order: props.order,
  },
}))`
  width: 150px;
  height: 100%;
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
const Icon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`
const MissileImg = styled.img`
  height: 100%;
  width: 100%;
`
const InfoPara = styled.p.attrs((props) => ({
  style: {
    textAlign: props.center,
  },
}))`
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
  padding: 5px;
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
          {shopItems[0] && (
            <ItemWrapper
              order={2}
              disabled={shopItems[0].canBuy}
              key={shopItems[0].name}
            >
              <InfoPara center={'center'}>{shopItems[0].name}</InfoPara>
              <Item
                onClick={() => {
                  if (shopItems[0].canBuy) {
                    dispatch(buyItem(shopItems[0].name))
                  }
                }}
                disabled={shopItems[0].canBuy}
              >
                <Icon>
                  <MissileImg src={shopItems[0].lable} />
                </Icon>
              </Item>
              <ItemInfo>
                <InfoPara>
                  Level :{' '}
                  <span>
                    {shopItems[0].level === 5 ? 'max' : shopItems[0].level}
                  </span>
                </InfoPara>

                <InfoPara>
                  Damage : <span>{shopItems[0].damage}</span>
                </InfoPara>
                <InfoPara>
                  Rate :{' '}
                  <span>
                    {(1 / (shopItems[0].fireRate / 1000)).toFixed(2)} M/s
                  </span>
                </InfoPara>
                {shopItems[0].level !== 5 && (
                  <InfoPara center={'center'}>
                    <Img src="ores/ore2.png" alt="" /> {shopItems[0].cost}
                  </InfoPara>
                )}
              </ItemInfo>
            </ItemWrapper>
          )}
          {shopItems[1] && (
            <ItemWrapper
              onClick={() => {
                if (shopItems[1].canBuy) {
                  dispatch(buyItem(shopItems[1].name))
                }
              }}
              order={0}
              disabled={shopItems[1].canBuy}
              key={shopItems[1].name}
            >
              <InfoPara center={'center'}>{shopItems[1].name}</InfoPara>
              <Item disabled={shopItems[1].canBuy}>
                <InfoPara center={'center'}>{shopItems[1].lable}</InfoPara>
              </Item>
              <ItemInfo>
                {shopItems[1].level !== 0 && (
                  <InfoPara>
                    Level : <span>{shopItems[1].level}</span>
                  </InfoPara>
                )}
                <InfoPara>
                  Damage : <span>{shopItems[1].damage}</span>
                </InfoPara>
                <InfoPara>
                  Rate :{' '}
                  <span>
                    {(1 / (shopItems[1].fireRate / 1000)).toFixed(2)} P/s
                  </span>
                </InfoPara>
                <InfoPara center={'center'}>
                  <Img src="ores/ore2.png" alt="" /> {shopItems[1].cost}
                </InfoPara>
              </ItemInfo>
            </ItemWrapper>
          )}
        </ItemsContainer>
      </div>
    </div>
  )
}
export default ShopDisplay
