export interface Task {
  task_name: string;
  description: string;
  date: string;
  assign: string;
  _id: string;
  __v: number;
}

export interface getAllTask{
  allTask: Task[];
}


export interface addTaskData{task_name: string;description: string;date:string;assign: string;}

export interface addTaskResponse {
  message: string;
  addedTask: {
    task_name: string;
    description: string;
    date: string;
    assign: string;
    _id: string;
    __v: number;
  };
}
