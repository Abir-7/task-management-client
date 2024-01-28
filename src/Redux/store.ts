import { configureStore } from '@reduxjs/toolkit'

import userInfoSlice from './feature/userInfo/userInfoSlice'
import { api } from './feature/api/baseApi'
import  modal_Slide_Slice from './feature/modal&SlideSlice/modal&Slide_Slice'
import { setupListeners } from '@reduxjs/toolkit/query'


export const store = configureStore({
  reducer: {
    modalStatus:modal_Slide_Slice,
    userInfo:userInfoSlice,
    [api.reducerPath]:api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch