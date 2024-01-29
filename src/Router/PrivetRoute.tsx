import { Navigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { ReactNode, useEffect } from "react";
import { RootState, store } from "../Redux/store";
import Loading from "../components/Loading/Loading";
import { onAuthStateChanged, signOut } from "firebase/auth";
import auth from "../firebaseConfig/firebase";
import {
  checkAdmin,
  setOnlineUser,
  setToken,
  setUserInfo,
  setUserLoading,
} from "../Redux/feature/userInfo/userInfoSlice";
import { socket } from "../socketio/socketio";
interface PrivateRoutesProps {
  children: ReactNode;
}

const PrivetRouts = ({ children }: PrivateRoutesProps) => {
  const location = useLocation();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { email, isUserLoading } = useSelector(
    (state: RootState) => state.userInfo
  );

  useEffect(()=>{
    socket.emit('users',email)
    socket.on('connectedUsers',(data:{email:string,socketID:string}[])=>{
      //console.log(data)
      dispatch(setOnlineUser(data))
    })
},[socket,email])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        fetch("https://task-management-server-16on.onrender.com/jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        })
          .then((res) => res.json())
          .then((data: any) => {
            ////console.log(data)
            localStorage.setItem("access-token", data.token);
            dispatch(
              setUserInfo({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
              })
            );
            dispatch(setUserLoading(false));
            dispatch(checkAdmin(user.email));
            dispatch(setToken(data.token));
          });
      } else {
        signOut(auth);
        dispatch(setToken(''))
        dispatch(setUserLoading(false));
        dispatch(setUserInfo({ name: "", email: "", photoURL: "" }));
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
    if (email) {
      return children;
    } else {
      dispatch(setUserInfo({ name: "", email: "", photoURL: "" }));
      signOut(auth);
      return (
        <Navigate to="/login" state={{ from: location }} replace></Navigate>
      );
    }
  }
};

export default PrivetRouts;
