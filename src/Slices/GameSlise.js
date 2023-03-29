import { createSlice } from '@reduxjs/toolkit'

const playerShipSpeed = 3
const projectileSpeed = 5
const fireRate = 300
let lastFire = 0
const enemySpawnRate = 1000
let lastSpawn = 0
let timer = 1000
let lastTimer1 = 0
let enemysTypes = [
  {
    name: 'enemy1',
    health: {
      current: 5,
      max: 5,
      percentage: 100,
    },
    damage: 1,
    score: 3,
    ySpeed: 0.2,
    xSpeed: 0.2,
    ship: 1,
    fireRate: 2000,
    projectile: {
      speed: 3.2,
      type: 'blue',
    },
  },
  {
    name: 'enemy2',
    health: {
      current: 4,
      max: 4,
      percentage: 100,
    },
    damage: 1,
    score: 7,
    ySpeed: 0.2,
    xSpeed: 0.2,
    ship: 2,
    fireRate: 4000,
    projectile: {
      speed: 2.9,
      type: 'red',
    },
  },
  {
    name: 'enemy3',
    health: {
      current: 3,
      max: 3,
      percentage: 100,
    },
    damage: 1,
    score: 10,
    ySpeed: 0.2,
    xSpeed: 0.2,
    ship: 3,
    fireRate: 6000,
    projectile: {
      speed: 2.6,
      type: 'green',
    },
  },
  {
    name: 'enemy4',
    health: {
      current: 2,
      max: 2,
      percentage: 100,
    },
    damage: 1,
    score: 13,
    ySpeed: 0.2,
    xSpeed: 0.2,
    ship: 4,
    fireRate: 8000,
    projectile: {
      speed: 2.3,
      type: 'purple',
    },
  },
  {
    name: 'enemy5',
    health: {
      current: 1,
      max: 1,
      percentage: 100,
    },
    damage: 1,
    score: 15,
    ySpeed: 0.2,
    xSpeed: 0.4,
    ship: 5,
    fireRate: 10000,
    projectile: {
      speed: 2,
      type: 'yellow',
    },
  },
]
const initialState = {
  gameSean: 'home',
  player: {
    x: 475,
    y: 175,
    score: 0,
    health: 10,
    waveShipsDestroyed: 0,
    totalShipsDestroyed: 0,
  },
  damaged: false,
  projectiles: [],
  projIds: 0,
  enemIds: 0,
  explosionIds: 0,
  enemys: [],
  explosions: [],
  wave: {
    number: 1,
    enemys: 3,
  },
  enemySummoned: 0,
  waveCleared: {
    cleared: false,
    enemyElemenated: 0,
    score: 0,
    timer: 5,
  },
  healthBar: [],
  enemyProjectiles: [],
  enemyProjIds: 0,
}
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    calcPlayerMovement: (state, { payload }) => {
      if (state.gameSean !== 'game') return
      if (payload.exis === 'horizontal') {
        state.player.x += playerShipSpeed * payload.direction
        if (state.player.x >= 950) state.player.x = 950
        if (state.player.x <= 0) state.player.x = 0
      } else {
        state.player.y += playerShipSpeed * payload.direction
        if (state.player.y >= 350) state.player.y = 350
        if (state.player.y <= 0) state.player.y = 0
      }
    },
    oneSecondTimer: (state) => {
      if (state.gameSean !== 'game') return
      const timeNow = performance.now()
      if (timeNow - lastTimer1 > timer) {
        lastTimer1 = timeNow
        if (state.waveCleared.cleared) {
          state.waveCleared.timer--
        }
      }
    },
    summonProjectile: (state) => {
      if (state.gameSean !== 'game') return
      if (performance.now() - lastFire > fireRate) {
        state.projectiles.push({
          x: state.player.x + 15,
          y: state.player.y + 50,
          id: state.projIds,
        })
        lastFire = performance.now()
        state.projIds++
      }
    },
    checkProjectileOutOfScreen: (state) => {
      if (state.gameSean !== 'game') return
      if (state.projectiles.length > 0) {
        state.projectiles.forEach((proj, index) => {
          if (proj.y > 750) {
            state.projectiles.splice(index, 1)
          }
        })
      }
      if (state.enemyProjectiles.length > 0) {
        state.enemyProjectiles.forEach((proj, index) => {
          if (proj.y < -50) {
            state.enemyProjectiles.splice(index, 1)
          }
        })
      }
    },
    calcProjectileMovement: (state) => {
      if (state.gameSean !== 'game') return
      if (state.projectiles.length > 0) {
        state.projectiles.forEach((proj) => {
          proj.y += projectileSpeed
        })
      }
      if (state.enemyProjectiles.length > 0) {
        state.enemyProjectiles.forEach((proj) => {
          proj.y -= proj.speed
        })
      }
    },
    summonEnemys: (state) => {
      if (state.gameSean !== 'game') return
      if (
        performance.now() - lastSpawn > enemySpawnRate &&
        state.enemySummoned < state.wave.enemys &&
        state.enemys.length < 7
      ) {
        state.enemys.push({
          x: Math.floor(Math.random() * 950),
          y: 650,
          goTo: {
            x: goToRandomPosition().x,
            y: goToRandomPosition().y,
          },
          id: state.enemIds,
          lastFire: 0,

          ...enemysTypes[calcSpawnRate(state.wave.number) - 1],
        })
        state.enemIds++
        state.enemySummoned++
        lastSpawn = performance.now()
      }
    },

    calcEnemyMovement: (state) => {
      if (state.gameSean !== 'game') return
      const timeNow = performance.now()
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          if (enem.y < enem.goTo.y) {
            enem.y += enem.ySpeed
          } else if (enem.y > enem.goTo.y) {
            enem.y -= enem.ySpeed
          }
          if (enem.x < enem.goTo.x) {
            enem.x += enem.xSpeed
          } else if (enem.x > enem.goTo.x) {
            enem.x -= enem.xSpeed
          }

          if (enem.y < enem.goTo.y + 5 && enem.y > enem.goTo.y - 5) {
            enem.goTo.y = goToRandomPosition().y
          }
          if (enem.x < enem.goTo.x + 5 && enem.x > enem.goTo.x - 5) {
            enem.goTo.x = goToRandomPosition().x
          }
          // enemy fire
          if (timeNow - enem.lastFire > enem.fireRate) {
            state.enemyProjectiles.push({
              x: enem.x + 15,
              y: enem.y - 5,
              id: state.enemyProjIds,
              ...enem.projectile,
            })
            enem.lastFire = timeNow
            state.enemyProjIds++
          }
        })
      }
    },
    checkGameOver: (state) => {
      if (state.gameSean !== 'game') return
      if (state.player.health <= 0) {
        state.gameRuning = false
        state.gameSean = 'gameover'
      } else {
        let tempHealthBar = []
        for (let i = 0; i < state.player.health; i++) {
          tempHealthBar.push(i)
        }
        state.healthBar = [...tempHealthBar]
      }
    },
    startGame: (state) => {
      state.gameRuning = true
      state.gameSean = 'game'
      state.player = initialState.player
      state.projectiles = initialState.projectiles
      state.projIds = initialState.projIds
      state.enemIds = initialState.enemIds
      state.explosionIds = initialState.explosionIds
      state.enemys = initialState.enemys
      state.explosions = initialState.explosions
      state.wave = initialState.wave
      state.enemySummoned = initialState.enemySummoned
      state.waveCleared = initialState.waveCleared
    },
    pauseGame: (state) => {
      if (state.gameSean === 'pause') {
        state.gameSean = 'game'
        return
      } else if (state.gameSean === 'game') {
        state.gameSean = 'pause'
      }
    },
    homeSean: (state) => {
      state.gameSean = 'home'
      state.enemys = []
    },
    checkColision: (state) => {
      if (state.gameSean !== 'game') return
      if (state.enemys.length > 0 && state.projectiles.length > 0) {
        state.enemys.forEach((enem) => {
          state.projectiles.forEach((proj) => {
            if (
              ((proj.x >= enem.x + 5 && proj.x <= enem.x + 35) ||
                (proj.x + 10 >= enem.x + 5 && proj.x + 10 <= enem.x + 35)) &&
              ((proj.y >= enem.y + 5 && proj.y <= enem.y + 55) ||
                (proj.y + 10 >= enem.y + 5 && proj.y + 10 <= enem.y + 55))
            ) {
              state.projectiles = state.projectiles.filter((projectile) => {
                if (proj.id != projectile.id) return projectile
              })
              if (enem.health.current >= 0) {
                enem.health.current -= 1
                enem.health.percentage =
                  (enem.health.current / enem.health.max) * 100
                console.log(enem.health.percentage)
              }
              if (enem.health.current <= 0) {
                state.score += enem.score
                state.enemys = state.enemys.filter((enemy) => {
                  if (enemy.id != enem.id) return enemy
                })
                state.explosions.push({
                  x: enem.x - 20,
                  y: enem.y + 20,
                  id: state.explosionIds,
                  img: 1,
                })
                state.explosionIds++
              }
            }
          })
        })
      }
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          if (
            ((enem.x + 5 >= state.player.x + 5 &&
              enem.x + 5 <= state.player.x + 35) ||
              (enem.x + 35 >= state.player.x + 5 &&
                enem.x + 35 <= state.player.x + 35)) &&
            ((enem.y + 5 >= state.player.y + 5 &&
              enem.y + 5 <= state.player.y + 55) ||
              (enem.y + 55 >= state.player.y + 5 &&
                enem.y + 55 <= state.player.y + 55))
          ) {
            state.player.health -= 1
            state.damaged = 100
            state.enemys = state.enemys.filter((enemy) => {
              if (enemy.id != enem.id) return enemy
            })
            state.explosions.push({
              x: enem.x - 20,
              y: enem.y + 20,
              id: state.explosionIds,
              img: 1,
            })
          }
          if (state.enemyProjectiles.length > 0) {
            state.enemyProjectiles.forEach((proj) => {
              if (
                ((proj.x >= state.player.x + 5 &&
                  proj.x <= state.player.x + 35) ||
                  (proj.x + 10 >= state.player.x + 5 &&
                    proj.x + 10 <= state.player.x + 35)) &&
                ((proj.y >= state.player.y + 5 &&
                  proj.y <= state.player.y + 55) ||
                  (proj.y + 10 >= state.player.y + 5 &&
                    proj.y + 10 <= state.player.y + 55))
              ) {
                state.player.health -= 1
                state.damaged = 100
                state.enemyProjectiles = state.enemyProjectiles.filter(
                  (projectile) => {
                    if (proj.id != projectile.id) return projectile
                  },
                )
              }
            })
          }
        })
      }
    },
    nextImg: (state) => {
      if (state.explosions.length > 0) {
        state.explosions.forEach((explosion) => {
          explosion.img++
          if (explosion.img > 25) {
            state.explosions = state.explosions.filter((explosion) => {
              if (explosion.id != explosion.id) return explosion
            })
          }
        })
      }
      if (state.damaged <= 0) {
      } else {
        state.damaged -= 1
      }
    },
    deleteExplosion: (state, { payload }) => {
      if (state.gameSean !== 'game') return
      const tempExplosion = state.explosions.filter((explosion) => {
        if (explosion.id != payload) return explosion
      })
      state.explosions = [...tempExplosion]
    },
    checkWaveCleared: (state) => {
      if (state.gameSean !== 'game') return
      if (
        state.enemys.length === 0 &&
        state.enemySummoned === state.wave.enemys
      ) {
        if (!state.waveCleared.cleared) {
          state.waveCleared.cleared = true
          state.waveCleared.enemyElemenated = state.player.waveShipsDestroyed
          state.waveCleared.score = state.player.waveShipsDestroyed * 5
        }
        if (state.waveCleared.timer <= 0) {
          state.player.score += state.waveCleared.score
          state.wave.number++
          state.wave.enemys += 1
          state.waveCleared.cleared = false
          state.waveCleared.enemyElemenated = 0
          state.waveCleared.score = 0
          state.waveCleared.timer = 5
          state.enemySummoned = 0
          state.player.waveShipsDestroyed = 0
        }
      }
    },
  },
})
export const {
  calcPlayerMovement,
  summonProjectile,
  deleteProjectile,
  calcProjectileMovement,
  summonEnemys,
  calcEnemyMovement,
  checkColision,
  deleteExplosion,
  nextImg,
  checkWaveCleared,
  oneSecondTimer,
  checkGameOver,
  startGame,
  pauseGame,
  homeSean,
  checkProjectileOutOfScreen,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer

function calcSpawnRate(wave) {
  const chance = Math.floor(Math.random() * 125) + 1
  if (wave < 3) {
    return 5
  } else if (wave >= 3 && wave < 6) {
    if (chance < 30) {
      return 4
    } else {
      return 5
    }
  } else if (wave >= 6 && wave < 11) {
    if (chance < 20) {
      return 3
    } else if (chance < 50 && chance >= 20) {
      return 4
    } else {
      return 5
    }
  } else if (wave >= 11 && wave < 15) {
    if (chance < 10) {
      return 2
    } else if (chance < 30 && chance >= 10) {
      return 3
    } else if (chance < 60 && chance >= 30) {
      return 4
    } else {
      return 5
    }
  } else if (wave >= 15) {
    if (chance < 5) {
      return 1
    } else if (chance < 15 && chance >= 5) {
      return 2
    } else if (chance < 35 && chance >= 15) {
      return 3
    } else if (chance < 65 && chance >= 35) {
      return 4
    } else {
      return 5
    }
  }
}
function goToRandomPosition() {
  const x = Math.floor(Math.random() * 950)
  const y = 400 + Math.floor(Math.random() * 250)
  return { x, y }
}
