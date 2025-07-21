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

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
