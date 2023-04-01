import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PauseDisplay } from './components/PauseDisplay'
import './App.css'
import EnemyShip from './components/EnemyShip'
import PlayerProjectile from './components/PlayerProjectile'
import PlayerShip from './components/PlayerShip'
import HomeDisplay from './components/HomeDisplay'
import EnemyProjectile from './components/EnemyProjectile'
import ShopDisplay from './components/ShopDisplay'
import Ore from './components/Ore'
import PlayerMissile from './components/Missile'
import { MoneyIconImg } from './components/ShopDisplay'
import {
  Healthbar,
  HealthBarFill,
  UInumSpan,
  UIparagraph,
} from './components/UI'
import {
  calcPlayerMovement,
  checkColision,
  checkGameOver,
  checkWaveCleared,
  calcEnemyMovement,
  nextImg,
  oneSecondTimer,
  pauseGame,
  calcProjectileMovement,
  summonEnemys,
  summonProjectile,
  checkProjectileOutOfScreen,
  openShop,
  calcOreMovement,
  checkColisionWithOre,
  setTimeNow,
  summonMissile,
  calcMissileMovement,
  CheckMissileOutOfScreen,
  CheckShop,
  buyItem,
} from './Slices/GameSlise'
import ExplosionAnimation from './components/ExplosionAnimation'
import WaveCleardInfo from './components/WaveClearedInfo'
import GameOverDisplay from './components/GameOverDisplay'

let moveup = false
let movedown = false
let moveleft = false
let moveright = false
let playerFire = false

