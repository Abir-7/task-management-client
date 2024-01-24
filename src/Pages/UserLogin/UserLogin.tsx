import { Link, useNavigate } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa6";
import { MdTaskAlt } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../Redux/store";
import { setSingupStatus, userLogin } from "../../Redux/feature/userInfo/userInfoSlice";
import { useEffect } from "react";
import Swal from "sweetalert2";

interface Inputs {
  email: string;
  password: string;
}

function UserLogin() {
  const navigate=useNavigate()
  const { isSignupSuccessfull ,userInfoError} = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch<typeof store.dispatch>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data:Inputs) => {
    ////console.log(data)
    dispatch(
      userLogin({
        email: data.email,
        password: data.password,
      })
    );
  };

  useEffect(()=>{
    if(isSignupSuccessfull){
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
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
            <legend>Login:</legend>
            <div className="form-section">
              <div>
                <label htmlFor="">Email</label> <br />
                <input {...register("email", { required: true })} type="email" />
                {errors.email && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
              <br />
              <div>
                <label htmlFor="">Password</label> <br />
                <input {...register("password", { required: true })} type="password" />
                {errors.password && (
                  <span className="err-msg">This field is required</span>
                )}
              </div>
            </div>
            <div className="singnup-link-section">
              <div>
                {" "}
                <p className="singnup-link">Don't have an account?</p>
              </div>
              <div className="">
                {" "}
                <Link className="singnup-link-2 " to={"/signup"}>
                  <span> Create Now </span>
                  <span className="signup-icon">
                    <FaLocationArrow />
                  </span>
                </Link>
              </div>
            </div>
            <input type="submit" value={'Submit'} />
            <div style={{paddingTop:'5px',color:'red',textAlign:'center'}}>
          <p>{userInfoError}</p>
          </div>
          </fieldset>
        </form>
      </div>
      <div className="sign-up-logo"><MdTaskAlt></MdTaskAlt></div>
    </div>
  );
}

export default UserLogin;
