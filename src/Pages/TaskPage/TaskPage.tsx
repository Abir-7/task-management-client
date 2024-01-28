import { useEffect, useState } from "react";

import { BiTask } from "react-icons/bi";
import { IoMdSearch } from "react-icons/io";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AllTaskHeader from "./AllTaskHeader";
import TaskDescription from "./TaskDescription";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Modal from "./Modal";
import { useGetAllTaskQuery } from "../../Redux/feature/api/baseApi";
import Loading from "../../components/Loading/Loading";
import { change_Modal_Task_Status } from "../../Redux/feature/modal&SlideSlice/modal&Slide_Slice";
import { useParams } from "react-router-dom";
import img from "../../assets/default.jpg";
import { socket } from "../../socketio/socketio";
type AssignedPerson = {
  _id: string;
  email: string;
  name: string;
  photoURL: string;
};

interface Task {
  taskName: string;
  description: string;
  assign: any; // Replace 'any' with the actual type of the 'assign' property
  date: string;
  status: string;
}

interface TaskLists {
  pendingTask?: Task[];
  onGoingTask?: Task[];
  completedTask?: Task[];
}

interface getAllTask {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: string;
}
function TaskPage() {
  const {
    userName,
    email,
    isSignupSuccessfull,
    isAdmin,
    adminError,
    userInfoError,
  } = useSelector((state: RootState) => state.userInfo);
  const { id } = useParams<{ id: string }>();
  console.log(
    id,
    "id",
    userName,
    isSignupSuccessfull,
    adminError,
    userInfoError
  );
  const dispatch = useDispatch();

  const { isModal_Task_true } = useSelector(
    (state: RootState) => state.modalStatus
  );

  const [searchValue, setSearchValue] = useState("");

  const {
    data: allTask,
    isLoading,
    refetch,
  } = useGetAllTaskQuery<getAllTask>({ id }, { pollingInterval: 1800000 });
  console.log(allTask, "all task");

  const filteredTask = searchValue == "" ? allTask?.getAllTask : filterTask();
  console.log(filteredTask, "all task 2");

  function filterTask(): TaskLists {
    const pendingTask = allTask?.pendingTask.filter((task: any) =>
      task.taskName.toLowerCase().includes(searchValue.toLowerCase())
    );
    const onGoingTask = allTask?.onGoingTask.filter((task: any) =>
      task.taskName.toLowerCase().includes(searchValue.toLowerCase())
    );
    const completedTask = allTask?.completedTask.filter((task: any) =>
      task.taskName.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log(pendingTask, "1");
    console.log(onGoingTask, "2");
    console.log(completedTask, "3");
    return {
      pendingTask: pendingTask,
      onGoingTask: onGoingTask,
      completedTask: completedTask,
    };
  }
  useEffect(() => {
    filterTask();
  }, [searchValue]);

  useEffect(() => {
    socket.on("newTask", (data) => {
      if (data) {
        console.log('hit from server')
        refetch();
      }
    });
  }, [socket]);

  function showSidebar() {
    document.getElementById("my-task-section")?.classList.toggle("active");
  }
  function openSearch() {
    document.getElementById("search")?.classList.toggle("active");
    console.log("active");
  }

  function showModal(isTrue: boolean) {
    if (isTrue) {
      document.getElementById("show-modal")?.classList.add("active");
    } else {
      document.getElementById("show-modal")?.classList.remove("active");
    }
  }

  useEffect(() => {
    showModal(isModal_Task_true);
  }, [isModal_Task_true]);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState<number>(0);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages: AssignedPerson[] =
    allTask?.assignedPerson?.slice(startIndex, endIndex) || [];

  const nextPage = () => {
    setCurrentPage((prevPage: number) =>
      Math.min(
        prevPage + 1,
        Math.ceil(allTask?.assignedPerson?.length / itemsPerPage) - 1
      )
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage: number) => Math.max(prevPage - 1, 0));
  };

  return (
    <>
      {!isLoading ? (
        <div className="with-modal">
          <div id="show-modal" className="show-modal">
            <Modal
              id={id}
              isModal_Task_true={isModal_Task_true}
              user={allTask?.withOutAdmin}
            ></Modal>
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
                  <div id="search" className="searchbox">
                    {" "}
                    <input
                      value={searchValue}
                      className="search"
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      type="text"
                    />
                  </div>
                  <span onClick={openSearch}>
                    <IoMdSearch />
                  </span>
                  {/* <span>
                    <MdOutlineNotifications />
                  </span> */}
                  <button
                    style={
                      isAdmin && allTask?.isCompleted == false
                        ? {}
                        : { display: "none" }
                    }
                    onClick={() =>
                      dispatch(change_Modal_Task_Status(!isModal_Task_true))
                    }
                    className="add-task-btn"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              <div className="all-task-progress">
                <div className="pending-box">
                  <AllTaskHeader
                    length={allTask?.pendingTask?.length}
                    statusName={"Up Next"}
                  ></AllTaskHeader>
                  <TaskDescription
                    isAdmin={isAdmin}
                    email={email}
                    id={id}
                    tasks={
                      searchValue == ""
                        ? allTask?.pendingTask
                        : filteredTask?.pendingTask
                    }
                  ></TaskDescription>
                </div>
                <div className="progess-box">
                  <AllTaskHeader
                    length={allTask?.onGoingTask?.length}
                    statusName={"In Progress"}
                  ></AllTaskHeader>
                  <TaskDescription
                    isAdmin={isAdmin}
                    email={email}
                    id={id}
                    tasks={
                      searchValue == ""
                        ? allTask?.onGoingTask
                        : filteredTask?.onGoingTask
                    }
                  ></TaskDescription>
                </div>
                <div className="completed-box">
                  <AllTaskHeader
                    length={allTask?.completedTask?.length}
                    statusName={"Completed"}
                  ></AllTaskHeader>
                  <TaskDescription
                    isAdmin={isAdmin}
                    email={email}
                    id={id}
                    tasks={
                      searchValue == ""
                        ? allTask?.completedTask
                        : filteredTask?.completedTask
                    }
                  ></TaskDescription>
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
                  {currentImages?.map((person, index) => (
                    <div key={index} className="tooltip">
                      <img
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={person?.name}
                        className="member-slide"
                        key={index}
                        src={person.photoURL ? person.photoURL : img} //to do add real image
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
                {/* {allTask?.getAllTask.map((task:any, index:number) => (
                  <div key={index} className="my-task-name">
                    <div className="my-task-taskname">{task.task}</div>
                    <div className="my-task-taskname">
                      {task.isCompleted ? "True" : "False"}
                    </div>
                  </div>
                ))} */}

                {allTask?.getAllTask
                  .filter((task: any) => task.assign.email == email)
                  ?.map((task: any, index: number) => {
                    return (
                      <div key={index} className="my-task-name">
                        <div className="my-task-taskname">{task.taskName}</div>
                        <div className="my-task-taskname">{task.status}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}

export default TaskPage;
