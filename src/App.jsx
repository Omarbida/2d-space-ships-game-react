import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PauseDisplay } from './components/PauseDisplay'
import './App.css'
import EnemyShip from './components/EnemyShip'
import PlayerProjectile from './components/PlayerProjectile'
import PlayerShip from './components/PlayerShip'
import {
  calcPlayerMovement,
  enemyMoveDown,
  fire,
  projectileMoveUp,
  summonEnemys,
} from './Slices/GameSlise'

let moveup = false
let movedown = false
let moveleft = false
let moveright = false
let playerFire = false
let pause = false

function App() {
  const dispatch = useDispatch()
  const { player, projectiles, enemys } = useSelector((state) => state.game)
  const [gamePaused, setGamePaused] = useState(pause)
  const [keys, setkeys] = useState({
    w: false,
    s: false,
    a: false,
    d: false,
    space: false,
  })
  useEffect(() => {
    const update = setInterval(() => {
      if (!pause) {
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
          dispatch(fire())
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
      }
    }, 10)
    return () => clearInterval(update)
  }, []) //game update loop 10ms interval 100fps
  const setMove = (e) => {
    const tempkeys = { ...keys }
    if (e.key === 'w') {
      moveup = true
      tempkeys.w = true
    }
    if (e.key === 's') {
      movedown = true
      tempkeys.s = true
    }
    if (e.key === 'a') {
      moveleft = true
      tempkeys.a = true
    }
    if (e.key === 'd') {
      moveright = true
      tempkeys.d = true
    }
    if (e.key === ' ') {
      playerFire = true
      tempkeys.space = true
    }
  }
  const unsetMove = (e) => {
    const tempkeys = { ...keys }
    if (e.key === 'w') {
      moveup = false
      tempkeys.w = false
    }
    if (e.key === 's') {
      movedown = false
      tempkeys.s = false
    }
    if (e.key === 'a') {
      moveleft = false
      tempkeys.a = false
    }
    if (e.key === 'd') {
      moveright = false
      tempkeys.d = false
    }
    if (e.key === ' ') {
      playerFire = false
      tempkeys.space = false
    }
    if (e.key === 'p') {
      pause = !pause
      setGamePaused(pause)
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
          <span>
            O<p>Options</p>
          </span>
          <span>
            I<p>Shop</p>
          </span>
        </div>
      </div>
      <div className="game">
        <PauseDisplay pause={gamePaused}>pause</PauseDisplay>
        <PlayerShip x={player.x} y={player.y} />
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
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
