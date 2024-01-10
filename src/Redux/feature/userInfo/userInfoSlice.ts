import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import auth from "../../../firebaseConfig/firebase";

interface userInfo {
  userName: string | null;
  email: string | null;
  token: string;
  isUserLoading: boolean;

  isUserInfoError: boolean;
  userInfoError: any;

  isSignupSuccessfull: boolean;

  isAdmin: boolean;
  isAdminError: boolean;
  adminError: any;
}

const initialState: userInfo = {
  userName: "",
  email: "",
  token: "",
  isUserLoading: true,

  isUserInfoError: false,
  userInfoError: "",

  isSignupSuccessfull: false,

  isAdmin: false,
  isAdminError: false,
  adminError: "",
};

export const userReg = createAsyncThunk(
  "userInfoSlice/userReg",
  async ({
    name,
    email,
    mobile,
    password,
  }: {
    name: string;
    email: string;
    mobile: number;
    password: string;
  }) => {
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      console.log(data);
      if (data.user && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: null,
        });
        const res: any = await fetch("http://localhost:3000/addNewUser", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            name: name,
            mobile: mobile,
            role: "user",
          }),
        });
        if (!res.ok) {
          // Handle the error based on the status code
          console.log(`Error: ${res.status} - ${res.statusText}`, "userslice");
          await deleteUser(auth.currentUser);
          throw res.status + " " + "Server Error";
        } else {
          console.log(res.ok, "userslice2");
        }
        return {
          name: data.user.displayName,
          email: data.user.email,
        };
      } else {
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
        }
        return {
          name: "",
          email: "",
        };
      }
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  }
);

//is admin
export const checkAdmin = createAsyncThunk(
  "userInfoSlice/checkAdmin",
  async (email:string) => {
    try {
      const response = await fetch(`http://localhost:3000/checkAdmin?email=${email}`);
      if (!response.ok) {
        throw new Error(`Failed to check admin status. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data,'checkAdmin');
      return data.isAdmin
    } catch (error) {
      throw error;
    }
  }
);

//user login
export const userLogin = createAsyncThunk(
  "userInfoSlice/userLogin",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const data: any = await signInWithEmailAndPassword(auth, email, password);
      console.log(data, "user signin", data?._tokenResponse?.displayName);
      return {
        name: data?._tokenResponse?.displayName
          ? data?._tokenResponse?.displayName
          : "",
        email: data?._tokenResponse?.email,
      };
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      { payload }: PayloadAction<{ email: string; name: string }>
    ) => {
      state.email = payload.email;
      state.userName = payload.name;
    },
    setUserLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isUserLoading = payload;
    },
    setSingupStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isSignupSuccessfull = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userReg.pending, (state) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = true;
        state.isUserInfoError = false;
        state.userInfoError = "";
      })
      .addCase(
        userReg.fulfilled,
        (
          state,
          action: PayloadAction<{ name: string | null; email: string | null }>
        ) => {
          state.userName = action.payload.name;
          state.email = action.payload.email;
          state.isUserLoading = false;
          state.isUserInfoError = false;
          state.userInfoError = "";
          state.isSignupSuccessfull = true;
        }
      )
      .addCase(userReg.rejected, (state, action) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = false;
        state.isUserInfoError = true;
        state.userInfoError = action.error.message;
        state.isSignupSuccessfull = false;
      })

      .addCase(userLogin.pending, (state) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = true;
        state.isUserInfoError = false;
        state.userInfoError = "";
      })
      .addCase(
        userLogin.fulfilled,
        (state, action: PayloadAction<{ name: string; email: string }>) => {
          state.userName = action.payload.name;
          state.email = action.payload.email;
          state.isUserLoading = false;
          state.isUserInfoError = false;
          state.userInfoError = "";
          state.isSignupSuccessfull = true;
        }
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = false;
        state.isUserInfoError = true;
        state.userInfoError = action.error.message;
        state.isSignupSuccessfull = false;
      })

      .addCase(checkAdmin.pending, (state) => {
        state.isAdmin= false,
        state.isAdminError= false,
        state.adminError= ""
      })
      
      .addCase(
        checkAdmin.fulfilled,
        (
          state,
          action: PayloadAction<boolean>
        ) => {
          state.isAdmin= action.payload,
          state.isAdminError= false,
          state.adminError= ""
        })
        
      .addCase(checkAdmin.rejected, (state, action) => {
        state.isAdmin= false,
        state.isAdminError= true,
        state.adminError=action.error.message
      })
  },
});

export const { setSingupStatus, setUserInfo, setUserLoading } =
  userInfoSlice.actions;
export default userInfoSlice.reducer;
