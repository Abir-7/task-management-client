import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import auth from "../../../firebaseConfig/firebase";
import axios from "axios";
interface userInfo {
  userName: string;
  email: string;
  token: any;
  isUserLoading: boolean;
  profileImage:string,
  isUserInfoError: boolean;
  userInfoError: any;

  isSignupSuccessfull: string|boolean;

  isAdmin: boolean;
  isAdminError: boolean;
  adminError: any;

  isProcessing:boolean
}

const initialState: userInfo = {
  userName: "",
  email: "",
  token: "",
  isUserLoading: true,
  profileImage:'',
  isUserInfoError: false,
  userInfoError: "",

  isSignupSuccessfull: '',

  isAdmin: false,
  isAdminError: false,
  adminError: "",

  isProcessing:false
};

export const userReg = createAsyncThunk(
  "userInfoSlice/userReg",
  async ({
    name,
    email,
    mobile,
    password,
    formData,
  }: {
    name: string;
    email: string;
    mobile: number;
    password: string;
    formData: any;
  }) => {
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      ////console.log(data);
      const imageHoistingURL = `https://api.imgbb.com/1/upload?key=a7e4f34c37cbe7ac4c1833f93738721a`;

      if (data.user && auth.currentUser) {

        const response= await axios.post(imageHoistingURL,formData)
       
          if (!response.data.status) {
            deleteUser(auth.currentUser!);
            throw response.status + " " + "Server Error";
          } else {
            updateProfile(auth.currentUser!, {
              displayName: name,
              photoURL: response.data.data.display_url,
            });
          }
          //console.log(response.data,'image')
        const res = await fetch(
          "https://task-management-server-16on.onrender.com/addNewUser",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              email: email.toLowerCase(),
              name: name,
              mobile: mobile,
              role: "user",
              photoURL: response.data.data.display_url
            }),
          }
        );
        if (!res.ok) {
          await deleteUser(auth.currentUser);
          throw res.status + " " + "Server Error";
        } 
        else {
          return {
            name: data.user.displayName ? data.user.displayName : "",
            email: data.user.email ? data.user.email : "",profileImage:response.data.data.display_url
          };
        }
      } else {
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
        }
        return {
          name: "",
          email: "",
          profileImage:'',
        };
      }
    } catch (error: any) {
      ////console.log(error.message);
      throw error;
    }
  }
);

//is admin
export const checkAdmin = createAsyncThunk(
  "userInfoSlice/checkAdmin",
  async (email: string) => {
    const token = localStorage.getItem("access-token");
    try {
      const response = await fetch(
        `https://task-management-server-16on.onrender.com/checkAdmin?email=${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust the content type if necessary
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to check admin status. Status: ${response.status}`
        );
      }
      const data = await response.json();
      ////console.log(data,'checkAdmin');
      return data.isAdmin;
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
      ////console.log(data, "user signin", data?._tokenResponse?.displayName);
      return {
        name: data._tokenResponse.displayName
          ? data._tokenResponse.displayName
          : "",
        email: data._tokenResponse.email ? data._tokenResponse.email : "",
      };
    } catch (error: any) {
      ////console.log(error.message);
      throw error;
    }
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<any>) => {
      state.token = payload;
    },
    setIsProcessing: (state, { payload }: PayloadAction<boolean>) => {
      state.isProcessing = payload;
    },
    setUserInfo: (
      state,
      { payload }: PayloadAction<{ email: string; name: string,photoURL:string }>
    ) => {
      state.email = payload.email;
      state.userName = payload.name;
      state.profileImage=payload.photoURL
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
        state.isProcessing = true
      })
      .addCase(
        userReg.fulfilled,
        (state, action: PayloadAction<{ name: string; email: string,profileImage:string }>) => {
          state.userName = action.payload.name;
          state.email = action.payload.email;
          state.isUserLoading = false;
          state.isUserInfoError = false;
          state.userInfoError = "";
          state.isSignupSuccessfull = true;
          state.profileImage=action.payload.profileImage
          state.isProcessing = true
        }
      )
      .addCase(userReg.rejected, (state, action) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = false;
        state.isUserInfoError = true;
        state.userInfoError = action.error.message;
        state.isSignupSuccessfull = false;
        state.isProcessing = false
      })

      .addCase(userLogin.pending, (state) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = true;
        state.isUserInfoError = false;
        state.userInfoError = "";
        state.isProcessing = true
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
          state.isProcessing = true
        }
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.userName = "";
        state.email = "";
        state.isUserLoading = false;
        state.isUserInfoError = true;
        state.userInfoError = action.error.message;
        state.isSignupSuccessfull = false;
        state.isProcessing = false
      })

      .addCase(checkAdmin.pending, (state) => {
        (state.isAdmin = false),
          (state.isAdminError = false),
          (state.adminError = "");
      })

      .addCase(
        checkAdmin.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          (state.isAdmin = action.payload),
            (state.isAdminError = false),
            (state.adminError = "");
        }
      )

      .addCase(checkAdmin.rejected, (state, action) => {
        (state.isAdmin = false),
          (state.isAdminError = true),
          (state.adminError = action.error.message);
      });
  },
});

export const { setSingupStatus, setUserInfo, setUserLoading, setToken,setIsProcessing } =
  userInfoSlice.actions;
export default userInfoSlice.reducer;
