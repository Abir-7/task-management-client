import { SubmitHandler, useForm } from "react-hook-form";
import { FaLocationArrow } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { setSingupStatus, userReg } from "../../Redux/feature/userInfo/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../Redux/store";
import Swal from 'sweetalert2'
import { useEffect } from "react";
function UserSignUp() {
  const navigate=useNavigate()
  interface Inputs {
    name: string;
    email: string;
    mobile: number;
    password: string;
  }
  const dispatch = useDispatch<typeof store.dispatch>();

  const { userName, email,isSignupSuccessfull ,userInfoError} = useSelector((state: RootState) => state.userInfo);

  console.log(userName,email)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(
      userReg({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      })
    );
  };

  useEffect(()=>{
  if(isSignupSuccessfull){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    })
    dispatch(setSingupStatus(false))
    navigate('/')
  }
  },[isSignupSuccessfull])

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
            <input type="submit" value={"Submit"} />
          <div style={{paddingTop:'5px',color:'red',textAlign:'center'}}>
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
