import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetAllProject, addProject, addProjectResponse, addTaskData, addTaskResponse, allUser, deleteTaskData, deleteTaskResponse, getAllTask, updateProject, updateProjectResponse, updateTaskData, updateTaskResponse } from "./interface";
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://task-management-system-server-tau.vercel.app",
    prepareHeaders: (headers) => {
      const token = `Bearer ${localStorage.getItem("access-token")}`;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  tagTypes:['newProjects','newTask']
  ,
  endpoints: (build) => ({
    addNewUser: build.mutation({
      query: (data) => ({
        url: `/addNewUser`,
        method: "POST",
        body: data,
      })
    }),
    addProject: build.mutation<updateProjectResponse,addProject>({
      query: (data) => ({
        url: `/addProject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:["newProjects"]
    }),
    updateProject: build.mutation<addProjectResponse,updateProject>({
      query: (data) => ({
        url: `/updateProject`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:["newProjects"]
    }),
    getAllProject: build.query<GetAllProject,any>({
      // GetAllProject
      query: () => ({
        url: `/getAllProject`,
      }),
      providesTags:["newProjects"]
    }),

    addTask: build.mutation<addTaskResponse, addTaskData>({
      query: (data) => ({
        url: `/addTask`,
        method: "POST",
        body: data,
      }),
      invalidatesTags:['newTask']
    }),
    updateTask: build.mutation<updateTaskResponse, updateTaskData>({
      query: (data) => ({
        url: `/updateTask`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:['newTask']
    }),
    deletedTask: build.mutation<deleteTaskResponse, deleteTaskData>({
      query: (data) => ({
        url: `/deleteTask`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags:['newTask']
    }),
    getAllTask: build.query<getAllTask, any>({
      query: ({id}) => ({
        url: `/getAllTask/${id}`,

      }),
      providesTags:['newTask'],

    }),
    getAllUser: build.query<allUser, void>({
      query: () => ({
        url: '/getAllUser',
      }),
    }),
  }),
});

export const { useGetAllTaskQuery, useAddTaskMutation, useGetAllUserQuery,useAddProjectMutation,useLazyGetAllProjectQuery,useGetAllProjectQuery,useUpdateTaskMutation,useDeletedTaskMutation,useUpdateProjectMutation } = api;
