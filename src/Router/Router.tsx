import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Pages/Homepage/HomePage";
import MainPage from "../PageLayout/MainPage";
import TaskPage from "../Pages/TaskPage/TaskPage";
import UserLogin from "../Pages/UserLogin/UserLogin";
import UserSignUp from "../Pages/UserSignUp/UserSignUp";
import AuthListener from "./AuthListener";
import PrivetRouts from "./PrivetRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthListener>
        <MainPage></MainPage>
      </AuthListener>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivetRouts>
            <HomePage></HomePage>
          </PrivetRouts>
        ),
      },
      {
        path: "/task",
        element: (
          <PrivetRouts>
            <TaskPage></TaskPage>
          </PrivetRouts>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <UserLogin />,
  },
  {
    path: "/signup",
    element: <UserSignUp />,
  },
]);

export default router;
