import { createSlice } from '@reduxjs/toolkit'

const shipSpeed = 2
const projectileSpeed = 5
const fireRate = 200
let lastFire = 0
const initialState = {
  player: {
    x: 475,
    y: 175,
    score: 0,
  },
  projectiles: [],
  projIds: 0,
  onCd: false,
}
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    calcPlayerMovement: (state, { payload }) => {
      if (payload.exis === 'horizontal') {
        state.player.x += shipSpeed * payload.direction
        if (state.player.x >= 950) state.player.x = 950
        if (state.player.x <= 0) state.player.x = 0
      } else {
        state.player.y += shipSpeed * payload.direction
        if (state.player.y >= 350) state.player.y = 350
        if (state.player.y <= 0) state.player.y = 0
      }
    },
    summonProjectile: (state) => {
      if (performance.now() - lastFire > fireRate) {
        state.projectiles.push({
          x: state.player.x + 20,
          y: state.player.y + 70,
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
  },
})
export const {
  calcPlayerMovement,
  summonProjectile,
  deleteProjectile,
  projectileMoveUp,
  calcCd,
} = gameSlice.actions
export const gameReducer = gameSlice.reducer

export const fire = () => {
  return (dispatch, getState) => {
    dispatch(summonProjectile())
  }
}
