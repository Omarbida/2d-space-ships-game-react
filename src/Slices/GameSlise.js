import { createSlice } from '@reduxjs/toolkit'

const projectileSpeed = 5

const enemySpawnRate = 1000
let lastSpawn = 0
let timer = 1000
let lastTimer1 = 0
let oreSpeed = 0.2

let oreTypes = [
  {
    name: 'ore1',
    value: 1,
    img: 'ore1',
  },
  {
    name: 'ore2',
    value: 4,
    img: 'ore2',
  },
  {
    name: 'ore3',
    value: 5,
    img: 'ore3',
  },
  {
    name: 'ore4',
    value: 3,
    img: 'ore4',
  },
  {
    name: 'ore5',
    value: 2,
    img: 'ore5',
  },
]

const initialState = {
  gameSean: 'home',
  player: {
    ShipSpeed: 3,
    shipVelocity: 0.1,
    fireRate: 100,
    x: 475,
    y: 175,
    score: 0,
    money: 1000,
    health: 10,
    waveShipsDestroyed: 0,
    totalShipsDestroyed: 0,
    xVelocity: 0.1,
    yVelocity: 0.1,
    lastProjectile: 0,
    lastMissile: 0,
  },
  waveCleared: {
    cleared: false,
    enemyElemenated: 0,
    waveClearedScore: 0,
    score: 0,
    timer: 5,
  },
  wave: {
    number: 1,
    enemys: 3,
  },
  ores: [],
  projectiles: [],
  enemys: [],
  explosions: [],
  healthBar: [],
  enemyProjectiles: [],
  playerMissiles: [],
  shopItems: [
    {
      name: 'missiles',
      level: 0,
      cost: 100,
      damage: 5,
      fireRate: 10000,
      lable: 'missile.png',
      canBuy: false,
      maxed: false,
    },
  ],
  timeNow: 0,
  damaged: false,
  enemySummoned: 0,
  lastMissileSide: 'left',
}
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTimeNow: (state) => {
      if (state.gameSean !== 'game') return
      state.timeNow = performance.now()
    },
    calcPlayerMovement: (state, { payload }) => {
      if (state.gameSean !== 'game') return

      if (payload.exis == 'horizontal') {
        state.player.x += state.player.ShipSpeed * payload.direction
        if (state.player.x < 0) state.player.x = 0
        if (state.player.x > 950) state.player.x = 950
        state.player.lastX = state.player.x
      } else {
        state.player.y += state.player.ShipSpeed * payload.direction
        if (state.player.y < 0) state.player.y = 0
        if (state.player.y > 350) state.player.y = 350
        state.player.lastY = state.player.y
      }
    },
    oneSecondTimer: (state) => {
      if (state.gameSean !== 'game') return
      const timeNow = state.timeNow
      if (timeNow - lastTimer1 > timer) {
        lastTimer1 = timeNow
        if (state.waveCleared.cleared) {
          state.waveCleared.timer--
        }
      }
    },
    summonProjectile: (state) => {
      if (state.gameSean !== 'game') return
      if (state.timeNow - state.player.lastProjectile > state.player.fireRate) {
        state.projectiles.push({
          x: state.player.x + 15,
          y: state.player.y + 50,
          id: window.crypto.randomUUID(),
        })
        state.player.lastProjectile = state.timeNow
      }
    },
    summonMissile: (state) => {
      if (state.gameSean !== 'game') return
      if (state.shopItems[0].level === 0) return
      if (state.enemys.length === 0) return
      let side = 0
      if (state.lastMissileSide === 'left') {
        side = 0
        state.lastMissileSide = 'right'
      } else {
        side = 25
        state.lastMissileSide = 'left'
      }
      const targetX = state.player.x + side
      const targetY = state.player.y + 50
      const rotation = Math.atan2(
        targetY - state.player.y,
        targetX - state.player.x,
      )
      if (
        state.timeNow - state.player.lastMissile >
        state.shopItems[0].fireRate
      ) {
        state.playerMissiles.push({
          x: state.player.x + side,
          y: state.player.y,
          id: window.crypto.randomUUID(),
          damage: state.shopItems[0].damage,
          target: {
            x: targetX,
            y: targetY,
          },
          rotation: rotation,
          missileSpeed: 2,
          missileVelocity: 0.05,
          preparingToFly: true,
        })
        state.player.lastMissile = state.timeNow
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
    calcOreMovement: (state) => {
      if (state.gameSean !== 'game') return
      if (state.ores.length > 0) {
        state.ores.forEach((ore) => {
          const triangleBase = Math.abs(ore.x - state.player.x)
          const triangleHeight = Math.abs(ore.y - state.player.y)
          const triangleHypotenuse = Math.sqrt(
            Math.pow(triangleBase, 2) + Math.pow(triangleHeight, 2),
          )
          const angle = Math.asin(triangleHeight / triangleHypotenuse)
          const xSpeed = Math.cos(angle) * oreSpeed * ore.oreVelocity
          const ySpeed = Math.sin(angle) * oreSpeed * ore.oreVelocity

          if (ore.x > state.player.x) {
            ore.x -= xSpeed
          } else {
            ore.x += xSpeed
          }
          if (ore.y > state.player.y) {
            ore.y -= ySpeed
          }
          if (ore.y < state.player.y) {
            ore.y += ySpeed
          }
          ore.oreVelocity += ore.oreVelocity * 0.02
        })
      }
    },
    calcMissileMovement: (state) => {
      if (state.gameSean !== 'game') return
      if (state.playerMissiles.length > 0) {
        let targetX = 0
        let targetY = 0
        state.playerMissiles.forEach((missile) => {
          if (
            missile.x > missile.target.x - 10 &&
            missile.x < missile.target.x + 10 &&
            missile.y > missile.target.y - 10 &&
            missile.y < missile.target.y + +10
          ) {
            missile.preparingToFly = false
          }
          if (missile.preparingToFly) {
            targetX = missile.target.x
            targetY = missile.target.y
          } else if (state.enemys.length > 0) {
            targetX = state.enemys[0].x + 20
            targetY = state.enemys[0].y + 30
          } else {
            targetX = missile.target.x
            targetY = missile.target.y + 1000
          }

          const triangleBase = Math.abs(missile.x - targetX)
          const triangleHeight = Math.abs(missile.y - targetY)
          const triangleHypotenuse = Math.sqrt(
            Math.pow(triangleBase, 2) + Math.pow(triangleHeight, 2),
          )
          if (missile.missileVelocity > 1.5) missile.missileVelocity = 1.5
          const angle = Math.asin(triangleHeight / triangleHypotenuse)
          const xSpeed =
            Math.cos(angle) * missile.missileSpeed * missile.missileVelocity
          const ySpeed =
            Math.sin(angle) * missile.missileSpeed * missile.missileVelocity
          missile.missileVelocity += missile.missileVelocity * 0.02
          if (missile.x > targetX) {
            missile.x -= xSpeed
            missile.rotation = Math.atan2(
              targetX - missile.x,
              targetY - missile.y,
            )
          } else {
            missile.x += xSpeed
            missile.rotation = Math.atan2(
              targetX - missile.x,
              targetY - missile.y,
            )
          }
          if (missile.y > targetY) {
            missile.y -= ySpeed
          }
          if (missile.y < targetY) {
            missile.y += ySpeed
          }
        })
      }
    },
    CheckMissileOutOfScreen: (state) => {
      if (state.gameSean !== 'game') return
      if (state.playerMissiles.length > 0) {
        state.playerMissiles.forEach((missile, index) => {
          if (missile.y > 750) {
            state.playerMissiles.splice(index, 1)
          }
        })
      }
    },
    summonEnemys: (state) => {
      if (state.gameSean !== 'game') return
      const randomX = Math.floor(Math.random() * 950)
      const spawnType = calcSpawnRate(state.wave.number)
      if (
        state.timeNow - lastSpawn > enemySpawnRate &&
        state.enemySummoned < state.wave.enemys &&
        state.enemys.length < 7
      ) {
        const health = {
          max: spawnType + Math.floor(state.wave.number / 5) * spawnType,
          current: spawnType + Math.floor(state.wave.number / 5),
          percentage: 100,
        }
        const projectile = {
          speed: 3,
          type:
            spawnType === 1
              ? 'yellow'
              : spawnType === 2
              ? 'red'
              : spawnType === 3
              ? 'blue'
              : spawnType === 4
              ? 'green'
              : 'purple',
        }
        state.enemys.push({
          name: `enemy${state.enemySummoned}`,
          x: randomX,
          y: 650,
          score: spawnType * 5,
          ship: spawnType,
          goTo: {
            x: goToRandomPosition({
              x: randomX,
              y: 650,
            }).x,
            y: goToRandomPosition({ x: randomX, y: 650 }).y,
          },
          lastGoToX: 0,
          lastGoToY: 0,
          goToRate: 4000,
          id: window.crypto.randomUUID(),
          lastFire: 0,
          enemVelocityX: 0.2,
          enemVelocityY: 0.2,
          health,
          projectile,
          damage: 0,
          fireRate: 2000 - spawnType * 100,
          speed: spawnType * 0.5,
          oreDrop: spawnType,
        })
        state.enemySummoned++
        lastSpawn = state.timeNow
      }
    },
    calcEnemyMovement: (state) => {
      if (state.gameSean !== 'game') return
      const timeNow = state.timeNow
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          const triangleBase = Math.abs(enem.x - enem.goTo.x)
          const triangleHeight = Math.abs(enem.y - enem.goTo.y)
          const triangleHypotenuse = Math.sqrt(
            Math.pow(triangleBase, 2) + Math.pow(triangleHeight, 2),
          )
          const angle = Math.asin(triangleHeight / triangleHypotenuse)
          const xSpeed = Math.cos(angle) * enem.speed * enem.enemVelocityX
          const ySpeed = Math.sin(angle) * enem.speed * enem.enemVelocityY

          if (enem.x > enem.goTo.x) {
            enem.x -= xSpeed
          } else {
            enem.x += xSpeed
          }
          if (enem.y > enem.goTo.y) {
            enem.y -= ySpeed
          }
          if (enem.y < enem.goTo.y) {
            enem.y += ySpeed
          }
          enem.enemVelocityY = enem.enemVelocityY * 1.01
          enem.enemVelocityX = enem.enemVelocityX * 1.04
          if (enem.enemVelocity > 1.1) enem.enemVelocityY = 1.1
          if (enem.enemVelocityX > 1.1) enem.enemVelocityX = 1.1
          if (enem.x - enem.goTo.x > -0.5 && enem.x - enem.goTo.x < 0.5) {
            enem.goTo.x = goToRandomPosition({
              x: enem.x,
              y: enem.y,
            }).x
            enem.enemVelocityX = 0.2
          }
          if (enem.y - enem.goTo.y > -0.5 && enem.y - enem.goTo.y < 0.5) {
            enem.goTo.y = goToRandomPosition({
              x: enem.x,
              y: enem.y,
            }).y
            enem.enemVelocityY = 0.1
          }
          // enemy fire
          if (timeNow - enem.lastFire > enem.fireRate) {
            state.enemyProjectiles.push({
              x: enem.x + 15,
              y: enem.y - 5,
              id: window.crypto.randomUUID(),
              ...enem.projectile,
            })
            enem.lastFire = timeNow
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
      state.enemys = []
      state.projectiles = []
      state.enemyProjectiles = []
      state.ores = []
      state.healthBar = []
      state.playerMissiles = []
      state.wave = initialState.wave
      state.shopItems = initialState.shopItems
      state.enemySummoned = 0
      state.timeNow = 0
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
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          if (state.projectiles.length > 0) {
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
                }
                // enemy death
                if (enem.health.current <= 0) {
                  state.score += enem.score
                  state.enemys = state.enemys.filter((enemy) => {
                    if (enemy.id != enem.id) return enemy
                  })
                  state.explosions.push({
                    x: enem.x - 20,
                    y: enem.y + 20,
                    id: window.crypto.randomUUID(),
                    img: 1,
                    lastImg: 0,
                  })
                  state.ores.push({
                    id: window.crypto.randomUUID(),
                    x: enem.x + 10,
                    y: enem.y + 10,
                    oreVelocity: 0.3,
                    ...oreTypes[enem.oreDrop - 1],
                  })
                  state.player.waveShipsDestroyed++
                  state.player.score += enem.score
                }
              }
            })
          }
          if (state.playerMissiles.length > 0) {
            state.playerMissiles.forEach((missile) => {
              if (
                ((missile.x >= enem.x + 5 && missile.x <= enem.x + 35) ||
                  (missile.x + 10 >= enem.x + 5 &&
                    missile.x + 10 <= enem.x + 35)) &&
                ((missile.y >= enem.y + 5 && missile.y <= enem.y + 55) ||
                  (missile.y + 10 >= enem.y + 5 &&
                    missile.y + 10 <= enem.y + 55))
              ) {
                state.playerMissiles = state.playerMissiles.filter(
                  (missile2) => {
                    if (missile.id != missile2.id) return missile
                  },
                )
                if (enem.health.current >= 0) {
                  enem.health.current -= missile.damage
                  enem.health.percentage =
                    (enem.health.current / enem.health.max) * 100
                }
                // enemy death
                if (enem.health.current <= 0) {
                  state.score += enem.score
                  state.enemys = state.enemys.filter((enemy) => {
                    if (enemy.id != enem.id) return enemy
                  })
                  state.explosions.push({
                    x: enem.x - 20,
                    y: enem.y + 20,
                    id: window.crypto.randomUUID(),
                    img: 1,
                    lastImg: 0,
                  })
                  state.ores.push({
                    id: window.crypto.randomUUID(),
                    x: enem.x + 10,
                    y: enem.y + 10,
                    oreVelocity: 0.3,
                    ...oreTypes[enem.oreDrop - 1],
                  })
                  state.player.waveShipsDestroyed++
                  state.player.score += enem.score
                }
              }
            })
          }
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
        })
      }
      if (state.enemyProjectiles.length > 0) {
        state.enemyProjectiles.forEach((proj) => {
          if (
            ((proj.x >= state.player.x + 5 && proj.x <= state.player.x + 35) ||
              (proj.x + 10 >= state.player.x + 5 &&
                proj.x + 10 <= state.player.x + 35)) &&
            ((proj.y >= state.player.y + 5 && proj.y <= state.player.y + 55) ||
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
    },
    checkColisionWithOre: (state) => {
      if (state.gameSean !== 'game') return
      if (state.ores.length > 0) {
        state.ores.forEach((ore) => {
          if (
            ((ore.x + 5 >= state.player.x + 5 &&
              ore.x + 5 <= state.player.x + 35) ||
              (ore.x + 35 >= state.player.x + 5 &&
                ore.x + 35 <= state.player.x + 35)) &&
            ((ore.y + 5 >= state.player.y + 5 &&
              ore.y + 5 <= state.player.y + 55) ||
              (ore.y + 55 >= state.player.y + 5 &&
                ore.y + 55 <= state.player.y + 55))
          ) {
            state.ores = state.ores.filter((ore1) => {
              if (ore.id != ore1.id) return ore1
            })
            state.player.money += ore.value
          }
        })
      }
    },
    nextImg: (state) => {
      if (state.explosions.length > 0) {
        state.explosions.forEach((explosion) => {
          explosion.img += 1
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
          state.waveCleared.score = state.player.waveShipsDestroyed * 2
          state.waveCleared.waveClearedScore = state.wave.number * 2
          state.waveCleared.total =
            state.waveCleared.score + state.wave.number * 2
        }
        if (state.waveCleared.timer <= 0) {
          state.player.score += state.waveCleared.total
          state.player.money += state.waveCleared.total
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
    openShop: (state) => {
      if (state.gameSean === 'game') {
        state.gameSean = 'shop'
      } else if (state.gameSean === 'shop') {
        state.gameSean = 'game'
      }
    },
    CheckShop: (state) => {
      if (state.gameSean !== 'shop') return
      state.shopItems.forEach((item) => {
        if (state.player.money >= item.cost) {
          item.canBuy = true
        } else {
          item.canBuy = false
        }
      })
    },
    buyItem: (state, { payload }) => {
      if (state.gameSean !== 'shop') return
      state.shopItems.forEach((item) => {
        if (item.name === payload) {
          if (item.name === 'missiles') {
            if (state.player.money >= item.cost) {
              if (item.level === 5) {
                item.maxed = true
              } else {
                if (item.level === 0) {
                  state.player.money -= item.cost
                  item.level++
                  item.cost += 100
                } else {
                  item.level++
                  item.damage = Math.floor(item.damage * 1.5)
                  item.fireRate = Math.floor(item.fireRate * 0.9)
                  state.player.money -= item.cost
                  item.cost = Math.floor(item.cost * 1.5)
                }
              }
            }
          }
        }
      })
    },
  },
})
export const {
  calcOreMovement,
  calcPlayerMovement,
  summonProjectile,
  deleteProjectile,
  calcProjectileMovement,
  summonEnemys,
  calcEnemyMovement,
  checkColision,
  checkColisionWithOre,
  deleteExplosion,
  nextImg,
  checkWaveCleared,
  oneSecondTimer,
  checkGameOver,
  startGame,
  pauseGame,
  homeSean,
  checkProjectileOutOfScreen,
  openShop,
  setTimeNow,
  summonMissile,
  calcMissileMovement,
  CheckMissileOutOfScreen,
  CheckShop,
  buyItem,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer

function calcSpawnRate(wave) {
  const chance = Math.floor(Math.random() * 125) + 1
  if (wave < 3) {
    return 1
  } else if (wave >= 3 && wave < 6) {
    if (chance < 30) {
      return 2
    } else {
      return 1
    }
  } else if (wave >= 6 && wave < 11) {
    if (chance < 20) {
      return 3
    } else if (chance < 50 && chance >= 20) {
      return 2
    } else {
      return 1
    }
  } else if (wave >= 11 && wave < 15) {
    if (chance < 10) {
      return 4
    } else if (chance < 30 && chance >= 10) {
      return 3
    } else if (chance < 60 && chance >= 30) {
      return 2
    } else {
      return 1
    }
  } else if (wave >= 15) {
    if (chance < 5) {
      return 5
    } else if (chance < 15 && chance >= 5) {
      return 4
    } else if (chance < 35 && chance >= 15) {
      return 3
    } else if (chance < 65 && chance >= 35) {
      return 2
    } else {
      return 1
    }
  }
}
function goToRandomPosition(currentPos) {
  let x = 0 //Math.floor(Math.random() * 950)
  let y = 0 //350 + Math.floor(Math.random() * 250)
  if (currentPos.x >= 950 / 2) {
    x = Math.floor(Math.random() * 400)
  } else {
    x = 950 - 400 + Math.floor(Math.random() * 400)
  }
  if (currentPos.y >= 700 / 2 + 350 / 2) {
    y = 350 + Math.floor(Math.random() * 100)
  } else {
    y = 600 + Math.floor(Math.random() * 50)
  }

  return { x, y }
}
