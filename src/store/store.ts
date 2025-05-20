import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter/counter-slice";
import globalReducer from "./slices/global/global-slice";
import { apiSlice } from "./slices/dogs/dogs-api-slice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
