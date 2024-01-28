import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface iState{
    isModal_Home_true:boolean,
    isModal_Task_true:boolean,


}

const initialState:iState = {
    isModal_Home_true:false,
    isModal_Task_true:false,

};

export const modal_Slide_Slice = createSlice({
  name: "modal_Slide_Status",
  initialState,
  reducers: {
    change_Modal_Home_Status: (state, action: PayloadAction<boolean>) => {
      state.isModal_Home_true = action.payload;
    },
    change_Modal_Task_Status: (state, action: PayloadAction<boolean>) => {
        state.isModal_Task_true = action.payload;
      },
  },
});
export const {  change_Modal_Home_Status,  change_Modal_Task_Status } = modal_Slide_Slice.actions

export default modal_Slide_Slice.reducer