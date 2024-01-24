import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetAllProject, addProject, addProjectResponse, addTaskData, addTaskResponse, allUser, allUserChat, createConnection, createConnectionResponse, deleteTaskData, deleteTaskResponse, getAllTask, getConnectionResponse, getConnectionStatusResponse, getMessageResponse, getPostMessageResponse, updateProject, updateProjectResponse, updateTaskData, updateTaskResponse } from "./interface";
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = `Bearer ${localStorage.getItem("access-token")}`;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  tagTypes:['newProjects','newTask','connection','msg']
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
      //invalidatesTags:['newTask']
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
    createConnection: build.mutation<createConnectionResponse, createConnection>({
      query: (data) => ({
        url: '/createConnection',
        method:'POST',
        body:data
      }),
      invalidatesTags:['connection']
    }),
    getConnection: build.query<getConnectionResponse, {email:string}>({
      query: (data) => ({
        url: `/geteConnection/${data.email}`
      }),
      providesTags:['connection'],
    }),
    updateConnectionStatus: build.mutation<getConnectionStatusResponse, {id:string}>({
      query: (data) => ({
        url: `/updateConnectionStatus/${data.id}`,
        method:'PUT',
        body:{status:'accepted'}
      }),
      invalidatesTags:['connection']
    }),
    postMessage: build.mutation<getPostMessageResponse, {connect_Id:string,msgData:{email:String,message:String}}>({
      query: (data) => ({
        url:`/postMsg`,
        method:'POST',
        body:data
      }),
      invalidatesTags:['msg']
    }),
    getMessageById:build.query<getMessageResponse,{cId:string}>({
     query:(data) =>({
      url:`getAllMessage/${data.cId}`
     }),
     providesTags:['msg']
    }),
    getUserChat: build.query<allUserChat, string>({
      query: (email) => ({
        url: `/getAllUserChat/${email}`,
      }),
      providesTags:['connection']
    })
  }),
});

export const { useGetAllTaskQuery, useAddTaskMutation, useGetAllUserQuery,useAddProjectMutation,useLazyGetAllProjectQuery,useGetAllProjectQuery,useUpdateTaskMutation,useDeletedTaskMutation,useUpdateProjectMutation,useCreateConnectionMutation,useGetConnectionQuery,useUpdateConnectionStatusMutation,usePostMessageMutation,useGetMessageByIdQuery,useGetUserChatQuery} = api;
