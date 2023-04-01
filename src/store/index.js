import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import { gameReducer } from '../Slices/GameSlise'

const combinedReducers = combineReducers({
  game: gameReducer,
})

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
