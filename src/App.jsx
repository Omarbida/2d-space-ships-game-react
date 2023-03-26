import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import EnemyShip from './components/EnemyShip'
import PlayerProjectile from './components/PlayerProjectile'
import PlayerShip from './components/PlayerShip'
import { calcPlayerMovement, fire, projectileMoveUp } from './Slices/GameSlise'

let moveup = false
let movedown = false
let moveleft = false
let moveright = false
let playerFire = false
function App() {
  const dispatch = useDispatch()
  const { player, projectiles } = useSelector((state) => state.game)

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
        dispatch(fire())
      }
      dispatch(projectileMoveUp())
    }, 10)
    return () => clearInterval(update)
  }, []) //game update loop 10ms interval 100fps

  const setMove = (e) => {
    if (e.key === 'w') {
      moveup = true
    }
    if (e.key === 's') {
      movedown = true
    }
    if (e.key === 'a') {
      moveleft = true
    }
    if (e.key === 'd') {
      moveright = true
    }
    if (e.key === ' ') {
      playerFire = true
    }
  }
  const unsetMove = (e) => {
    if (e.key === 'w') {
      moveup = false
    }
    if (e.key === 's') {
      movedown = false
    }
    if (e.key === 'a') {
      moveleft = false
    }
    if (e.key === 'd') {
      moveright = false
    }
    if (e.key === ' ') {
      playerFire = false
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
      <div className="game">
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
        <EnemyShip />
      </div>
    </div>
  )
}

export default App
