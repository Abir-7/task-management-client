import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";


function MainPage() {
  return (
    <>
      <div className="container">
        <div className="box-1">
          <Navbar></Navbar>
        </div>
        <div className="box-2">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}

export default MainPage;
