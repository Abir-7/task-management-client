import { Link } from "react-router-dom";
import "./navbar.css";
import { FaComments, FaHome, FaTasks } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi"
import { FaRegUser } from "react-icons/fa"
function Navbar() {
  function profileOption() {
    const profileIcon = document.getElementById(
      "profile-option"
    ) as HTMLElement;
    profileIcon.classList.toggle("actives");
  }
  return (
    <div className="navbar">
      <ul className="nav-link">
        <li>
          <Link className="link" to="/">
            <FaHome />
          </Link>
        </li>
        <li>
          <Link className="link" to="/chat">
            <FaComments />
          </Link>
        </li>
        <li>
          <Link className="link" to="/task">
            <FaTasks />
          </Link>
        </li>
      </ul>

      <div id="profile" className="profile" onClick={profileOption} >
        <div id="profile-option" className="profile-option">
         <button className="logout"><BiLogOutCircle></BiLogOutCircle></button>
         <Link className="user" to={'#'}><FaRegUser></FaRegUser></Link>
        </div>
        <img
          src="https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"
          alt=""
        />
      </div>
    </div>
  );
}

export default Navbar;
