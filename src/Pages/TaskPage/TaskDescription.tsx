import { FaCheck, FaTrashAlt } from "react-icons/fa";
import {
  useDeletedTaskMutation,
  useUpdateTaskMutation,
} from "../../Redux/feature/api/baseApi";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { socket } from "../../socketio/socketio";

interface Task {
  assign: {
    _id: string;
    email: string;
    name: string;
  };
  date: string;
  description: string;
  status: string;
  taskName: string;
}
function TaskDescription({
  tasks,
  id,
  email,
  isAdmin,
}: {
  tasks: Task[];
  id: any;
  isAdmin: boolean;
  email: string;
}) {
  //console.log(tasks,'pp') https://task-management-system-server-tau.vercel.app

  const [
    updateTask,
    { data, isSuccess: isUpdateSuccess, isError: isUpdateError },
  ] = useUpdateTaskMutation();
  const [deleteTask, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =  
    useDeletedTaskMutation();

  useEffect(() => {

    if(isDeleteSuccess){
      socket.emit('taskDeleted','delete')
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task deleted Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    if (isUpdateSuccess && (data?.updatedTask?.modifiedCount==1)) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task update Successful",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    if (isUpdateSuccess && (data?.updatedTask?.modifiedCount==0)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Task already Deleted by Admin",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    if (isUpdateError) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    if (isDeleteError) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [isUpdateError, isUpdateSuccess, isDeleteError, isDeleteSuccess,data]);

  return (
    <>
      {tasks.length == 0 ? (
        <h4 style={{ marginTop: "10px", marginLeft: "5px" }}>
          No task to show
        </h4>
      ) : (
        <>
          <>
            {tasks?.map((task, index) => {
              return (
                <div key={index} className="task-description">
                  <h3>{task.taskName}</h3>
                  <div className="description">
                    <p>{task?.description}</p>
                  </div>
                  <p className="assignTo">
                    Assign to- <span>{task.assign.name}</span>
                  </p>
                  <div className="time">
                    <h4>{task.date}</h4>{" "}
                    <div className="task-action2">
                      <button
                        style={
                          isAdmin ? { display: "flex" } : { display: "none" }
                        }
                        onClick={() =>
                          deleteTask({
                            id: id,
                            taskName: task.taskName,
                            description: task.description,
                          })
                        }
                        className="btn1"
                      >
                        <FaTrashAlt />
                      </button>{" "}
                      <button
                        style={
                          email == task.assign.email &&
                          task.status !== "completed"
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                        onClick={() =>
                          updateTask({
                            taskName: task.taskName,
                            status:
                              task.status == "pending"
                                ? "inProgress"
                                : "completed",
                            id: id,
                            description: task.description,
                          })
                        }
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        </>
      )}
    </>
  );
}

export default TaskDescription;
