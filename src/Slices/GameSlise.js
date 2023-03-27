import { createSlice } from '@reduxjs/toolkit'

const playerShipSpeed = 3
const enemyShipSpeed = -1.5
const projectileSpeed = 5
const fireRate = 300
let lastFire = 0
const enemySpawnRate = 1000
let lastSpawn = 0
let timer = 1000
let lastTimer = 0
const initialState = {
  player: {
    x: 475,
    y: 175,
    score: 0,
    helth: 100,
  },
  projectiles: [],
  projIds: 0,
  enemIds: 0,
  explosionIds: 0,
  onCd: false,
  enemys: [],
  explosions: [],
  wave: {
    number: 1,
    enemys: 3,
    reward: Math.floor(Math.random() * 20),
  },
  enemySummoned: 0,
  waveCleared: {
    cleared: false,
    enemyElemenated: 0,
    score: 0,
    timer: 5,
  },
}
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    calcPlayerMovement: (state, { payload }) => {
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
      if (performance.now() - lastTimer > timer) {
        lastTimer = performance.now()
        if (state.waveCleared.cleared) {
          state.waveCleared.timer--
        }
      }
    },
    summonProjectile: (state) => {
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
    deleteProjectile: (state, { payload }) => {
      const tempProj = state.projectiles.filter((proj) => {
        if (proj.id != payload) return proj
      })
      state.projectiles = [...tempProj]
    },
    projectileMoveUp: (state) => {
      if (state.projectiles.length > 0) {
        state.projectiles.forEach((proj) => {
          proj.y += projectileSpeed
        })
      }
    },
    summonEnemys: (state) => {
      if (
        performance.now() - lastSpawn > enemySpawnRate &&
        state.enemySummoned < state.wave.enemys
      ) {
        state.enemys.push({
          x: Math.floor(Math.random() * 950),
          y: 650,
          id: state.enemIds,
        })
        state.enemIds++
        state.enemySummoned++
        lastSpawn = performance.now()
      }
    },

    enemyMoveDown: (state) => {
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          enem.y += enemyShipSpeed
          if (enem.y < -100) {
            enem.y = 650
            enem.x = Math.floor(Math.random() * 950)
          }
        })
      }
    },
    checkColision: (state) => {
      if (state.enemys.length > 0 && state.projectiles.length > 0) {
        state.enemys.forEach((enem) => {
          state.projectiles.forEach((proj) => {
            if (
              proj.x >= enem.x &&
              proj.x + 8 <= enem.x + 40 &&
              proj.y <= enem.y &&
              proj.y - 20 >= enem.y - 50
            ) {
              state.player.score++
              state.enemys = state.enemys.filter((enemy) => {
                if (enemy.id != enem.id) return enemy
              })
              state.projectiles = state.projectiles.filter((projectile) => {
                if (proj.id != projectile.id) return projectile
              })
              state.explosions.push({
                x: enem.x - 20,
                y: enem.y + 20,
                id: state.explosionIds,
                img: 1,
              })
            }
          })
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
    },
    deleteExplosion: (state, { payload }) => {
      const tempExplosion = state.explosions.filter((explosion) => {
        if (explosion.id != payload) return explosion
      })
      state.explosions = [...tempExplosion]
    },
    checkWaveCleared: (state) => {
      if (
        state.enemys.length === 0 &&
        state.enemySummoned === state.wave.enemys
      ) {
        if (!state.waveCleared.cleared) {
          state.waveCleared.cleared = true
          state.waveCleared.enemyElemenated = state.wave.enemys
          state.waveCleared.score = state.wave.reward
        }
        if (state.waveCleared.timer <= 0) {
          console.log('next wave')
          state.player.score += state.wave.reward
          state.wave.number++
          state.wave.enemys += 1
          state.wave.reward += Math.floor(Math.random() * 20)
          state.waveCleared.cleared = false
          state.waveCleared.enemyElemenated = 0
          state.waveCleared.score = 0
          state.waveCleared.timer = 5
          state.enemySummoned = 0
        }
      }
    },
  },
})
export const {
  calcPlayerMovement,
  summonProjectile,
  deleteProjectile,
  projectileMoveUp,
  summonEnemys,
  enemyMoveDown,
  checkColision,
  deleteExplosion,
  nextImg,
  checkWaveCleared,
  oneSecondTimer,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer
