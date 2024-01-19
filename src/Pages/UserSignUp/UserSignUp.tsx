import { SubmitHandler, useForm } from "react-hook-form";
import { FaLocationArrow } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  setSingupStatus,
  userReg,
} from "../../Redux/feature/userInfo/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../Redux/store";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
function UserSignUp() {

  const [isSignupLoading,setIsSignupLoading]=useState(false)

  const navigate = useNavigate();
  interface Inputs {
    name: string;
    email: string;
    mobile: number;
    password: string;
    image:any
  }
  const dispatch = useDispatch<typeof store.dispatch>();

  const { isSignupSuccessfull, userInfoError } = useSelector(
    (state: RootState) => state.userInfo
  );

  //console.log(userName,email)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data.image[0])
    setIsSignupLoading(true)
    const formData = new FormData()
        formData.append('image', data.image[0]);
    dispatch(
      userReg({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        formData:formData
      })
    );
    reset()
  };

  useEffect(() => {
    if (isSignupSuccessfull) {
      setIsSignupLoading(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signup Successful",
        showConfirmButton: false,
        timer: 1500,
      });
      dispatch(setSingupStatus(false));
      navigate("/");
    }

    if(isSignupSuccessfull==false){
      setIsSignupLoading(false)
    }

  }, [isSignupSuccessfull]);

  return (
    <div className="login-background">
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)} action="">
          <fieldset>
            <legend>Signup:</legend>
            <div className="form-section">
              <div>
                <label htmlFor="">Name</label> <br />
                <input {...register("name", { required: true })} type="text" />
                {errors.name && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
              <br />
              <div>
                <label htmlFor="">Email</label> <br />
                <input
                  {...register("email", { required: true })}
                  type="email"
                />
                {errors.email && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
              <br />
              <div>
                <label htmlFor="">Mobile</label> <br />
                <input
                  {...register("mobile", { required: true })}
                  type="number"
                />
                {errors.mobile && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
              <br />
              <div>
                <label htmlFor="">Profile Image</label> <br />
                <input
                  {...register("image", { required: true })}
                  type="file"
                />
                {errors.image && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
              <br />
              <div>
                <label htmlFor="">Password</label> <br />
                <input
                  {...register("password", { required: true })}
                  type="password"
                />
                {errors.password && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
            </div>
            
            <input  type="submit" value={isSignupLoading?'Processing...':"Submit"} />

            <div className="singnup-link-section">
              <div>
                {" "}
                <p className="singnup-link">Already have an account?</p>
              </div>
              <div className="">
                {" "}
                <Link className="singnup-link-2 " to={"/login"}>
                  <span> Login Now </span>
                  <span className="signup-icon">
                    <FaLocationArrow />
                  </span>
                </Link>
              </div>
            </div>
            <div
              style={{ paddingTop: "5px", color: "red", textAlign: "center" }}
            >
              <p>{userInfoError}</p>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="sign-up-logo">
        <MdTaskAlt></MdTaskAlt>
      </div>
    </div>
  );
}

export default UserSignUp;
