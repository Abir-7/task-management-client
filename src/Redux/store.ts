import { configureStore } from '@reduxjs/toolkit'
import taskProgressSlice from './feature/taskProgress/taskProgressSlice'
import userInfoSlice from './feature/userInfo/userInfoSlice'
import { api } from './feature/api/baseApi'

export const store = configureStore({
  reducer: {
    taskProgess:taskProgressSlice,
    userInfo:userInfoSlice,
    [api.reducerPath]:api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch