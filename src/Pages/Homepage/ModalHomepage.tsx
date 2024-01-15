import { SubmitHandler, useForm } from "react-hook-form";

import { useAddProjectMutation } from "../../Redux/feature/api/baseApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { change_Modal_Home_Status } from "../../Redux/feature/modalSlice/modalSlice";
import { useEffect } from "react";
import Swal from "sweetalert2";

interface Inputs {
  projectName: string;
  description: string;
  date: string;
}
function ModalHomepage() {
  const dispatch=useDispatch()
  const { isModal_Home_true } = useSelector(
    (state: RootState) => state.modalStatus
  );
  const [addProject,{isSuccess,isError}] = useAddProjectMutation();
  //console.log(data, isError, isLoading);

  useEffect(()=>{
    if(isSuccess){
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Add Project Successful",
        showConfirmButton: false,
        timer: 1500,

      })
    }
    if(isError){
      Swal.fire({
        position: "center",
        icon: "success",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,

      })
    }
  },[isError,isSuccess])

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    addProject({ ...data, isCompleted: false,allTask:[] });
    dispatch(change_Modal_Home_Status(!isModal_Home_true))
    reset();
  };
  return (
    <div className="modal">
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="" action="">
        <div className="form-section">
          <div>
            <label htmlFor="">Name</label> <br />
            <input
              {...register("projectName", { required: true })}
              type="text"
            />
            {errors.projectName && (
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
        </div>
        <button type="submit" className="add-task-btn2">
          Add
        </button>
      </form>
    </div>
  );
}

export default ModalHomepage;
