import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface iState{
    status:string
}

const initialState:iState = {
  status: "sss",
};

export const taskProgessSlice = createSlice({
  name: "taskProgress",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
});
export const { changeStatus } = taskProgessSlice.actions

export default taskProgessSlice.reducer