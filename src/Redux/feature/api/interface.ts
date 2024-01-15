export interface Task {
  task_name: string;
  description: string;
  date: string;
  assign: string;
  _id: string;
  __v: number;
}

export interface getAllTask {
  getAllTask: Task[];
  assignedPerson: string[];
  withOutAdmin: [
    {
      _id: string;
      email: string;
      name: string;
      mobile: string;
      role: string;
      __v: number;
    }
  ];
  iscompleted:boolean
}

export interface addProject {
  projectName: string;
  description: string;
  date: string;
  isCompleted: boolean;
  allTask: [];
}
export interface updateProject {
  id:string,
  isCompleted: boolean;
}
export interface updateProjectResponse {
  message: string;
  updatedProject: any;
}

export interface Project {
  projectName: string;
  description: string;
  date: string;
  isCompleted: boolean;
  allTask?: Task[];
  _id: string;
  __v: number;
}

export interface GetAllProject {
  completedProject: Project[];
  pendingProject: Project[];
}

export interface addProjectResponse {
  message: string;
  addedTask: {
    projectName: string;
    description: string;
    date: string;
    isCompleted: boolean;
    allTask: [];
    _id: string;
    __v: number;
  };
}

export interface addTaskData {
  taskData: {
    taskName: string;
    description: string;
    date: string;
    assign: string;
    status: string;
  };
  id: string;
}

export interface addTaskResponse{
  message: string;
  addedTask: object;
}

export interface updateTaskData{
  id: string;
  description: string;
  taskName: string;
  status: string;
}

export interface updateTaskResponse{
  message: string;
  updatedTask: any;
}

export interface deleteTaskData{
  id: string;
  taskName: string;
  description:string
}

export interface deleteTaskResponse{
  message: string;
  deletedTask: any;
}

// get users interface
export interface user {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
  __v: number;
}

export interface allUser {
  withAdmin: user[];
  withOutAdmin: user[];
}
