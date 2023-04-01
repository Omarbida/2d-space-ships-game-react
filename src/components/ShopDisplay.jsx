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
    filter: props.disabled ? 'none' : 'grayscale(100%)',
    color: props.disabled ? 'white' : 'rgba(255, 255, 255, 0.5)',
  },
}))`
  width: 150px;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
  color: inherit;
`
const ItemInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: inherit;
`
export const MoneyIconImg = styled.img`
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
            <MoneyIconImg src="ores/ore5.png" alt="" />
            {props.money.toFixed(2)}
          </Span>
        </h1>
        <ItemsContainer>
          {shopItems.missiles && (
            <ItemWrapper
              disabled={shopItems.missiles.canBuy}
              order={2}
              key={shopItems.missiles.name}
            >
              <InfoPara center={'center'}>{shopItems.missiles.name}</InfoPara>
              <Item
                onClick={() => {
                  if (shopItems.missiles.canBuy) {
                    dispatch(buyItem(shopItems.missiles.name))
                  }
                }}
                disabled={shopItems.missiles.canBuy}
              >
                <Icon>
                  <MissileImg src={shopItems.missiles.lable} />
                </Icon>
              </Item>
              <ItemInfo>
                <InfoPara>
                  Level :{' '}
                  <span>
                    {shopItems.missiles.level === 5
                      ? 'max'
                      : shopItems.missiles.level}
                  </span>
                </InfoPara>

                <InfoPara>
                  Damage : <span>{shopItems.missiles.damage}</span>
                </InfoPara>
                <InfoPara>
                  Rate :{' '}
                  <span>
                    {(1 / (shopItems.missiles.fireRate / 1000)).toFixed(2)} M/s
                  </span>
                </InfoPara>
                {shopItems.missiles.level !== 5 && (
                  <InfoPara center={'center'}>
                    <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                    {shopItems.missiles.cost}
                  </InfoPara>
                )}
              </ItemInfo>
            </ItemWrapper>
          )}
          {shopItems.shipFireRate && (
            <ItemWrapper
              disabled={shopItems.shipFireRate.canBuy}
              order={0}
              key={shopItems.shipFireRate.name}
            >
              <InfoPara center={'center'}>
                {shopItems.shipFireRate.name}
              </InfoPara>
              <Item
                onClick={() => {
                  if (shopItems.shipFireRate.canBuy) {
                    dispatch(buyItem(shopItems.shipFireRate.name))
                  }
                }}
              >
                <InfoPara center={'center'}>
                  {shopItems.shipFireRate.lable}
                </InfoPara>
              </Item>
              <ItemInfo>
                {shopItems.shipFireRate.level !== 0 && (
                  <InfoPara>
                    Level : <span>{shopItems.shipFireRate.level}</span>
                  </InfoPara>
                )}
                <InfoPara>
                  Damage : <span>{shopItems.shipFireRate.damage}</span>
                </InfoPara>
                <InfoPara>
                  Rate :{' '}
                  <span>
                    {(1 / (shopItems.shipFireRate.fireRate / 1000)).toFixed(2)}{' '}
                    P/s
                  </span>
                </InfoPara>
                <InfoPara center={'center'}>
                  <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                  {shopItems.shipFireRate.cost}
                </InfoPara>
              </ItemInfo>
            </ItemWrapper>
          )}
          {shopItems.ShipRepair && (
            <ItemWrapper
              disabled={shopItems.ShipRepair.canBuy}
              order={1}
              key={shopItems.ShipRepair.name}
            >
              <InfoPara center={'center'}>{shopItems.ShipRepair.name}</InfoPara>
              <Item
                onClick={() => {
                  if (shopItems.ShipRepair.canBuy) {
                    dispatch(buyItem(shopItems.ShipRepair.name))
                  }
                }}
                disabled={shopItems.ShipRepair.canBuy}
              >
                <InfoPara center={'center'}>
                  {shopItems.ShipRepair.lable}
                </InfoPara>
              </Item>
              <ItemInfo>
                <InfoPara center={'center'}>
                  Repair Ship with niptunium
                </InfoPara>
                <InfoPara center={'center'}>
                  <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                  {shopItems.ShipRepair.cost}
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
