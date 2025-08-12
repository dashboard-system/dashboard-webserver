import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './slices/global/global-slice'
import statusReducer from './slices/status/status-slice'
import uciReducer from './slices/uci/uci-slice'
import flightDataReducer from './slices/flightDataSlice'
import { apiSlice } from './slices/dogs/dogs-api-slice'
import { uciApiSlice } from './slices/uci/uci-api-slice'
import { authApiSlice } from './slices/auth/auth-api-slice'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    status: statusReducer,
    uci: uciReducer,
    flightData: flightDataReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [uciApiSlice.reducerPath]: uciApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      apiSlice.middleware, 
      uciApiSlice.middleware,
      authApiSlice.middleware
    )
  },
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
