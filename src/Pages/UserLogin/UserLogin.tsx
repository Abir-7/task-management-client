import { Link } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa6";
import { MdTaskAlt } from "react-icons/md";
function UserLogin() {
  return (
    <div className="login-background">
      <div className="form">
        <form action="">
          <fieldset>
            <legend>Login:</legend>
            <div className="form-section">
              <div>
                <label htmlFor="">Email</label> <br />
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
          </fieldset>
        </form>
      </div>
      <div className="sign-up-logo"><MdTaskAlt></MdTaskAlt></div>
    </div>
  );
}

export default UserLogin;
