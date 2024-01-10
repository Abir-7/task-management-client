import { onAuthStateChanged, signOut } from "firebase/auth";
import { ReactNode, useEffect } from "react";
import auth from "../firebaseConfig/firebase";
import { useDispatch } from "react-redux";
import { store } from "../Redux/store";
import {
  checkAdmin,
  setUserInfo,
  setUserLoading,
} from "../Redux/feature/userInfo/userInfoSlice";

interface PrivateRoutesProps {
  children: ReactNode;
}

function AuthListener({ children }: PrivateRoutesProps) {
  const dispatch = useDispatch<typeof store.dispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any | null) => {
      if (user) {
        console.log('useeefact')
          dispatch(checkAdmin(user.email))
        fetch("http://localhost:3000/jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        })
          .then((res) => res.json())
          .then((data:any) => {
            console.log(data)
            localStorage.setItem("access-token", data.token);
            dispatch(
              setUserInfo({ name: user.displayName, email: user.email })
            );
            dispatch(setUserLoading(false));
          });
      } else {
        signOut(auth)
        dispatch(setUserLoading(false));
        dispatch(setUserInfo({ name: "", email: "" }));
        localStorage.removeItem("access-token");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return children;
}

export default AuthListener;
