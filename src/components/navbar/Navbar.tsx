import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "firebase/auth";
import auth from "../../firebaseConfig/firebase";
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { change_Modal_Home_Status } from "../../Redux/feature/modalSlice/modalSlice";
import { Tooltip } from "react-tooltip";

function Navbar() {
  const {
    userName,
    isAdmin,
    profileImage
  } = useSelector((state: RootState) => state.userInfo);
  const { isModal_Home_true } = useSelector(
    (state: RootState) => state.modalStatus
  );
  const dispatch = useDispatch();
  const location = useLocation();
  //console.log(location, "location");
  function profileOption() {
    const profileIcon = document.getElementById(
      "profile-option"
    ) as HTMLElement;
    profileIcon.classList.toggle("actives");
  }
  const logOutUser = () => {
    signOut(auth);
  };

  const changeModalStatus = (isModal_Home_true: boolean) => {
    dispatch(change_Modal_Home_Status(!isModal_Home_true));
  };

  return (
    <div className="navbar">
      <ul className="nav-link">
        <li>
          <Link className="link" to="/">
            <FaHome />
          </Link>
        </li>
        {(location.pathname == "/" && isAdmin)&&  (
          <li>
            <button
              onClick={() => changeModalStatus(isModal_Home_true)}
              className="add-project-btn"
            >
              <MdAddCircleOutline />
            </button>
          </li>
        )}
      </ul>

      <div id="profile" className="profile" onClick={profileOption}>
        <div id="profile-option" className="profile-option">
          <button onClick={logOutUser} className="logout">
            <BiLogOutCircle></BiLogOutCircle>
          </button>
          {/* <Link className="user" to={"#"}>
            <FaRegUser></FaRegUser>
          </Link> */}
        </div>
        <img
          data-tooltip-id="my-tooltip"
          data-tooltip-content={userName}
          src={profileImage?profileImage:"https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg?w=1380&t=st=1704644431~exp=1704645031~hmac=7652214cef9b38ab9cf939c9bdbc9ab6951115f4d86a2cfb5211fc2b3e8243b2"}
          alt=""
        />
        <Tooltip
          style={{
            backgroundColor: "#9f65fc",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
          }}
          id="my-tooltip"
        ></Tooltip>
      </div>
    </div>
  );
}

export default Navbar;
