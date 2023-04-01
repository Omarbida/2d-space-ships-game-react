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
    value: 2,
    img: 'ore2',
  },
  {
    name: 'ore3',
    value: 3,
    img: 'ore3',
  },
  {
    name: 'ore4',
    value: 4,
    img: 'ore4',
  },
  {
    name: 'ore5',
    value: 5,
    img: 'ore5',
  },
]

const initialState = {
  gameSean: 'home',
  player: {
    ShipSpeed: 3,
    fireRate: 500,
    x: 475,
    y: 175,
    score: 0,
    money: 0,
    health: 100,
    waveShipsDestroyed: 0,
    totalShipsDestroyed: 0,
    xVelocity: 0.1,
    yVelocity: 0.1,
    lastProjectile: 0,
    lastMissile: 0,
    burstFire: 1,
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
  enemyProjectiles: [],
  playerMissiles: [],
  shopItems: {
    missiles: {
      name: 'missiles',
      level: 0,
      cost: 100,
      damage: 5,
      fireRate: 8000,
      lable: 'missile.png',
      canBuy: false,
      maxed: false,
      buy: function (state) {
        if (state.player.money >= this.cost) {
          if (this.level === 5) {
            this.maxed = true
          } else {
            if (this.level === 0) {
              state.player.money -= this.cost
              this.level++
              this.cost += 50 + (50 * this.level) / 2
            } else {
              this.level++
              this.damage += 2
              this.fireRate -= 1500
              state.player.money -= this.cost
              this.cost = Math.floor(this.cost * 1.5)
            }
          }
        }
      },
      checkCanBuy: function (state) {
        if (state.player.money >= this.cost) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    shipFireRate: {
      name: 'shipFireRate',
      level: 1,
      cost: 5,
      damage: 1,
      fireRate: 500,
      lable: 'Upgrade Fire Rate.',
      canBuy: false,
      maxed: false,
      buy: function (state) {
        if (state.player.money >= this.cost) {
          if (this.level === 0) {
            state.player.money -= this.cost
            this.level++
            this.cost += 50 + (50 * this.level) / 2
          } else {
            this.level++
            this.fireRate -= 3
            state.player.money -= this.cost
            this.cost = Number(this.cost * 1.1).toFixed(2)
            state.player.fireRate = this.fireRate
            if (this.fireRate <= 200) {
              state.player.burstFire += 1
              this.fireRate = 300
              state.player.fireRate = 300
            }
          }
        }
      },
      checkCanBuy: function (state) {
        if (state.player.money >= this.cost) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    ShipRepair: {
      name: 'ShipRepair',
      cost: 100,
      lable: 'Repair Ship.',
      canBuy: false,
      buy: function (state) {
        if (state.player.money >= this.cost) {
          state.player.money -= this.cost
          state.player.health = 100
        }
      },
      checkCanBuy: function (state) {
        if (state.player.money >= this.cost && state.player.health < 100) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
      calcCost: function (state) {
        const missingHealth = 100 - state.player.health
        this.cost = missingHealth * 0.7 + 100
      },
    },
  },
  timeNow: 0,
  damaged: false,
  enemySummoned: 0,
  lastMissileSide: 'left',
  deltaTime: 0,
  lastTimeNow: 0,
}
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTimeNow: (state) => {
      if (state.gameSean !== 'game') return
      state.timeNow = performance.now()
      //deltatime
      state.deltaTime = state.timeNow - state.lastTimeNow
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
        for (let i = 0; i < state.player.burstFire; i++) {
          let tempX = 0
          let tempY = 0
          if (i === 0) {
            tempX = state.player.x + 15
            tempY = state.player.y + 50
          } else {
            if (i % 2 === 0) {
              tempX = state.player.x + 15 - Math.floor(i / 2) * 15
            } else {
              tempX = state.player.x + 15 + (Math.floor(i / 2) + 1) * 15
            }
            tempY = Math.floor(i / 2) * 5 + state.player.y + 40
          }
          state.projectiles.push({
            x: tempX,
            y: tempY,
            id: window.crypto.randomUUID(),
          })
        }
        state.player.lastProjectile = state.timeNow
      }
    },
    summonMissile: (state) => {
      if (state.gameSean !== 'game') return
      if (state.shopItems.missiles.level === 0) return
      if (state.enemys.length === 0) return
      let targetSide = 0
      let spawnSide = 0
      if (state.lastMissileSide === 'left') {
        targetSide = -50
        spawnSide = -10
        state.lastMissileSide = 'right'
      } else {
        targetSide = 50
        spawnSide = 30
        state.lastMissileSide = 'left'
      }
      const targetX = state.player.x + targetSide
      const targetY = state.player.y + 50
      const rotation = Math.atan2(
        targetY - state.player.y,
        targetX - state.player.x,
      )
      if (
        state.timeNow - state.player.lastMissile >
        state.shopItems.missiles.fireRate
      ) {
        state.playerMissiles.push({
          x: state.player.x + spawnSide,
          y: state.player.y,
          id: window.crypto.randomUUID(),
          damage: state.shopItems.missiles.damage,
          target: {
            x: targetX,
            y: targetY,
          },
          rotation: rotation,
          missileSpeed: 10,
          preparingToFly: true,
          lastUpdate: state.timeNow,
          velocityX: 0.1,
          velocityY: 0.1,
          drag: 1,
          acceleration: 100,
          maxSpeed: 3000,
          maxDistance: 0,
          missileVelocity: 0.5,
          maxAcceleration: 500,
          maxDrag: 2.5,
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
            targetX = state.enemys[0].x + 15
            targetY = state.enemys[0].y
          } else {
            targetX = missile.target.x
            targetY = missile.target.y + 1000
          }

          const deltaTime = (state.timeNow - missile.lastUpdate) / 1000
          missile.lastUpdate = state.timeNow

          // calculate the distance between the missile and the target
          const dx = targetX - missile.x
          const dy = targetY - missile.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // calculate the missile's angle to the target
          const angleToTarget = Math.atan2(dy, dx)

          // calculate the missile's current speed and direction
          missile.velocityX +=
            Math.cos(angleToTarget) * missile.acceleration * deltaTime
          missile.velocityY +=
            Math.sin(angleToTarget) * missile.acceleration * deltaTime

          // apply drag to the missile's velocity
          missile.velocityX *= 1 - missile.drag * deltaTime
          missile.velocityY *= 1 - missile.drag * deltaTime

          // calculate the missile's position based on its velocity
          missile.x += missile.velocityX * deltaTime
          missile.y += missile.velocityY * deltaTime

          // calculate the missile's angle based on its velocity
          missile.rotation =
            Math.atan2(missile.velocityY, missile.velocityX) + Math.PI / 2

          // adjust the missile's speed based on its distance to the target
          const speedRatio = Math.min(distance / missile.maxDistance, 1)
          missile.velocityX *= speedRatio
          missile.velocityY *= speedRatio

          // update the missile's acceleration based on its distance to the target
          missile.acceleration = missile.maxAcceleration * speedRatio

          // update the missile's drag based on its distance to the target
          missile.drag = missile.maxDrag * speedRatio

          // update the missile's max distance based on its current speed
          missile.maxDistance =
            (missile.maxSpeed * missile.missileVelocity) / missile.acceleration

          // adjust the missile's velocity based on its max speed
          if (
            missile.velocityX * missile.velocityX +
              missile.velocityY * missile.velocityY >
            missile.maxSpeed * missile.maxSpeed
          ) {
            const angle = Math.atan2(missile.velocityY, missile.velocityX)
            missile.velocityX = Math.cos(angle) * missile.maxSpeed
            missile.velocityY = Math.sin(angle) * missile.maxSpeed
          }

          // update the missile's position and rotation
          missile.x += missile.velocityX * deltaTime
          missile.y += missile.velocityY * deltaTime
          missile.rotation = Math.atan2(
            missile.velocityX * deltaTime,
            missile.velocityY * deltaTime,
          )
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
          max:
            spawnType + Math.floor(state.wave.number / 5) * (spawnType * 0.1),
          current:
            spawnType + Math.floor(state.wave.number / 5) * (spawnType * 0.1),
          percentage: 100,
        }
        const projectile = {
          speed: 3,
          damage: spawnType * 4,
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
          fireRate: 1800 * Math.pow(0.9, spawnType - 1),
          speed: spawnType * 0.2,
          oreDrop: spawnType,
          multipleOreChance: calcSpawnRate(7),
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
            // enemy X player projectile
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
                  for (let i = 0; i < enem.multipleOreChance; i++) {
                    state.ores.push({
                      id: window.crypto.randomUUID(),
                      x: enem.x + 10 + (1 - i) * 10 + (Math.random() * 20 - 10),
                      y: enem.y + 10 + (1 - i) * 10 + (Math.random() * 20 - 10),
                      oreVelocity: (i + 1) / 10,
                      ...oreTypes[enem.oreDrop - 1],
                    })
                  }

                  state.player.waveShipsDestroyed++
                  state.player.totalShipsDestroyed++
                  state.player.score += enem.score
                }
              }
            })
          }
          // enemy X player Missile
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
                  for (let i = 0; i < enem.multipleOreChance; i++) {
                    state.ores.push({
                      id: window.crypto.randomUUID(),
                      x: enem.x + i * 5 + 10,
                      y: enem.y + i * 5 + 10,
                      oreVelocity: (i + 1) / 10,
                      ...oreTypes[enem.oreDrop - 1],
                    })
                  }
                  state.player.waveShipsDestroyed++
                  state.player.totalShipsDestroyed++
                  state.player.score += enem.score
                }
              }
            })
          }
          // enemy X player
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
            state.player.health -= 10
            state.damaged = 100
            state.enemys = state.enemys.filter((enemy) => {
              if (enemy.id != enem.id) return enemy
            })
            state.explosions.push({
              x: enem.x - 20,
              y: enem.y + 20,
              id: window.crypto.randomUUID(),
              img: 1,
            })
          }
        })
      }
      // enemy projectile X player
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
            state.player.health -= proj.damage
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
      state.shopItems.missiles.checkCanBuy(state)
      state.shopItems.shipFireRate.checkCanBuy(state)
      state.shopItems.ShipRepair.checkCanBuy(state)
      state.shopItems.ShipRepair.calcCost(state)
    },
    buyItem: (state, { payload }) => {
      if (state.gameSean !== 'shop') return
      state.shopItems[payload].buy(state)
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
