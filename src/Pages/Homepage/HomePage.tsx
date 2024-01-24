import { useEffect } from "react";
import {
  useGetAllProjectQuery,
  useUpdateProjectMutation,
} from "../../Redux/feature/api/baseApi";
import ModalHomepage from "./ModalHomepage";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../components/Loading/Loading";

function HomePage() {
  const { isAdmin, token,email,isUserLoading } = useSelector((state: RootState) => state.userInfo);
  const [updatePoject, { isSuccess, isError }] = useUpdateProjectMutation();


  const { data: projects, isLoading ,refetch} = useGetAllProjectQuery("", {
    skip: (token && email && !isUserLoading )?false:true,
  });

useEffect(()=>{
if(token){
  refetch()
}
},[token,email ])

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Project Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    if (isError) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [isError, isSuccess]);

  // //console.log(projects, isAdmin);
  function showModal(isTrue: boolean) {
    if (isTrue) {
      document.getElementById("show-modal2")?.classList.add("active");
    } else {
      document.getElementById("show-modal2")?.classList.remove("active");
    }
  }

  const { isModal_Home_true } = useSelector(
    (state: RootState) => state.modalStatus
  );

  useEffect(() => {
    showModal(isModal_Home_true);
  }, [isModal_Home_true]);
  ////console.log(isModal_Home_true, "homepage");
  return (
    <>
      {!isLoading && projects ? (
        <div className="homepage-container-with-modal">
          <div id="show-modal2" className="show-modal">
            <ModalHomepage></ModalHomepage>
          </div>
          <div className="homepage-container">
            <div className="homepage-box1">
              <h1>On Goning Project</h1>

              {projects?.pendingProject.map((project, index) => (
                <div key={index} className="task-description2">
                  <h3>{project.projectName}</h3>
                  <div className="description2">
                    <p>
                      <b> Description:</b> {project.description}
                    </p>
                  </div>
                  <div className="time">
                    <h4>{project.date}</h4>{" "}
                    <div className="hompage-action">
                      <Link className="link" to={`/task/${project._id}`}>
                        View Update
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() =>
                            updatePoject({ id: project._id, isCompleted: true })
                          }
                        >
                          Click Here if Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="homepage-box2">
              <h1>Completed Project</h1>

              {projects?.completedProject.map((project, index) => (
                <div key={index} className="task-description2">
                  <h3>{project.projectName}</h3>
                  <div className="description2">
                    <p>
                      <b> Description:</b> {project.description}
                    </p>
                  </div>
                  <div className="time">
                    <h4>{project.date}</h4>{" "}
                    <div className="hompage-action">
                      <Link className="link" to={`/task/${project._id}`}>
                        View Update
                      </Link>
                      {isAdmin || project.isCompleted ? (
                        <></>
                      ) : (
                        <button
                          onClick={() =>
                            updatePoject({ id: project._id, isCompleted: true })
                          }
                        >
                          Click Here if Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}

export default HomePage;
