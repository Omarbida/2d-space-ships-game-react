import { createSlice } from '@reduxjs/toolkit'

const playerShipSpeed = 2
const enemyShipSpeed = -2
const projectileSpeed = 5
const fireRate = 200
let lastFire = 0
const enemySpawnRate = 1000
let lastSpawn = 0
const initialState = {
  player: {
    x: 475,
    y: 175,
    score: 0,
  },
  projectiles: [],
  projIds: 0,
  enemIds: 0,
  onCd: false,
  enemys: [],
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
    calcCd: (state, { payload }) => {
      state.onCd = payload
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
        state.enemys.length < 3
      ) {
        state.enemys.push({
          x: Math.floor(Math.random() * 950),
          y: 650,
          id: state.enemIds,
        })
        state.enemIds++
        lastSpawn = performance.now()
      }
    },
    deleteEnemys: (state, { payload }) => {
      const tempEnem = state.enemys.filter((enem) => {
        if (enem.id != payload) return enem
      })
      state.enemys = [...tempEnem]
    },
    enemyMoveDown: (state) => {
      if (state.enemys.length > 0) {
        state.enemys.forEach((enem) => {
          enem.y += enemyShipSpeed
        })
      }
    },
  },
})
export const {
  calcPlayerMovement,
  summonProjectile,
  deleteProjectile,
  projectileMoveUp,
  calcCd,
  summonEnemys,
  deleteEnemys,
  enemyMoveDown,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer

export const fire = () => {
  return (dispatch, getState) => {
    dispatch(summonProjectile())
  }
}
