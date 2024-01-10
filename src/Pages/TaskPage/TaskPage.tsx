import { useState } from "react";
import "./taskpage.css";
import { BiTask } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineNotifications } from "react-icons/md";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AllTaskHeader from "./AllTaskHeader";
import TaskDescription from "./TaskDescription";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Modal from "./Modal";
import { useGetAllTaskQuery } from "../../Redux/feature/api/baseApi";

function TaskPage() {
  const { status } = useSelector((state: RootState) => state.taskProgess);
  console.log(status);

  interface getAllTask{
    data:any,
    isLoading:boolean,
    isError:boolean,
    error:string
  }

  const {data,isLoading,isError,error}=useGetAllTaskQuery<getAllTask>()
console.log(data,error)

  function showSidebar() {
    document.getElementById("my-task-section")?.classList.toggle("active");
  }

  function showModal() {
    document.getElementById("show-modal")?.classList.toggle("active");
  }

  interface taskArray {
    task: string;
    isCompleted: boolean;
  }

  const array: taskArray[] = [
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
    { task: "remove button", isCompleted: true },
  ];

  const array2: string[] | null = [
    "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?w=826&t=st=1704539671~exp=1704540271~hmac=b06c842c43b02a10dc79c1899cf3fbba670cbf1f18fe83358183b6336bec1a81",
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1704445183~exp=1704445783~hmac=f58cbf44ff37d48089673e78d8cf2a8f72271f48d4269f85dcc09000584d6ab38",
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1704445183~exp=1704445783~hmac=f58cbf44ff37d48089673e78d8cf2a8f72271f48d4269f85dcc090005846ab38",
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1704445183~exp=1704445783~hmac=f58cbf44ff37d48089673e78d8cf2a8f72271f48d4269f85dcc090005d846ab38",
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1704445183~exp=1704445783~hmac=f58cbf44ff37d48089673e78d8cf2a8f72271f48d4269f85dcc09000584d6ab38",
    "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?w=826&t=st=1704539671~exp=1704540271~hmac=b06c842c43b02a10dc79c1899cf3fbba670cbf1f18fe83358183b6336bec1a81",
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1704445183~exp=1704445783~hmac=f58cbf44ff37d48089673e78d8cf2a8f72271f48d4269f85dcc090005846ab38",
  ];

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState<number>(0);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = array2?.slice(startIndex, endIndex) || [];

  const nextPage = () => {
    setCurrentPage((prevPage: number) =>
      Math.min(prevPage + 1, Math.ceil(array2?.length / itemsPerPage) - 1)
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage: number) => Math.max(prevPage - 1, 0));
  };

  return (
    <div className="with-modal">
      <div id="show-modal" className="show-modal">
        <Modal showModal={showModal}></Modal>
      </div>
      <div className="task-full-container">
        <div className="task-container">
          <div className="option">
            <div className="main-title">
              <div>
                <p onClick={showSidebar} className="task-icon">
                  {" "}
                  <BiTask />
                </p>
              </div>
              <div>
                <p>Task</p>
              </div>
            </div>
            <div className="task-action">
              <span>
                <IoMdSearch />
              </span>
              <span>
                <MdOutlineNotifications />
              </span>
              <button onClick={showModal} className="add-task-btn">
                Add Task {data?.length}
              </button>
            </div>
          </div>
          
          <div className="all-task-progress">
            <div className="pending-box">
              <AllTaskHeader statusName={"Up Next"}></AllTaskHeader>
              <TaskDescription></TaskDescription>
            </div>
            <div className="progess-box">
              <AllTaskHeader statusName={"In Progress"}></AllTaskHeader>
              <TaskDescription></TaskDescription>
            </div>
            <div className="completed-box">
              <AllTaskHeader statusName={"Completed"}></AllTaskHeader>
              <TaskDescription></TaskDescription>
            </div>
          </div>
        </div>

        <div id="my-task-section" className="my-task-section">
          <div className="member-section">Members</div>
          <div className="member-photo-container">
            <button className="show-member-button" onClick={prevPage}>
              <FaArrowCircleLeft></FaArrowCircleLeft>
            </button>
            <div id="member-photo" className="member-photo-list">
              {currentImages?.map((img, index) => (
                <div className="tooltip">
                  <img
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={index + "md. tazwarul islam abir"}
                    className="member-slide"
                    key={index}
                    src={img}
                    alt=""
                  />
                  <Tooltip
                    id="my-tooltip"
                    style={{
                      backgroundColor: "#9f65fc",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
                    }}
                  />
                </div>
              ))}
            </div>
            <button className="show-member-button" onClick={nextPage}>
              <FaArrowCircleRight></FaArrowCircleRight>
            </button>
          </div>
          <div className="my-task-section-two">My Task</div>
          <div className="my-task-list">
            {array.map((task, index) => (
              <div key={index} className="my-task-name">
                <div className="my-task-taskname">{task.task}</div>
                <div className="my-task-taskname">
                  {task.isCompleted ? "True" : "False"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
