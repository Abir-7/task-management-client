import { Navigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { ReactNode } from "react";
import { RootState, store } from "../Redux/store";
import Loading from "../components/Loading/Loading";
import { signOut } from "firebase/auth";
import auth from "../firebaseConfig/firebase";
import { setUserInfo } from "../Redux/feature/userInfo/userInfoSlice";


interface PrivateRoutesProps {
  children: ReactNode;
}

const PrivetRouts = ({ children }: PrivateRoutesProps) => {
  const location = useLocation();
  const dispatch=useDispatch<typeof store.dispatch>()
  const { email, isUserLoading } = useSelector(
    (state: RootState) => state.userInfo
  );

  if (isUserLoading) {
    return (
      <div className="">
        <Loading></Loading>
      </div>
    );
  } else {
    //console.log(userLoading,userEmail)

    if (email) {
      return children;
    } else {
      signOut(auth)
      dispatch(setUserInfo({ name: "", email: "" }))
      return (
        <Navigate to="/login" state={{ from: location }} replace></Navigate>
      );
    }
  }
};

export default PrivetRouts;
