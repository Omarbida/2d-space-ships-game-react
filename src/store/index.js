import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { gameReducer } from '../Slices/GameSlise'

const combinedReducers = combineReducers({
  game: gameReducer,
})

export const store = configureStore({
  reducer: combinedReducers,
})
