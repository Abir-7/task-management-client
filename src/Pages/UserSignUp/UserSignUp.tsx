import { FaLocationArrow } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { Link } from "react-router-dom";

function UserSignUp() {
  return (
    <div className="login-background">
      <div className="form">
        <form action="">
          <fieldset>
            <legend>Signup:</legend>
            <div className="form-section">
              <div>
                <label htmlFor="">Name</label> <br />
                <input type="text" />
              </div>
             <br />
              <div>
                <label htmlFor="">Email</label> <br />
                <input type="email" />
              </div>
              <br />
              <div>
                <label htmlFor="">Mobile</label> <br />
                <input type="email" />
              </div>
              <br />
              <div>
                <label htmlFor="">Password</label> <br />
                <input type="password" />
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
