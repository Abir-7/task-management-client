import React, { memo, useState } from "react";
import { useAddTaskMutation } from "../../Redux/feature/api/baseApi";

interface showModal {
  showModal: () => void;
}
function Modal({ showModal }: showModal) {
  const [formData, setFromData] = useState({
    task_name: "",
    description: "",
    date: "",
    assign: "",
  });

  const [addTasks, { data, isError, error }] = useAddTaskMutation();
  console.log(data,'16');
  function addTask(e: React.FormEvent) {
    e.preventDefault();
    showModal();
    addTasks(formData);
    setFromData({
      task_name: "",
      description: "",
      date: "",
      assign: "",
    });
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal">
      <h2>Add Task</h2>
      <form className="" action="">
        <div className="form-section">
          <div>
            <label htmlFor="">Name</label> <br />
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleInputChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="">Description</label> <br />
            <textarea
              className="text-area"
              name="description"
              id=""
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <br />
          <div>
            <label htmlFor="">Date</label> <br />
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
          <br />
          <div>
            <label htmlFor="">Assign to</label> <br />
            <input
              name="assign"
              type="text"
              value={formData.assign}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button onClick={addTask} className="add-task-btn2">
          Add
        </button>
      </form>
    </div>
  );
}

export default memo(Modal);