function App() {
  const dispatch = useDispatch()
  const {
    player,
    projectiles,
    enemys,
    explosions,
    wave,
    waveCleared,
    gameSean,
    damaged,
    healthBar,
    enemyProjectiles,
    ores,
    playerMissiles,
    shopItems,
    bgPositionX,
    bgPositionY,
  } = useSelector((state) => state.game)
  const [keys, setkeys] = useState({
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
  })
  useEffect(() => {
    const update = setInterval(() => {
      if (moveup) {
        dispatch(calcPlayerMovement({ exis: 'vertical', direction: +1 }))
      }
      if (movedown) {
        dispatch(calcPlayerMovement({ exis: 'vertical', direction: -1 }))
      }
      if (moveleft) {
        dispatch(calcPlayerMovement({ exis: 'horizontal', direction: -1 }))
      }
      if (moveright) {
        dispatch(calcPlayerMovement({ exis: 'horizontal', direction: +1 }))
      }
      if (playerFire) {
        dispatch(summonProjectile())
      }

      {
        const tempkeys = {
          w: moveup,
          s: movedown,
          a: moveleft,
          d: moveright,
          space: playerFire,
        }
        setkeys(tempkeys)
      }
      dispatch(calcProjectileMovement())
      dispatch(summonEnemys())
      dispatch(calcEnemyMovement())
      dispatch(checkColision())
      dispatch(nextImg())
      dispatch(checkWaveCleared())
      dispatch(oneSecondTimer())
      dispatch(checkGameOver())
      dispatch(checkProjectileOutOfScreen())
      dispatch(calcOreMovement())
      dispatch(checkColisionWithOre())
      dispatch(setTimeNow())
      dispatch(summonMissile())
      dispatch(calcMissileMovement())
      dispatch(CheckMissileOutOfScreen())
      dispatch(CheckShop())
    }, 10)
    return () => clearInterval(update)
  }, []) //game update loop 10ms interval 100fps
  const setMove = (e) => {
    const tempkeys = { ...keys }
    if (e.keyCode === 87) {
      moveup = true
      tempkeys.w = true
    }
    if (e.keyCode === 83) {
      movedown = true
      tempkeys.s = true
    }
    if (e.keyCode === 65) {
      moveleft = true
      tempkeys.a = true
    }
    if (e.keyCode === 68) {
      moveright = true
      tempkeys.d = true
    }
    if (e.keyCode === 32) {
      playerFire = true
      tempkeys.space = true
    }
  }
  const unsetMove = (e) => {
    const tempkeys = { ...keys }
    if (e.keyCode === 87) {
      moveup = false
      tempkeys.w = false
    }
    if (e.keyCode === 83) {
      movedown = false
      tempkeys.s = false
    }
    if (e.keyCode === 65) {
      moveleft = false
      tempkeys.a = false
    }
    if (e.keyCode === 68) {
      moveright = false
      tempkeys.d = false
    }
    if (e.keyCode === 32) {
      playerFire = false
      tempkeys.space = false
      dispatch(buyItem('missiles'))
    }
    if (e.keyCode === 80) {
      dispatch(pauseGame())
    }
    if (e.keyCode === 73) {
      dispatch(openShop())
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', setMove)
    window.addEventListener('keyup', unsetMove)
    return () => {
      window.removeEventListener('keydown', setMove)
      window.removeEventListener('keyup', unsetMove)
    }
  }, []) //key listener
  const [images, setImages] = useState([])
  useEffect(() => {
    if (images.length === 0) {
      const baseImage = 'explosion/explosion'
      const tmpimages = []
      for (let i = 1; i < 26; i++) {
        const image = new Image()
        image.src = baseImage + i + '.png'
        tmpimages.push(image)
      }
      setImages(tmpimages)
    }
  }, [images]) // load explosion images
  return (
    <div className="App">
      <img className="wallpaper" src="wallpaper.jpg" />

      <div className="info">
        <p>Control Ship</p>
        <div className="row">
          <span className="empty"></span>
          <span className={keys.w ? 'active' : ''}>W</span>
          <span className="empty"></span>
        </div>
        <div className="row">
          <span className={keys.a ? 'active' : ''}>A</span>
          <span className={keys.s ? 'active' : ''}>S</span>
          <span className={keys.d ? 'active' : ''}>D</span>
        </div>
        <div className="row">
          <span className={keys.space ? 'active space' : 'space'}>Space</span>
        </div>
        <p>Control Actions</p>
        <div className="row">
          <span>
            P<p>pause</p>
          </span>
          <span className="disabled">
            O<p>Options</p>
          </span>
          <span className="disabled">
            I<p>Shop</p>
          </span>
        </div>
      </div>
      <div className="game">
        <img className="game-bg" src="bg-3.jpg" />
        {gameSean !== 'home' && (
          <>
            <UIparagraph bottom={70} left={20}>
              Score: <UInumSpan>{player.score}</UInumSpan>
            </UIparagraph>
            <UIparagraph bottom={120} left={20}>
              Wave: <UInumSpan>{wave.number}</UInumSpan>
            </UIparagraph>
            <UIparagraph bottom={95} left={20}>
              Niptunium:{' '}
              <UInumSpan>
                {player.money.toFixed(2)} <MoneyIconImg src="ores/ore5.png" />
              </UInumSpan>
            </UIparagraph>
            <Healthbar>
              <HealthBarFill width={player.health} />
            </Healthbar>
          </>
        )}
        {gameSean !== 'home' && <PlayerShip x={player.x} y={player.y} />}
        {projectiles.map((projectile) => {
          return (
            <PlayerProjectile
              key={projectile.id}
              index={projectile.id}
              x={projectile.x}
              y={projectile.y}
            />
          )
        })}
        {enemyProjectiles.map((projectile) => {
          return (
            <EnemyProjectile
              key={projectile.id}
              index={projectile.id}
              x={projectile.x}
              y={projectile.y}
              type={projectile.type}
            />
          )
        })}
        {enemys.map((enemy) => {
          return (
            <EnemyShip
              key={enemy.id}
              index={enemy.id}
              x={enemy.x}
              y={enemy.y}
              ship={enemy.ship}
              health={enemy.health.percentage}
            />
          )
        })}
        {explosions.map((explosion) => {
          return (
            <ExplosionAnimation
              key={explosion.id}
              index={explosion.id}
              x={explosion.x}
              y={explosion.y}
              image={images?.[explosion.img - 1]?.src}
            />
          )
        })}
        {ores.map((ore) => {
          return (
            <Ore
              key={ore.id}
              index={ore.id}
              x={ore.x}
              y={ore.y}
              img={ore.img}
            />
          )
        })}

        {playerMissiles.map((missile) => {
          return (
            <PlayerMissile
              key={missile.id}
              index={missile.id}
              x={missile.x}
              y={missile.y}
              rotation={missile.rotation}
            />
          )
        })}
        {gameSean === 'home' && <HomeDisplay />}
        {gameSean === 'pause' && <PauseDisplay>pause</PauseDisplay>}
        {gameSean === 'shop' && (
          <ShopDisplay money={player.money} shopItems={shopItems} />
        )}
        {gameSean === 'gameover' && (
          <GameOverDisplay
            score={player.score}
            shipsDestroyed={player.totalShipsDestroyed}
          />
        )}
        {waveCleared.cleared && gameSean !== 'shop' && (
          <WaveCleardInfo
            wave={wave.number}
            score={waveCleared.score}
            shipsDestroyed={waveCleared.enemyElemenated}
            time={waveCleared.timer}
            waveShips={wave.enemys}
            total={waveCleared.total}
            waveClearedScore={waveCleared.waveClearedScore}
          />
        )}
        <div
          className="model damaged active"
          style={{ opacity: damaged + '%' }}
        ></div>
      </div>
    </div>
  )
}

export default App
