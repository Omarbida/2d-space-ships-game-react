import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { buyItem, changePage } from '../Slices/GameSlise'
import { ChevronsLeft, ChevronsRight } from 'react-feather'

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
export const Header = styled.div`
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${(props) => props.fnZ + 'px'};
  width: 100%;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.356);
  border-top: 1px solid rgba(0, 255, 255, 0.356);
  border-bottom: 1px solid rgba(0, 255, 255, 0.356);
`
const ShopContainer = styled.div`
  flex-direction: column;
  align-items: center;
  width: 800px;
  height: 600px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  gap: 20px;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.356);
  color: aliceblue;
  display: flex;
  justify-content: space-evenly;
  padding: 15px 15px;
`
const ItemsContainer = styled.div`
  height: 350px;
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
  &:hover {
    scale: 1.1;
  }
  transition: all 0.2s ease-in-out;
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
  padding: 5px;
`
const ItemImg = styled.img`
  height: 100%;
  width: 100%;
`
const InfoPara = styled.p.attrs((props) => ({
  style: {
    textAlign: props.center,
    fontSize: props.fnZ,
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
const ChangePage = styled.button`
  height: 50px;
  width: 50px;
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
  border: none;
  background: transparent;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    scale: 1.3;
  }
`
const TempWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const AdditionalInfo = styled.p`
  font-size: 25px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  padding: 5px;
  width: 100%;
  text-align: center;
  font-family: 'Hammersmith One', sans-serif;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.356);
`

function ShopDisplay(props) {
  const { shopItems } = useSelector((state) => state.game)
  const dispatch = useDispatch()
  return (
    <div className="model">
      <ShopContainer>
        <Header display={'flex'} alIt={'center'} jusCo={'center'}>
          <ChangePage
            onClick={() => {
              if (shopItems.page === 1) return
              dispatch(changePage(-1))
            }}
            disabled={shopItems.page === 1}
          >
            <ChevronsLeft size={50} color="aqua" />
          </ChangePage>
          <TempWrapper>
            <InfoPara center={'center'} fnZ={30}>
              Shop
            </InfoPara>
            <Span className="shop hammersmithfont">
              <MoneyIconImg src="ores/ore5.png" alt="" />
              {props.money.toFixed(2)}
            </Span>
          </TempWrapper>
          <ChangePage
            onClick={() => {
              if (shopItems.maxPages === shopItems.page) return
              dispatch(changePage(1))
            }}
            disabled={shopItems.maxPages === shopItems.page}
          >
            <ChevronsRight size={50} color="aqua" />
          </ChangePage>
        </Header>
        <ItemsContainer>
          {shopItems.page === 1 && (
            <>
              {shopItems.missiles && (
                <ItemWrapper
                  disabled={shopItems.missiles.canBuy}
                  order={2}
                  key={shopItems.missiles.name}
                >
                  <InfoPara center={'center'}>
                    {shopItems.missiles.name}
                  </InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.missiles.canBuy) {
                        dispatch(buyItem(shopItems.missiles.name))
                      }
                    }}
                    disabled={shopItems.missiles.canBuy}
                  >
                    <Icon>
                      <ItemImg src={shopItems.missiles.lable} />
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
                        {(1 / (shopItems.missiles.fireRate / 1000)).toFixed(2)}{' '}
                        M/s
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
                        {(1 / (shopItems.shipFireRate.fireRate / 1000)).toFixed(
                          2,
                        )}{' '}
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
                  <InfoPara center={'center'}>
                    {shopItems.ShipRepair.name}
                  </InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.ShipRepair.canBuy) {
                        dispatch(buyItem(shopItems.ShipRepair.name))
                      }
                    }}
                    disabled={shopItems.ShipRepair.canBuy}
                  >
                    <Icon>
                      <ItemImg src={shopItems.ShipRepair.lable} />
                    </Icon>
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
            </>
          )}
          {shopItems.page === 2 && (
            <>
              {shopItems.shield && (
                <ItemWrapper
                  disabled={shopItems.shield.canBuy}
                  order={3}
                  key={shopItems.shield.name}
                >
                  <InfoPara center={'center'}>energy shield</InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.shield.canBuy) {
                        dispatch(buyItem(shopItems.shield.name))
                      }
                    }}
                    disabled={shopItems.shield.canBuy}
                  >
                    <Icon>
                      <ItemImg src={shopItems.shield.lable} alt="" />
                    </Icon>
                  </Item>
                  <ItemInfo>
                    <InfoPara>
                      Duration : <span>{shopItems.shield.duration}s</span>
                    </InfoPara>
                    <InfoPara center={'center'}>
                      <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                      {shopItems.shield.cost}
                    </InfoPara>
                  </ItemInfo>
                </ItemWrapper>
              )}
            </>
          )}
          {shopItems.page === 3 && (
            <>
              {shopItems.reInforcementsShip1 && (
                <ItemWrapper
                  disabled={shopItems.reInforcementsShip1.canBuy}
                  order={1}
                  key={shopItems.reInforcementsShip1.name}
                >
                  <InfoPara center={'center'}>
                    {shopItems.reInforcementsShip1.name}
                  </InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.reInforcementsShip1.canBuy) {
                        dispatch(buyItem('reInforcementsShip1'))
                      }
                    }}
                    disabled={shopItems.reInforcementsShip1.canBuy}
                  >
                    <Icon>
                      <ItemImg
                        src={shopItems.reInforcementsShip1.lable}
                        alt=""
                      />
                    </Icon>
                  </Item>
                  <ItemInfo>
                    <InfoPara>
                      Health :{' '}
                      <span>{shopItems.reInforcementsShip1.health.max}</span>
                    </InfoPara>
                    <InfoPara>
                      Damage :{' '}
                      <span>{shopItems.reInforcementsShip1.damage}</span>
                    </InfoPara>
                    <InfoPara>
                      Rate :{' '}
                      <span>
                        {(
                          1 /
                          (shopItems.reInforcementsShip1.fireRate / 1000)
                        ).toFixed(2)}{' '}
                        P/s
                      </span>
                    </InfoPara>
                    <InfoPara center={'center'}>
                      <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                      {shopItems.reInforcementsShip1.cost}
                    </InfoPara>
                  </ItemInfo>
                </ItemWrapper>
              )}
              {shopItems.reInforcementsShip2 && (
                <ItemWrapper
                  disabled={shopItems.reInforcementsShip2.canBuy}
                  order={2}
                  key={shopItems.reInforcementsShip2.name}
                >
                  <InfoPara center={'center'}>
                    {shopItems.reInforcementsShip2.name}
                  </InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.reInforcementsShip2.canBuy) {
                        dispatch(buyItem('reInforcementsShip2'))
                      }
                    }}
                    disabled={shopItems.reInforcementsShip2.canBuy}
                  >
                    <Icon>
                      <ItemImg
                        src={shopItems.reInforcementsShip2.lable}
                        alt=""
                      />
                    </Icon>
                  </Item>
                  <ItemInfo>
                    <InfoPara>
                      Health :{' '}
                      <span>{shopItems.reInforcementsShip2.health.max}</span>
                    </InfoPara>
                    <InfoPara>
                      Damage :{' '}
                      <span>{shopItems.reInforcementsShip2.damage}</span>
                    </InfoPara>
                    <InfoPara>
                      Rate :{' '}
                      <span>
                        {(
                          1 /
                          (shopItems.reInforcementsShip2.fireRate / 1000)
                        ).toFixed(2)}{' '}
                        P/s
                      </span>
                    </InfoPara>
                    <InfoPara center={'center'}>
                      <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                      {shopItems.reInforcementsShip2.cost}
                    </InfoPara>
                  </ItemInfo>
                </ItemWrapper>
              )}
              {shopItems.reInforcementsShip3 && (
                <ItemWrapper
                  disabled={shopItems.reInforcementsShip3.canBuy}
                  order={3}
                  key={shopItems.reInforcementsShip3.name}
                >
                  <InfoPara center={'center'}>
                    {shopItems.reInforcementsShip3.name}
                  </InfoPara>
                  <Item
                    onClick={() => {
                      if (shopItems.reInforcementsShip3.canBuy) {
                        dispatch(buyItem('reInforcementsShip3'))
                      }
                    }}
                    disabled={shopItems.reInforcementsShip3.canBuy}
                  >
                    <Icon>
                      <ItemImg
                        src={shopItems.reInforcementsShip3.lable}
                        alt=""
                      />
                    </Icon>
                  </Item>
                  <ItemInfo>
                    <InfoPara>
                      Health :{' '}
                      <span>{shopItems.reInforcementsShip3.health.max}</span>
                    </InfoPara>
                    <InfoPara>
                      Damage :{' '}
                      <span>{shopItems.reInforcementsShip3.damage}</span>
                    </InfoPara>
                    <InfoPara>
                      Rate :{' '}
                      <span>
                        {(
                          1 /
                          (shopItems.reInforcementsShip3.fireRate / 1000)
                        ).toFixed(2)}{' '}
                        P/s
                      </span>
                    </InfoPara>
                    <InfoPara center={'center'}>
                      <MoneyIconImg src="ores/ore5.png" alt="" />{' '}
                      {shopItems.reInforcementsShip3.cost}
                    </InfoPara>
                  </ItemInfo>
                </ItemWrapper>
              )}
            </>
          )}
        </ItemsContainer>
        {shopItems.page === 3 && (
          <AdditionalInfo>
            {shopItems.reInforcementsShipActive.current} /{' '}
            {shopItems.reInforcementsShipActive.max}
          </AdditionalInfo>
        )}
      </ShopContainer>
    </div>
  )
}
export default ShopDisplay
