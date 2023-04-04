import { createSlice } from '@reduxjs/toolkit'

const projectileSpeed = 8
const enemySpawnRate = 700 //ms
const enemysGoToRate = 3000 //ms
const enemyBaseFireRate = 2500 //ms
const enemyHealthGrouth = 1.1
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

  waveCleared: {
    cleared: false,
    enemyElemenated: 0,
    waveClearedScore: 0,
    score: 0,
    timer: 5,
  },
  wave: {
    number: 1,
    enemys: 20,
  },
  ores: [],
  projectiles: [],
  enemys: [],
  explosions: [],
  enemyProjectiles: [],
  playerMissiles: [],
  squad: [],
  shopItems: {
    page: 1,
    maxPages: 3,
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
      lable: '+2% Fire Rate',
      canBuy: false,
      maxed: false,
      buy: function (state) {
        if (state.player.money >= this.cost) {
          if (this.level === 0) {
            state.player.money -= this.cost
            this.level++
            this.cost += this.cost * 0.01
          } else {
            this.level++
            this.fireRate = this.fireRate * 0.98
            state.player.money -= this.cost
            this.cost = Number(this.cost * 1.02).toFixed(2)
            if (this.level < 50) {
              state.player.fireRate = state.player.fireRate * 0.98
            }
            if (this.level % 50 === 0) {
              state.player.burstFire += 2
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
      lable: 'repairShip.png',
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
    shield: {
      name: 'shield',
      cost: 150,
      lable: 'shield.png',
      duration: 10,
      canBuy: false,
      buy: function (state) {
        if (state.player.money >= this.cost) {
          state.player.money -= this.cost
          state.player.shieldActive = this.duration
        }
      },
      checkCanBuy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.player.shieldActive === 0
        ) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    reInforcementsShip1: {
      name: 'Nova Unit',
      x: 0,
      y: 0,
      cost: 1000,
      lable: 'squad/ship1.png',
      ship: 'squad/ship1.png',
      health: {
        max: 70,
        current: 70,
        percentage: 100,
      },
      damage: 1,
      speed: 3,
      fireRate: 1500,
      lastBurstFire: 0,
      lastFire: 0,
      canBuy: false,

      buy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          state.player.money -= this.cost
          state.shopItems.reInforcementsShipActive.current++
          state.squad.push({
            ...this,
            x: 1100,
            y: 100 + Math.random() * 200,
            id: window.crypto.randomUUID(),
          })
        }
      },
      checkCanBuy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    reInforcementsShip2: {
      name: 'Phoenix Squad',
      x: 0,
      y: 0,
      cost: 1300,
      lable: 'squad/ship2.png',
      ship: 'squad/ship2.png',
      health: {
        max: 70,
        current: 70,
        percentage: 100,
      },
      damage: 1,
      speed: 3,
      fireRate: 1000,
      lastBurstFire: 0,
      lastFire: 0,
      canBuy: false,
      buy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          state.player.money -= this.cost
          state.shopItems.reInforcementsShipActive.current++
          state.squad.push({
            ...this,
            x: 1100,

            y: 100 + Math.random() * 200,
            id: window.crypto.randomUUID(),
          })
        }
      },
      checkCanBuy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    reInforcementsShip3: {
      name: 'Shadow Legion',
      x: 0,
      y: 0,
      cost: 1800,
      lable: 'squad/ship3.png',
      ship: 'squad/ship3.png',
      health: {
        max: 100,
        current: 100,
        percentage: 100,
      },
      damage: 2,
      speed: 3,
      fireRate: 500,
      lastBurstFire: 0,
      lastFire: 0,
      canBuy: false,
      buy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          state.player.money -= this.cost
          state.shopItems.reInforcementsShipActive.current++
          state.squad.push({
            ...this,
            x: 1100,
            y: 100 + Math.random() * 200,
            id: window.crypto.randomUUID(),
          })
        }
      },
      checkCanBuy: function (state) {
        if (
          state.player.money >= this.cost &&
          state.shopItems.reInforcementsShipActive.current <
            state.shopItems.reInforcementsShipActive.max
        ) {
          this.canBuy = true
        } else {
          this.canBuy = false
        }
      },
    },
    reInforcementsShipActive: {
      max: 4,
      current: 0,
    },
  },
  damaged: false,
  enemySummoned: 0,
  lastMissileSide: 'left',
  timeNow: 0,
  deltaTime: 0,
  lastTimeNow: 0,
  maxEnemysOnScreen: 5,
  player: {
    ShipSpeed: 3,
    fireRate: 500,
    burstFire: 3,
    x: 475,
    y: 175,
    score: 0,
    money: 10000,
    health: 100,
    waveShipsDestroyed: 0,
    totalShipsDestroyed: 0,
    lastProjectile: 0,
    lastMissile: 0,

    shieldActive: 0,
    maxSpeed: 10, // maximum speed the player can reach
    acceleration: 0.1, // rate at which the player accelerates
    drag: 0.97, // rate at which the player slows down when not accelerating
    vx: 0, // current horizontal velocity
    vy: 0, // current vertical velocity
    ax: 0, // current horizontal acceleration
    ay: 0, // current vertical acceleration
    deceleration: 1.5, // rate at which the player slows down when not accelerating
  },
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
    calcDeltaTime: (state) => {
      if (state.gameSean !== 'game') return
      state.deltaTime = (state.timeNow - state.lastTimeNow) / 1000
    },
    setPlayerForces: (state, { payload }) => {
      if (state.gameSean !== 'game') return
      const player = state.player
      const exis = payload.exis
      const direction = payload.direction
      const maxSpeed = player.maxSpeed
      const acceleration =
        payload.type === 'move' ? player.acceleration : player.deceleration
      const drag = player.drag

      if (exis === 'horizontal') {
        player.ax = acceleration * direction
        player.ax = Math.min(maxSpeed, Math.max(-maxSpeed, player.ax))
        player.ax *= drag

        if (player.x < 0) {
          player.ax = Math.max(0, player.ax)
        } else if (player.x > 950) {
          player.ax = Math.min(0, player.ax)
        }
      } else {
        player.ay = acceleration * direction
        player.ay = Math.min(maxSpeed, Math.max(-maxSpeed, player.ay))
        player.ay *= drag

        if (player.y < 0) {
          player.ay = Math.max(0, player.ay)
        } else if (player.y > 350) {
          player.ay = Math.min(0, player.ay)
        }
      }
    },
    calcPlayerPosition: (state) => {
      if (state.gameSean !== 'game') return
      const player = state.player

      player.vx += player.ax
      player.vy += player.ay

      player.vx = Math.min(
        player.maxSpeed,
        Math.max(-player.maxSpeed, player.vx),
      )
      player.vy = Math.min(
        player.maxSpeed,
        Math.max(-player.maxSpeed, player.vy),
      )

      player.vx *= player.drag
      player.vy *= player.drag

      player.x += player.vx
      player.y += player.vy

      if (player.x < 0) {
        player.x = 0
        player.vx = 0
      } else if (player.x > 950) {
        player.x = 950
        player.vx = 0
      }

      if (player.y < 0) {
        player.y = 0
        player.vy = 0
      } else if (player.y > 350) {
        player.y = 350
        player.vy = 0
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
        if (state.player.shieldActive !== 0) {
          state.player.shieldActive--
        }
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
            spawnType +
            spawnType * enemyHealthGrouth * (state.wave.number - 1) * 0.1,
          current:
            spawnType +
            spawnType * enemyHealthGrouth * (state.wave.number - 1) * 0.1,
          percentage: 100,
        }
        const projectile = {
          speed: 3 + spawnType * 0.5,
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
          with: 40,
          height: 60,
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
          goToRate: enemysGoToRate,
          id: window.crypto.randomUUID(),
          lastFire: 0,
          enemVelocityX: 0.2,
          enemVelocityY: 0.2,
          health,
          projectile,
          fireRate: enemyBaseFireRate * Math.pow(0.9, spawnType - 1),
          speed: spawnType * 0.2,
          oreDrop: spawnType,
          multipleOreChance: calcSpawnRate(7),
        })
        state.enemySummoned++
        lastSpawn = state.timeNow
      }
    },
    summonProjectile: (state) => {
      if (state.gameSean !== 'game') return
      if (state.timeNow - state.player.lastProjectile > state.player.fireRate) {
        for (let i = 0; i < state.player.burstFire; i++) {
          if (i === 0) continue
          let tempX = 0
          let tempY = 0
          if (i === 0) {
            tempX = state.player.x + 15
            tempY = state.player.y + 50
          } else {
            if (i % 2 === 0) {
              tempX = state.player.x + 15 - Math.floor(i / 2) * 10
            } else {
              tempX = state.player.x + 15 + (Math.floor(i / 2) + 1) * 10
            }
            tempY = -1 * Math.floor(i / 2) * 5 + (state.player.y + 50 + i)
          }
          state.projectiles.push({
            x: tempX,
            y: tempY,
            with: 8,
            height: 20,
            img: 'projectileSMALl.png',
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
      let side = 0

      if (state.lastMissileSide === 'left') {
        side = -22

        state.lastMissileSide = 'right'
      } else {
        side = 42

        state.lastMissileSide = 'left'
      }
      const targetX = state.player.x + side
      const targetY = state.player.y + 100

      if (
        state.timeNow - state.player.lastMissile >
        state.shopItems.missiles.fireRate
      ) {
        state.playerMissiles.push({
          x: state.player.x + side,
          y: state.player.y + 10,
          id: window.crypto.randomUUID(),
          damage: state.shopItems.missiles.damage,
          target: {
            x: targetX,
            y: targetY,
          },
          rotation: 0,
          missileSpeed: 10,
          preparingToFly: true,
          lastUpdate: state.timeNow,
          velocityX: 0.01,
          velocityY: 0.01,
          drag: 1,
          acceleration: 10,
          maxSpeed: 800,
          maxDistance: 0,
          missileVelocity: 0.1,
          maxAcceleration: 500,
          maxDrag: 2,
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
              with: 8,
              height: 20,
              id: window.crypto.randomUUID(),
              ...enem.projectile,
            })
            enem.lastFire = timeNow
          }
        })
      }
    },
    calcSquadMovement: (state) => {
      if (state.gameSean !== 'game') return

      if (state.squad.length > 0) {
        state.squad.forEach((squad, i) => {
          if (state.enemys[i]) {
            const targetX = state.enemys[i].x
            const distance = targetX - squad.x

            if (Math.abs(distance) > squad.speed) {
              const direction = distance / Math.abs(distance)
              squad.x += squad.speed * direction
            } else {
              squad.x = targetX
            }

            //fire
            if (state.timeNow - squad.lastFire > squad.fireRate) {
              state.projectiles.push({
                x: squad.x + 15,
                y: squad.y - 5,
                with: 8,
                height: 20,
                id: window.crypto.randomUUID(),
              })
              squad.lastFire = state.timeNow
            }
          } else if (i > 0 && state.enemys[i - 1]) {
            const targetX = state.enemys[i - 1].x
            const distance = targetX - squad.x

            if (Math.abs(distance) > squad.speed) {
              const direction = distance / Math.abs(distance)
              squad.x += squad.speed * direction
            } else {
              squad.x = targetX
            }

            //fire
            if (state.timeNow - squad.lastFire > squad.fireRate) {
              state.projectiles.push({
                x: squad.x + 15,
                y: squad.y - 5,
                with: 8,
                height: 20,
                id: window.crypto.randomUUID(),
              })
              squad.lastFire = state.timeNow
            }
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
                if (enem.health.current <= 0 && !enem.dead) {
                  state.score += enem.score
                  enem.dead = true
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
                if (enem.health.current <= 0 && !enem.dead) {
                  state.score += enem.score
                  enem.dead = true
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
          if (state.player.shieldActive === 0) {
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
          }
        })
      }
      // enemy projectile X player
      if (state.enemyProjectiles.length > 0) {
        state.enemyProjectiles.forEach((proj) => {
          if (state.player.shieldActive === 0) {
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
              state.player.health -= proj.damage
              state.damaged = 100
              state.enemyProjectiles = state.enemyProjectiles.filter(
                (projectile) => {
                  if (proj.id != projectile.id) return projectile
                },
              )
            }
          } else if (
            ((proj.x >= state.player.x + 5 - 25 &&
              proj.x <= state.player.x + 35 + 25) ||
              (proj.x + 10 >= state.player.x + 5 - 25 &&
                proj.x + 10 <= state.player.x + 35 + 25)) &&
            ((proj.y >= state.player.y + 5 - 25 &&
              proj.y <= state.player.y + 55 + 25) ||
              (proj.y + 10 >= state.player.y + 5 - 25 &&
                proj.y + 10 <= state.player.y + 55 + 25))
          ) {
            state.enemyProjectiles = state.enemyProjectiles.filter(
              (projectile) => {
                if (proj.id != projectile.id) return projectile
              },
            )
          }
          state.squad.forEach((squad) => {
            if (
              ((proj.x >= squad.x + 5 && proj.x <= squad.x + 45) ||
                (proj.x + 10 >= squad.x + 5 && proj.x + 10 <= squad.x + 45)) &&
              ((proj.y >= squad.y + 5 && proj.y <= squad.y + 45) ||
                (proj.y + 10 >= squad.y + 5 && proj.y + 10 <= squad.y + 45))
            ) {
              state.enemyProjectiles = state.enemyProjectiles.filter(
                (projectile) => {
                  if (proj.id != projectile.id) return projectile
                },
              )
              squad.health.current -= proj.damage
              squad.health.percentage = Math.floor(
                (squad.health.current / squad.health.max) * 100,
              )
              if (squad.health.current <= 0) {
                state.explosions.push({
                  x: squad.x - 20,
                  y: squad.y + 20,
                  id: window.crypto.randomUUID(),
                  img: 1,
                })
                state.shopItems.reInforcementsShipActive.current--
                console.log(
                  state.shopItems.reInforcementsShipActive.current,
                  'squad destroyed',
                )
                state.squad = state.squad.filter((squad1) => {
                  if (squad.id != squad1.id) return squad1
                })
              }
            }
          })
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
        state.explosions = state.explosions.filter((explosion) => {
          explosion.img += 1
          return explosion.img <= 25
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
          if (enemySpawnRate >= 700) enemySpawnRate - 10
        }
        if (state.waveCleared.timer <= 0) {
          state.wave.number++
          state.wave.enemys +=
            1 +
            Math.floor(state.wave.number / 5) +
            Math.floor(state.wave.number / 10)
          state.waveCleared.cleared = false
          state.waveCleared.enemyElemenated = 0
          state.waveCleared.score = 0
          state.waveCleared.timer = 5
          state.enemySummoned = 0
          state.player.waveShipsDestroyed = 0
          state.player.score += state.waveCleared.total
          state.player.money += state.waveCleared.total
          state.maxEnemysOnScreen = Math.min(
            Math.max(7 + Math.floor(state.wave.number / 5), 7),
            15,
          )
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
      state.shopItems.shield.checkCanBuy(state)
      state.shopItems.reInforcementsShip1.checkCanBuy(state)
      state.shopItems.reInforcementsShip2.checkCanBuy(state)
      state.shopItems.reInforcementsShip3.checkCanBuy(state)
    },
    buyItem: (state, { payload }) => {
      if (state.gameSean !== 'shop') return
      state.shopItems[payload].buy(state)
    },
    changePage: (state, { payload }) => {
      if (state.gameSean !== 'shop') return
      state.shopItems.page += payload
    },
  },
})
export const {
  calcOreMovement,
  setPlayerForces,
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
  changePage,
  calcPlayerPosition,
  calcDeltaTime,
  calcSquadMovement,
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
