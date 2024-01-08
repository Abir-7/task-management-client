import { configureStore } from '@reduxjs/toolkit'
import taskProgressSlice from './feature/taskProgress/taskProgressSlice'

export const store = configureStore({
  reducer: {
    taskProgess:taskProgressSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch