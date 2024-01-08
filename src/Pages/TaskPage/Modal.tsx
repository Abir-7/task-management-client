
interface showModal{
    showModal:()=>void
}
function Modal({showModal}:showModal) {


  function addTask(e: React.FormEvent): void {
    e.preventDefault();
    console.log("hit");
    showModal()
  }
  return (
    <div className="modal">
      <h2>Add Task</h2>
      <form className="" action="">
        <div className="form-section">
          <div>
            <label htmlFor="">Name</label> <br />
            <input type="text" />
          </div>
          <br />
          <div>
            <label htmlFor="">Description</label> <br />
            <textarea className="text-area" name="" id=""></textarea>
          </div>
          <br />
          <div>
            <label htmlFor="">Date</label> <br />
            <input type="date" />
          </div>
          <br />
          <div>
            <label htmlFor="">Assign to</label> <br />
            <input type="text" />
          </div>
        </div>
        <button onClick={addTask} className="add-task-btn2">
          Add
        </button>
      </form>
    </div>
  );
}

export default Modal;
