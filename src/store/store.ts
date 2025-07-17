import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './slices/global/global-slice'
import statusReducer from './slices/status/status-slice'
import uciReducer from './slices/uci/uci-slice'
import { apiSlice } from './slices/dogs/dogs-api-slice'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    status: statusReducer,
    uci: uciReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware)
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
