import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addTaskData, addTaskResponse, getAllTask } from "./interface";


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
  }),
  endpoints: (build) => ({
    addTask: build.mutation<addTaskResponse,  addTaskData>({
      query: (data) => ({
        url: `addTask`,
        method: "POST",
        body: data,
      }),
    }),
    getAllTask: build.query<getAllTask, void>({
      query: () =>({ 
        url:`getAllTask`
    }),
    }),
  }),
});

export const { useGetAllTaskQuery,useAddTaskMutation } = api;
