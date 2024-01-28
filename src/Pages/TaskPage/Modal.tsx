import { memo, useEffect } from "react";
import { useAddTaskMutation } from "../../Redux/feature/api/baseApi";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { change_Modal_Task_Status } from "../../Redux/feature/modal&SlideSlice/modal&Slide_Slice";
import Swal from "sweetalert2";

interface user {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  role: string;
  __v: number;
}

interface showModal {
  isModal_Task_true: boolean;
  user: user[];
  id:any
}

interface Inputs {
  taskName: string;
  description: string;
  date: string;
  assign: string;
}

function Modal({ isModal_Task_true, user,id }: showModal) {
  const dispatch = useDispatch();
  const [addTasks, { isSuccess:isAddSuccess,isError:isAddError }] = useAddTaskMutation();

  useEffect(()=>{
    if(isAddSuccess){
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Task successfully added",
        showConfirmButton: false,
        timer: 1500,
      })
    }
    if(isAddError){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  },[isAddSuccess,isAddError])

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    //console.log(data, "gg");
    addTasks({taskData:{ ...data, status: "pending" },id:id});
    dispatch(change_Modal_Task_Status(!isModal_Task_true));
    reset();
  };

  return (
    <div className="modal">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="" action="">
        <div className="form-section">
          <div>
            <label htmlFor="">Name</label> <br />
            <input {...register("taskName", { required: true })} type="text" />
            {errors.taskName && (
              <span className="err-msg">This field is required</span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="">Description</label> <br />
            <textarea
              {...register("description", { required: true })}
              className="text-area"
              id=""
            ></textarea>
            {errors.description && (
              <span className="err-msg">This field is required</span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="">Date</label> <br />
            <input {...register("date", { required: true })} type="date" />
            {errors.date && (
              <span className="err-msg">This field is required</span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="">Assign to</label> <br />
            <select required {...register("assign", { required: true })}>
              {" "}
              {user?.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assign && (
              <span className="err-msg">This field is required</span>
            )}
            {/* <p style={{ color: "red", marginTop: "5px" }}>{formErr}</p> */}
          </div>
        </div>
        <button type="submit" className="add-task-btn2">
          Add
        </button>
      </form>
    </div>
  );
}

export default memo(Modal);
