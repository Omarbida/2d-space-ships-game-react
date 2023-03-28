import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PauseDisplay } from './components/PauseDisplay'
import './App.css'
import EnemyShip from './components/EnemyShip'
import PlayerProjectile from './components/PlayerProjectile'
import PlayerShip from './components/PlayerShip'
import HomeDisplay from './components/HomeDisplay'
import {
  calcPlayerMovement,
  checkColision,
  checkGameOver,
  checkWaveCleared,
  enemyMoveDown,
  nextImg,
  oneSecondTimer,
  pauseGame,
  projectileMoveUp,
  summonEnemys,
  summonProjectile,
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
      dispatch(projectileMoveUp())
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
      dispatch(summonEnemys())
      dispatch(enemyMoveDown())
      dispatch(checkColision())
      dispatch(nextImg())
      dispatch(checkWaveCleared())
      dispatch(oneSecondTimer())
      dispatch(checkGameOver())
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
    }
    if (e.keyCode === 80) {
      dispatch(pauseGame())
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
        image.onload = () => {
          console.log('loaded image', i)
        }
        tmpimages.push(image)
      }
      setImages(tmpimages)
    }
  }, [images])
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
        {gameSean !== 'home' && (
          <>
            <div className="UI score">Score: {player.score}</div>
            <div className="UI wave">Wave: {wave.number}</div>
            <div className="UI health">
              {healthBar.map((bar) => {
                return <div key={bar} className="health-rectangle"></div>
              })}
            </div>
          </>
        )}
        {waveCleared.cleared && (
          <WaveCleardInfo
            wave={wave.number}
            score={waveCleared.score}
            shipsDestroyed={waveCleared.enemyElemenated}
            time={waveCleared.timer}
            waveShips={wave.enemys}
          />
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
        {enemys.map((enemy) => {
          return (
            <EnemyShip
              key={enemy.id}
              index={enemy.id}
              x={enemy.x}
              y={enemy.y}
              ship={enemy.ship}
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

        {gameSean === 'gameover' && (
          <GameOverDisplay
            score={player.score}
            shipsDestroyed={player.totalShipsDestroyed}
          />
        )}
        {gameSean === 'home' && <HomeDisplay />}
        {gameSean === 'pause' && <PauseDisplay>pause</PauseDisplay>}
        <div
          className="model damaged active"
          style={{ opacity: damaged + '%' }}
        ></div>
      </div>
    </div>
  )
}

export default App
