import { Navigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { ReactNode, useEffect } from "react";
import { RootState, store } from "../Redux/store";
import Loading from "../components/Loading/Loading";
import { onAuthStateChanged, signOut } from "firebase/auth";
import auth from "../firebaseConfig/firebase";
import {
  checkAdmin,
  setToken,
  setUserInfo,
  setUserLoading,
} from "../Redux/feature/userInfo/userInfoSlice";
interface PrivateRoutesProps {
  children: ReactNode;
}

const PrivetRouts = ({ children }: PrivateRoutesProps) => {

  const location = useLocation();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { email, isUserLoading } = useSelector(
    (state: RootState) => state.userInfo
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any | null) => {
      if (user) {
        //console.log('useeefact')
        const email = user.email;
        console.log(email);
        fetch("https://task-management-system-server-tau.vercel.app/jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        })
          .then((res) => res.json())
          .then((data: any) => {
            //console.log(data)
            localStorage.setItem("access-token", data.token);
            dispatch(setToken(data.token));
            dispatch(
              setUserInfo({ name: user.displayName, email: user.email })
            );
            dispatch(setUserLoading(false));
            dispatch(checkAdmin(user.email));
          });

      } else {
        signOut(auth);
        dispatch(setUserLoading(false));
        dispatch(setUserInfo({ name: "", email: "" }));
        localStorage.removeItem("access-token");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (isUserLoading) {
    return (
      <div className="">
        <Loading></Loading>
      </div>
    );
  } else {
    ////console.log(userLoading,userEmail)

    if (email) {
      return children;
    } else {
      signOut(auth);
      dispatch(setUserInfo({ name: "", email: "" }));
      return (
        <Navigate to="/login" state={{ from: location }} replace></Navigate>
      );
    }
  }
};

export default PrivetRouts;
